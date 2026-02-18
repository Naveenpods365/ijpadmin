import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAvatarUrl(avatarKey?: string | null) {
  if (!avatarKey) return "/figmaAssets/ellipse-11.svg";
  if (avatarKey.startsWith("http")) return avatarKey;
  // Fallback to a placeholder CDN domain for now
  return `https://d2v...cloudfront.net/${avatarKey}`; 
}
