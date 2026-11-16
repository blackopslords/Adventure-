import type { TeamProfile } from '../data/teamProfiles';

// Vite automatically scans these folders at build/dev time.
// Just drag & drop or upload files named 01.mp3, 02.mp3, ... (or 01.png, 02.png, ...)
// — zero code changes required!
const musicModules = import.meta.glob<string>(
  '../music/*.{mp3,MP3,wav,WAV,ogg,OGG,m4a,M4A,aac,AAC,flac,FLAC}',
  { eager: true, import: 'default' }
);

const posterModules = import.meta.glob<string>(
  '../posters/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP,gif,GIF}',
  { eager: true, import: 'default' }
);

const backdropModules = import.meta.glob<string>(
  '../backdrops/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP,gif,GIF}',
  { eager: true, import: 'default' }
);

interface MediaEntry {
  path: string;
  url: string;
  baseName: string;
  slotNumber: number | null;
  isDefaultPlaceholder: boolean;
}

function parseEntries(modules: Record<string, string>): MediaEntry[] {
  return Object.entries(modules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, url]) => {
      const fileName = path.split('/').pop() ?? path;
      const baseName = fileName.replace(/\.[^/.]+$/, '').toLowerCase();
      const slotMatch = baseName.match(/^0*([1-9]\d*)(?:$|[-_.\s])/);
      const slotNumber = slotMatch ? Number(slotMatch[1]) : null;
      const isDefaultPlaceholder = baseName === '01-default-theme';

      return {
        path,
        url,
        baseName,
        slotNumber,
        isDefaultPlaceholder,
      };
    });
}

function formatTrackTitle(entry: MediaEntry, indexLabel: string): string {
  if (entry.isDefaultPlaceholder) {
    return `Profile ${indexLabel} — Background Theme`;
  }
  const fileName = entry.path.split('/').pop() ?? entry.path;
  const withoutExt = fileName.replace(/\.[^/.]+$/, '');
  const withoutIndex = withoutExt.replace(/^0*[1-9]\d*[-_.\s]*/, '');
  const cleaned = withoutIndex.replace(/[-_]+/g, ' ').trim();
  if (!cleaned) {
    return `Profile ${indexLabel} — Custom Theme`;
  }
  return cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
}

function findBestMatch(
  profile: TeamProfile,
  entries: MediaEntry[],
  unassignedPool: MediaEntry[]
): MediaEntry | undefined {
  const slotNum = Number(profile.indexLabel);

  // 1. Match by slot prefix: 01.mp3, 1.mp3, 01-song.mp3, 02_theme.mp3, etc.
  const slotMatches = entries.filter((e) => e.slotNumber === slotNum);
  if (slotMatches.length > 0) {
    const sorted = [...slotMatches].sort((a, b) => {
      // Any user-uploaded file overrides 01-default-theme automatically
      if (a.isDefaultPlaceholder !== b.isDefaultPlaceholder) {
        return a.isDefaultPlaceholder ? 1 : -1;
      }
      // Prefer exact numeric name like "01.mp3" / "1.mp3" over longer names
      const aExact = /^0*[1-9]\d*$/.test(a.baseName);
      const bExact = /^0*[1-9]\d*$/.test(b.baseName);
      if (aExact !== bExact) return aExact ? -1 : 1;
      return a.baseName.localeCompare(b.baseName);
    });
    return sorted[0];
  }

  // 2. Match by profile id or first name (e.g., "arhan.mp3", "rahat.mp3")
  const firstName = profile.name.trim().split(/\s+/)[0]?.toLowerCase() ?? '';
  const idToken = profile.id.toLowerCase();
  const nameMatch = entries.find(
    (e) =>
      e.baseName === idToken ||
      (firstName.length >= 3 &&
        (e.baseName === firstName ||
          e.baseName.startsWith(`${firstName}-`) ||
          e.baseName.startsWith(`${firstName}_`) ||
          e.baseName.includes(firstName)))
  );
  if (nameMatch) return nameMatch;

  // 3. Fallback: assign remaining unnumbered files in alphabetical order
  return unassignedPool.shift();
}

function buildUnassignedPool(
  profiles: TeamProfile[],
  entries: MediaEntry[]
): MediaEntry[] {
  const slotSet = new Set(profiles.map((p) => Number(p.indexLabel)));
  const nameTokens = profiles
    .map((p) => p.name.trim().split(/\s+/)[0]?.toLowerCase() ?? '')
    .filter((t) => t.length >= 3);
  const idSet = new Set(profiles.map((p) => p.id.toLowerCase()));

  return entries.filter((e) => {
    if (e.slotNumber !== null && slotSet.has(e.slotNumber)) return false;
    if (idSet.has(e.baseName)) return false;
    if (nameTokens.some((token) => e.baseName.includes(token))) return false;
    return true;
  });
}

export function applyFolderMediaOverrides(
  baseProfiles: TeamProfile[]
): TeamProfile[] {
  const musicEntries = parseEntries(musicModules);
  const posterEntries = parseEntries(posterModules);
  const backdropEntries = parseEntries(backdropModules);

  const unassignedMusic = buildUnassignedPool(baseProfiles, musicEntries);
  const unassignedPosters = buildUnassignedPool(baseProfiles, posterEntries);
  const unassignedBackdrops = buildUnassignedPool(baseProfiles, backdropEntries);

  return baseProfiles.map((profile) => {
    const matchedMusic = findBestMatch(profile, musicEntries, unassignedMusic);
    const matchedPoster = findBestMatch(
      profile,
      posterEntries,
      unassignedPosters
    );
    const matchedBackdrop = findBestMatch(
      profile,
      backdropEntries,
      unassignedBackdrops
    );

    return {
      ...profile,
      ...(matchedPoster ? { posterUrl: matchedPoster.url } : {}),
      ...(matchedBackdrop ? { backdropUrl: matchedBackdrop.url } : {}),
      ...(matchedMusic
        ? {
            customAudioUrl: matchedMusic.url,
            customTrackName: formatTrackTitle(matchedMusic, profile.indexLabel),
          }
        : {}),
    };
  });
}
