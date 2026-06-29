export function extractVimeoId(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(/(\d{6,})/);
  return match ? match[1] : trimmed;
}

export async function fetchVimeoThumbnail(vimeoId: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(`https://vimeo.com/${vimeoId}`)}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.thumbnail_url === "string" ? data.thumbnail_url : null;
  } catch {
    return null;
  }
}
