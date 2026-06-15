import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { requireAdmin } from "@/lib/auth";
import { getCloudinary } from "@/lib/cloudinary";
import { uploadSchema } from "@/lib/validations";

export const runtime = "nodejs";

const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function uploadToCloudinary(buffer: Buffer, fileName: string) {
  const client = getCloudinary();
  if (!client) return null;

  return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const stream = client.uploader.upload_stream(
      {
        folder: "thumbrush-portfolio",
        public_id: fileName,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) reject(error);
        else resolve({ secure_url: result.secure_url, public_id: result.public_id });
      },
    );

    stream.end(buffer);
  });
}

export async function POST(request: Request) {
  await requireAdmin();

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No image file provided." }, { status: 400 });
  }

  const validation = uploadSchema.safeParse({ type: file.type, size: file.size });
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.issues[0]?.message ?? "Invalid image." }, { status: 400 });
  }

  const extension = extensions[file.type];
  const fileName = `${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const cloudinaryUpload = await uploadToCloudinary(buffer, fileName.replace(`.${extension}`, ""));

  if (cloudinaryUpload) {
    return NextResponse.json({
      imageUrl: cloudinaryUpload.secure_url,
      imagePublicId: cloudinaryUpload.public_id,
    });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), buffer);

  return NextResponse.json({
    imageUrl: `/uploads/${fileName}`,
    imagePublicId: "",
  });
}
