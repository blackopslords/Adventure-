export interface FunnyClip {
  id: string;
  serialNumber: number;
  serialLabel: string;
  title: string;
  subtitle: string;
  videoUrl: string;
  isLocalPreview?: boolean;
}

// Vite automatically scans src/funny-videos/ at dev & build time.
// Drop files like 01.mp4, 02-funny-moment.mp4, 03.mp4 — zero code edits needed!
const funnyVideoModules = import.meta.glob<string>(
  '../funny-videos/*.{mp4,MP4,webm,WEBM,mov,MOV,m4v,M4V}',
  { eager: true, import: 'default' }
);

function formatSerialLabel(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

function cleanTitleFromFile(baseName: string, serialLabel: string): string {
  const withoutIndex = baseName.replace(/^0*[1-9]\d*[-_.\s]*/, '');
  const cleaned = withoutIndex.replace(/[-_]+/g, ' ').trim();
  if (!cleaned) {
    return `Discord Funny Clip ${serialLabel}`;
  }
  return cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function loadFolderFunnyClips(): FunnyClip[] {
  const parsed = Object.entries(funnyVideoModules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, url], idx) => {
      const fileName = path.split('/').pop() ?? path;
      const baseName = fileName.replace(/\.[^/.]+$/, '');
      const slotMatch = baseName.match(/^0*([1-9]\d*)(?:$|[-_.\s])/);
      const parsedNumber = slotMatch ? Number(slotMatch[1]) : null;

      return {
        path,
        url,
        baseName,
        parsedNumber,
        fallbackOrder: idx + 1,
      };
    });

  // Assign unique serial numbers: explicit 01/02... first, unnumbered get next free numbers
  const usedNumbers = new Set<number>(
    parsed
      .map((item) => item.parsedNumber)
      .filter((n): n is number => n !== null)
  );

  let nextAuto = 1;
  const getNextAvailable = () => {
    while (usedNumbers.has(nextAuto)) {
      nextAuto += 1;
    }
    usedNumbers.add(nextAuto);
    return nextAuto;
  };

  const clips: FunnyClip[] = parsed.map((item) => {
    const serialNumber =
      item.parsedNumber !== null ? item.parsedNumber : getNextAvailable();
    const serialLabel = formatSerialLabel(serialNumber);
    const title = cleanTitleFromFile(item.baseName, serialLabel);

    return {
      id: `clip-${serialLabel}-${item.baseName.toLowerCase()}`,
      serialNumber,
      serialLabel,
      title,
      subtitle: `Discord Voice & Chat · Serial #${serialLabel}`,
      videoUrl: item.url,
    };
  });

  return clips.sort((a, b) => a.serialNumber - b.serialNumber);
}
