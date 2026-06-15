"use client";

import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import type { PortfolioItemView } from "@/components/site/Portfolio";

type PortfolioModalProps = {
  item: PortfolioItemView | null;
  onClose: () => void;
};

export function PortfolioModal({ item, onClose }: PortfolioModalProps) {
  return (
    <Modal open={Boolean(item)} onClose={onClose}>
      {item ? (
        <div className="relative max-h-[92vh] min-h-[360px] bg-slate-950 lg:min-h-[680px]">
          <Image src={item.imageUrl} alt={`${item.categoryLabel} large portfolio preview`} fill className="object-contain" sizes="92vw" />
          <span className="absolute left-4 top-4 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-black uppercase text-slate-950">
            {item.categoryLabel}
          </span>
        </div>
      ) : null}
    </Modal>
  );
}
