import { environment } from "../../environments/environment";

/**
 * Normalizes an image URL for display:
 * - If it's a remote URL (Cloudinary, Google Books, Open Library, https, data:), returns it directly.
 * - If it's a relative path or local filename, prepends backend baseUrl and /resources/.
 */
export function getImageUrl(imageUrl?: string | null): string {
  if (!imageUrl || !imageUrl.trim()) {
    return "";
  }
  const trimmed = imageUrl.trim();

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("//") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  const base = environment.baseUrl.replace(/\/+$/, "");

  if (trimmed.startsWith("/")) {
    return `${base}${trimmed}`;
  }

  return `${base}/resources/${trimmed}`;
}

