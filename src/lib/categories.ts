export const categories = [
  { id: "THUMBNAIL", label: "Thumbnails" },
  { id: "POSTER", label: "Posters" },
  { id: "SOCIAL_POST", label: "Social Posts" },
  { id: "LOGO", label: "Logos" },
  { id: "BRANDING", label: "Branding" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export function getCategoryLabel(categoryId: string) {
  return categories.find((category) => category.id === categoryId)?.label ?? categoryId;
}
