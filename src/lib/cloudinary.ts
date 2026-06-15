import { v2 as cloudinary } from "cloudinary";

export function hasCloudinaryConfig() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

export function getCloudinary() {
  if (!hasCloudinaryConfig()) return null;

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return cloudinary;
}

export async function deleteCloudinaryImage(publicId?: string | null) {
  const client = getCloudinary();
  if (!client || !publicId) return;
  await client.uploader.destroy(publicId);
}
