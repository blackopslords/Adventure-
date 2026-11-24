export interface ParsedYouTubeVideo {
  videoId: string;
  thumbnailMaxRes: string;
  thumbnailHq: string;
  watchUrl: string;
  embedUrl: string;
}

export function extractYouTubeVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const normalized = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    const url = new URL(normalized);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();

    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
    }

    if (
      host === 'youtube.com' ||
      host === 'm.youtube.com' ||
      host === 'music.youtube.com' ||
      host === 'youtube-nocookie.com'
    ) {
      const vParam = url.searchParams.get('v');
      if (vParam && /^[A-Za-z0-9_-]{11}$/.test(vParam)) {
        return vParam;
      }
      const parts = url.pathname.split('/').filter(Boolean);
      const markerIndex = parts.findIndex((p) =>
        ['embed', 'shorts', 'live', 'v'].includes(p)
      );
      if (markerIndex !== -1 && parts[markerIndex + 1]) {
        const candidate = parts[markerIndex + 1];
        return /^[A-Za-z0-9_-]{11}$/.test(candidate) ? candidate : null;
      }
    }
  } catch {
    // Fallback regex for partial URLs
  }

  const fallbackMatch = trimmed.match(
    /(?:v=|youtu\.be\/|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{11})/
  );
  return fallbackMatch ? fallbackMatch[1] : null;
}

export function parseYouTubeUrl(input: string): ParsedYouTubeVideo | null {
  const videoId = extractYouTubeVideoId(input);
  if (!videoId) return null;

  return {
    videoId,
    thumbnailMaxRes: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    thumbnailHq: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`,
  };
}
