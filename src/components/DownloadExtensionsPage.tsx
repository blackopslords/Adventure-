import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  ExternalLink,
  FileArchive,
  FileAudio,
  FileBox,
  FileCode2,
  FileImage,
  FileText,
  FileVideo,
  FolderDown,
  HardDriveDownload,
  Link2,
  Play,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
  Youtube,
} from 'lucide-react';
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import type {
  ExtensionComboItem,
  ExtensionFileCategory,
  ExtensionFileItem,
} from '../types/extensions';
import { parseYouTubeUrl } from '../utils/youtube';
import { CrystalPlayButton } from './CrystalPlayButton';
import { VerifiedBadge } from './VerifiedBadge';

interface DownloadExtensionsPageProps {
  combos: ExtensionComboItem[];
  files: ExtensionFileItem[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onBackHome: () => void;
  isAdminMode: boolean;
  onAddLocalFile: (file: ExtensionFileItem) => void;
  onRemoveLocalFile: (fileId: string) => void;
  onAddCombo: (combo: ExtensionComboItem) => void;
  onRemoveCombo: (comboId: string) => void;
  onVideoPlaybackChange: (isPlaying: boolean) => void;
}

type FilterTab = 'all' | 'combos' | ExtensionFileCategory;

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All Releases' },
  { id: 'combos', label: 'Video + Download' },
  { id: 'software', label: 'Apps & .exe' },
  { id: 'archive', label: 'Archives' },
  { id: 'video', label: 'Videos' },
  { id: 'audio', label: 'Audio' },
  { id: 'image', label: 'Images' },
  { id: 'document', label: 'Docs' },
];

function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb >= 100 ? 0 : 1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(mb >= 100 ? 0 : 1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Ready';
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getDomainLabel(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return 'External Download Link';
  }
}

function inferBadgeFromUrl(rawUrl: string, customBadge?: string): string {
  if (customBadge?.trim()) return customBadge.trim();
  const host = getDomainLabel(rawUrl).toLowerCase();
  if (host.includes('chromewebstore.google.com') || host.includes('chrome.google.com')) {
    return 'Chrome Web Store';
  }
  if (host.includes('github.com')) return 'GitHub Release';
  if (host.includes('drive.google.com')) return 'Google Drive';
  if (host.includes('mediafire.com')) return 'MediaFire';
  return 'Direct Link';
}

function getCategoryMeta(category: ExtensionFileCategory) {
  switch (category) {
    case 'software':
      return {
        icon: FileCode2,
        badgeClass: 'bg-white/80 text-[#3B369E] border-white/95',
        iconBoxClass: 'bg-white/75 text-[#5D5AF0] border-white/95',
      };
    case 'video':
      return {
        icon: FileVideo,
        badgeClass: 'bg-white/80 text-[#5B359E] border-white/95',
        iconBoxClass: 'bg-white/75 text-[#7C5AF0] border-white/95',
      };
    case 'audio':
      return {
        icon: FileAudio,
        badgeClass: 'bg-white/80 text-[#2E4A9E] border-white/95',
        iconBoxClass: 'bg-white/75 text-[#4C6EF5] border-white/95',
      };
    case 'image':
      return {
        icon: FileImage,
        badgeClass: 'bg-white/80 text-[#7A358E] border-white/95',
        iconBoxClass: 'bg-white/75 text-[#9C52B5] border-white/95',
      };
    case 'archive':
      return {
        icon: FileArchive,
        badgeClass: 'bg-white/80 text-[#35409E] border-white/95',
        iconBoxClass: 'bg-white/75 text-[#5460E6] border-white/95',
      };
    case 'document':
      return {
        icon: FileText,
        badgeClass: 'bg-white/80 text-[#2B4E8A] border-white/95',
        iconBoxClass: 'bg-white/75 text-[#4472C4] border-white/95',
      };
    default:
      return {
        icon: FileBox,
        badgeClass: 'bg-white/80 text-[#272363] border-white/95',
        iconBoxClass: 'bg-white/75 text-[#5D5AF0] border-white/95',
      };
  }
}

function classifyBrowserExtension(ext: string): ExtensionFileCategory {
  const e = ext.toLowerCase();
  if (
    [
      'exe',
      'msi',
      'apk',
      'dmg',
      'pkg',
      'appimage',
      'deb',
      'bat',
      'cmd',
      'ps1',
      'sh',
      'crx',
      'xpi',
      'dll',
    ].includes(e)
  ) {
    return 'software';
  }
  if (['mp4', 'mov', 'webm', 'mkv', 'avi', 'm4v'].includes(e)) return 'video';
  if (['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(e)) return 'audio';
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'bmp', 'ico'].includes(e)) {
    return 'image';
  }
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(e)) return 'archive';
  if (['pdf', 'txt', 'md', 'json', 'csv', 'doc', 'docx'].includes(e)) {
    return 'document';
  }
  return 'other';
}

interface YouTubeThumbnailImageProps {
  youtubeUrl: string;
  alt: string;
  className?: string;
}

function YouTubeThumbnailImage({
  youtubeUrl,
  alt,
  className = '',
}: YouTubeThumbnailImageProps) {
  const parsed = parseYouTubeUrl(youtubeUrl);
  const [useHqFallback, setUseHqFallback] = useState(false);

  useEffect(() => {
    setUseHqFallback(false);
  }, [youtubeUrl]);

  if (!parsed) {
    return (
      <div className="w-full h-full bg-[#D8D7FE] flex items-center justify-center text-[#3B3875] text-xs font-mono">
        Invalid YouTube URL
      </div>
    );
  }

  return (
    <img
      src={useHqFallback ? parsed.thumbnailHq : parsed.thumbnailMaxRes}
      alt={alt}
      loading="lazy"
      onError={() => {
        if (!useHqFallback) setUseHqFallback(true);
      }}
      onLoad={(e) => {
        if (!useHqFallback && e.currentTarget.naturalWidth <= 120) {
          setUseHqFallback(true);
        }
      }}
      className={className}
    />
  );
}

interface ResolvedComboCard {
  combo: ExtensionComboItem;
  yt: ReturnType<typeof parseYouTubeUrl>;
  linkedFile: ExtensionFileItem | undefined;
  actionHref: string;
  isDirectFileDownload: boolean;
  downloadFileName?: string;
  badgeLabel: string;
  sourceLabel: string;
  ctaLabel: string;
}

export function DownloadExtensionsPage({
  combos,
  files,
  searchQuery,
  onSearchChange,
  onBackHome,
  isAdminMode,
  onAddLocalFile,
  onRemoveLocalFile,
  onAddCombo,
  onRemoveCombo,
  onVideoPlaybackChange,
}: DownloadExtensionsPageProps) {
  const [selectedTab, setSelectedTab] = useState<FilterTab>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [activeVideoCombo, setActiveVideoCombo] =
    useState<ResolvedComboCard | null>(null);

  // Owner Builder State
  const [builderOpen, setBuilderOpen] = useState(false);
  const [ytInput, setYtInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [sourceMode, setSourceMode] = useState<'link' | 'file'>('link');
  const [linkInput, setLinkInput] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [buttonLabelInput, setButtonLabelInput] = useState('');
  const [formError, setFormError] = useState('');
  const [copiedComboId, setCopiedComboId] = useState<string | null>(null);

  const parsedPreviewYt = useMemo(() => parseYouTubeUrl(ytInput), [ytInput]);

  useEffect(() => {
    onVideoPlaybackChange(Boolean(activeVideoCombo));
  }, [activeVideoCombo, onVideoPlaybackChange]);

  useEffect(() => {
    if (!activeVideoCombo) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveVideoCombo(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeVideoCombo]);

  // Pair combos with any matching file in src/extensions/
  const resolvedCombos: ResolvedComboCard[] = useMemo(() => {
    return combos.map((combo) => {
      const yt = parseYouTubeUrl(combo.youtubeUrl);
      const linkedFile = combo.fileName
        ? files.find(
            (f) => f.fileName.toLowerCase() === combo.fileName?.toLowerCase()
          )
        : undefined;

      const isDirectFileDownload = Boolean(linkedFile);
      const actionHref = linkedFile
        ? linkedFile.downloadUrl
        : combo.downloadUrl?.trim() || '#';
      const badgeLabel = linkedFile
        ? `.${linkedFile.extension} File`
        : inferBadgeFromUrl(actionHref, combo.badge);
      const sourceLabel = linkedFile
        ? `${linkedFile.fileName} · ${formatFileSize(linkedFile.sizeBytes)}`
        : getDomainLabel(actionHref);
      const ctaLabel =
        combo.buttonLabel?.trim() ||
        (isDirectFileDownload ? 'Download File' : 'Download Extension');

      return {
        combo,
        yt,
        linkedFile,
        actionHref,
        isDirectFileDownload,
        downloadFileName: linkedFile?.fileName,
        badgeLabel,
        sourceLabel,
        ctaLabel,
      };
    });
  }, [combos, files]);

  // Standalone files not already claimed inside a YouTube combo card
  const claimedFileNames = useMemo(() => {
    return new Set(
      combos
        .map((c) => c.fileName?.toLowerCase())
        .filter((name): name is string => Boolean(name))
    );
  }, [combos]);

  const standaloneFiles = useMemo(() => {
    return files.filter((f) => !claimedFileNames.has(f.fileName.toLowerCase()));
  }, [files, claimedFileNames]);

  const totalItemsCount = resolvedCombos.length + standaloneFiles.length;

  const visibleTabs = useMemo(() => {
    return FILTER_TABS.filter((tab) => {
      if (tab.id === 'all') return true;
      if (tab.id === 'combos') return resolvedCombos.length > 0;
      return standaloneFiles.some((file) => file.category === tab.id);
    });
  }, [resolvedCombos.length, standaloneFiles]);

  const filteredCombos = useMemo(() => {
    if (selectedTab !== 'all' && selectedTab !== 'combos') return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return resolvedCombos;
    return resolvedCombos.filter(
      (item) =>
        item.combo.title.toLowerCase().includes(q) ||
        (item.combo.description ?? '').toLowerCase().includes(q) ||
        item.badgeLabel.toLowerCase().includes(q) ||
        item.sourceLabel.toLowerCase().includes(q)
    );
  }, [resolvedCombos, selectedTab, searchQuery]);

  const filteredFiles = useMemo(() => {
    if (selectedTab === 'combos') return [];
    const q = searchQuery.trim().toLowerCase();
    return standaloneFiles.filter((file) => {
      if (selectedTab !== 'all' && file.category !== selectedTab) {
        return false;
      }
      if (!q) return true;
      return (
        file.title.toLowerCase().includes(q) ||
        file.fileName.toLowerCase().includes(q) ||
        file.extension.toLowerCase().includes(q)
      );
    });
  }, [standaloneFiles, selectedTab, searchQuery]);

  const handleLocalTestUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const extMatch = selected.name.match(/\.([^.]+)$/);
    const rawExt = extMatch ? extMatch[1] : 'FILE';
    const title =
      selected.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]+/g, ' ')
        .trim() || selected.name;

    const url = URL.createObjectURL(selected);
    onAddLocalFile({
      id: `local-ext-${Date.now()}`,
      fileName: selected.name,
      relativePath: selected.name,
      title,
      extension: rawExt.toUpperCase(),
      category: classifyBrowserExtension(rawExt),
      sizeBytes: selected.size,
      updatedAt: new Date(selected.lastModified || Date.now()).toISOString(),
      downloadUrl: url,
      isLocalPreview: true,
    });
    if (builderOpen && sourceMode === 'file') {
      setSelectedFileName(selected.name);
    }
    e.target.value = '';
  };

  const handleComboSubmit = (e: FormEvent) => {
    e.preventDefault();
    const yt = parseYouTubeUrl(ytInput);
    if (!yt) {
      setFormError('Please enter a valid YouTube link (e.g. https://www.youtube.com/watch?v=...).');
      return;
    }
    if (!titleInput.trim()) {
      setFormError('Please enter a title for this extension or release.');
      return;
    }

    if (sourceMode === 'link') {
      const cleanUrl = linkInput.trim();
      if (!cleanUrl) {
        setFormError('Please paste a download URL (or switch to Uploaded File).');
        return;
      }
      setFormError('');
      onAddCombo({
        id: `local-combo-${Date.now()}`,
        title: titleInput.trim(),
        description: descInput.trim() || undefined,
        youtubeUrl: yt.watchUrl,
        downloadUrl: /^https?:\/\//i.test(cleanUrl)
          ? cleanUrl
          : `https://${cleanUrl}`,
        buttonLabel: buttonLabelInput.trim() || undefined,
        isLocalDraft: true,
      });
    } else {
      if (!selectedFileName) {
        setFormError('Please select a file from src/extensions/ or upload one.');
        return;
      }
      setFormError('');
      onAddCombo({
        id: `local-combo-${Date.now()}`,
        title: titleInput.trim(),
        description: descInput.trim() || undefined,
        youtubeUrl: yt.watchUrl,
        fileName: selectedFileName,
        buttonLabel: buttonLabelInput.trim() || undefined,
        isLocalDraft: true,
      });
    }

    setYtInput('');
    setTitleInput('');
    setDescInput('');
    setLinkInput('');
    setSelectedFileName('');
    setButtonLabelInput('');
    setBuilderOpen(false);
  };

  const handleCopyComboSnippet = (combo: ExtensionComboItem) => {
    const cleanObj: Record<string, string> = {
      id: combo.id.replace('local-', ''),
      title: combo.title,
      ...(combo.description ? { description: combo.description } : {}),
      youtubeUrl: combo.youtubeUrl,
      ...(combo.downloadUrl ? { downloadUrl: combo.downloadUrl } : {}),
      ...(combo.fileName ? { fileName: combo.fileName } : {}),
      ...(combo.badge ? { badge: combo.badge } : {}),
      ...(combo.buttonLabel ? { buttonLabel: combo.buttonLabel } : {}),
    };
    const snippet = JSON.stringify(cleanObj, null, 2) + ',';
    navigator.clipboard?.writeText(snippet).catch(() => {});
    setCopiedComboId(combo.id);
    window.setTimeout(() => {
      setCopiedComboId((cur) => (cur === combo.id ? null : cur));
    }, 1800);
  };

  const handleDirectDownload = (id: string) => {
    setDownloadingId(id);
    window.setTimeout(() => {
      setDownloadingId((cur) => (cur === id ? null : cur));
    }, 1200);
  };

  const hasVisibleContent =
    filteredCombos.length > 0 || filteredFiles.length > 0;

  return (
    <section
      id="download-extensions"
      aria-label="Download Extensions Public Directory"
      className="relative overflow-x-hidden min-h-[calc(100vh-80px)] pt-28 pb-20 md:pt-32 md:pb-24 ext-glass-stage text-[#16143E]"
    >
      {/* Flowing Iridescent Liquid-Glass Ribbon Wave Backdrop (Zero Circles) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          className="w-full h-full opacity-80"
        >
          <defs>
            <linearGradient id="extRibbonA" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6E6DF3" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#A9A5FF" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#F2B8EC" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="extRibbonB" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.82" />
              <stop offset="45%" stopColor="#8E8BFF" stopOpacity="0.34" />
              <stop offset="100%" stopColor="#6462EE" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <path
            d="M-120,180 C240,60 440,420 820,260 C1140,125 1320,240 1560,90 L1560,340 C1280,460 1060,290 760,430 C420,588 210,270 -120,390 Z"
            fill="url(#extRibbonA)"
          />
          <path
            d="M-120,620 C260,460 540,780 940,560 C1200,418 1360,520 1560,420 L1560,640 C1290,740 1070,580 790,720 C460,885 200,660 -120,760 Z"
            fill="url(#extRibbonB)"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 space-y-10">
        {/* Top Back Navigation + Page Header */}
        <div className="space-y-6">
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#23205C] hover:text-[#16143E] ext-glass-panel hover:border-white rounded-xl transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5D5AF0]"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#5D5AF0]" aria-hidden="true" />
            <span>Back to Panel Showcase</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/75 pb-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider font-semibold text-[#4B47C9]">
                <HardDriveDownload className="w-4 h-4" aria-hidden="true" />
                <span>Public Extension Vault</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#16143E] inline-flex items-center gap-2.5 sm:gap-3.5">
                <VerifiedBadge className="w-[0.88em] h-[0.88em]" />
                <span>Download Extensions</span>
              </h1>
              <p className="text-sm sm:text-base text-[#35326B] leading-relaxed">
                Watch the preview video above each release and install directly
                via official store links or download{' '}
                <span className="font-mono font-semibold text-[#4B47C9]">.exe</span>,{' '}
                <span className="font-mono font-semibold text-[#4B47C9]">.mp4</span>,{' '}
                <span className="font-mono font-semibold text-[#4B47C9]">.mp3</span>, and{' '}
                <span className="font-mono font-semibold text-[#4B47C9]">.jpg</span> packs below.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="px-4 py-2.5 ext-glass-panel rounded-xl text-xs font-mono text-[#2F2C69] tabular-nums">
                <span className="text-[#4B47C9] font-bold">
                  {totalItemsCount}
                </span>{' '}
                {totalItemsCount === 1 ? 'Release Ready' : 'Releases Ready'}
              </div>

              {isAdminMode && (
                <>
                  <button
                    type="button"
                    onClick={() => setBuilderOpen((prev) => !prev)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold ext-glass-cta rounded-xl cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    <span>Add YT + Download Combo</span>
                  </button>

                  <label className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#23205C] hover:text-[#16143E] ext-glass-panel hover:border-white rounded-xl transition-colors cursor-pointer whitespace-nowrap">
                    <Upload className="w-4 h-4 text-[#5D5AF0]" aria-hidden="true" />
                    <span>Upload File</span>
                    <input
                      type="file"
                      onChange={handleLocalTestUpload}
                      className="hidden"
                    />
                  </label>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Owner Quick Combo Builder (Only when Owner Mode is unlocked) */}
        {isAdminMode && builderOpen && (
          <form
            onSubmit={handleComboSubmit}
            noValidate
            className="ext-glass-card md:backdrop-blur-2xl rounded-2xl p-6 space-y-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#16143E]">
                  Create YouTube + Download Combo Card
                </h2>
                <p className="text-xs text-[#3B3875] mt-1">
                  Paste any YouTube URL to auto-pull its thumbnail, then attach
                  either a download link or an uploaded file. Use{' '}
                  <span className="font-mono font-semibold text-[#4B47C9]">
                    Copy GitHub Code
                  </span>{' '}
                  after adding to save permanently in{' '}
                  <span className="font-mono font-semibold text-[#4B47C9]">
                    src/data/extensionCombos.ts
                  </span>
                  .
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBuilderOpen(false)}
                aria-label="Close builder"
                className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/75 hover:bg-white text-[#23205C] border border-white/90 cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Live YouTube Thumbnail Preview */}
              <div className="lg:col-span-4 space-y-2">
                <p className="text-xs font-mono font-semibold text-[#4B47C9] uppercase tracking-wider">
                  Live Thumbnail Preview
                </p>
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-white/55 border border-white/85 flex items-center justify-center">
                  {parsedPreviewYt ? (
                    <YouTubeThumbnailImage
                      youtubeUrl={ytInput}
                      alt="YouTube thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center px-4 space-y-1.5">
                      <Youtube
                        className="w-7 h-7 text-[#5D5AF0]/70 mx-auto"
                        aria-hidden="true"
                      />
                      <p className="text-xs text-[#4F4B94]">
                        Paste a YouTube link to preview thumbnail
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Fields */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#23205C] mb-1.5">
                    YouTube Video Link
                  </label>
                  <input
                    type="url"
                    value={ytInput}
                    onChange={(e) => {
                      setYtInput(e.target.value);
                      if (formError) setFormError('');
                    }}
                    placeholder="https://www.youtube.com/watch?v=LlzMvG1v_xQ"
                    className="w-full px-3.5 py-2.5 text-sm text-[#16143E] bg-white/75 border border-white/90 rounded-xl placeholder:text-[#6B67AC] focus:outline-none focus:border-[#5D5AF0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#23205C] mb-1.5">
                    Extension / File Title
                  </label>
                  <input
                    type="text"
                    value={titleInput}
                    onChange={(e) => {
                      setTitleInput(e.target.value);
                      if (formError) setFormError('');
                    }}
                    placeholder="e.g. Featured Chrome Extension"
                    className="w-full px-3.5 py-2.5 text-sm text-[#16143E] bg-white/75 border border-white/90 rounded-xl placeholder:text-[#6B67AC] focus:outline-none focus:border-[#5D5AF0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#23205C] mb-1.5">
                    Button Label (Optional)
                  </label>
                  <input
                    type="text"
                    value={buttonLabelInput}
                    onChange={(e) => setButtonLabelInput(e.target.value)}
                    placeholder="Download Extension"
                    className="w-full px-3.5 py-2.5 text-sm text-[#16143E] bg-white/75 border border-white/90 rounded-xl placeholder:text-[#6B67AC] focus:outline-none focus:border-[#5D5AF0]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#23205C] mb-1.5">
                    Short Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={descInput}
                    onChange={(e) => setDescInput(e.target.value)}
                    placeholder="Watch the guide above and install or download below."
                    className="w-full px-3.5 py-2.5 text-sm text-[#16143E] bg-white/75 border border-white/90 rounded-xl placeholder:text-[#6B67AC] focus:outline-none focus:border-[#5D5AF0]"
                  />
                </div>

                <div className="sm:col-span-2 space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-[#23205C] mr-1">
                      Download Target:
                    </span>
                    <button
                      type="button"
                      onClick={() => setSourceMode('link')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                        sourceMode === 'link'
                          ? 'ext-glass-cta border-transparent'
                          : 'bg-white/70 text-[#23205C] border-white/90 hover:bg-white/90'
                      }`}
                    >
                      Paste Download URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setSourceMode('file')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                        sourceMode === 'file'
                          ? 'ext-glass-cta border-transparent'
                          : 'bg-white/70 text-[#23205C] border-white/90 hover:bg-white/90'
                      }`}
                    >
                      Attach File (.exe / .mp4 / .mp3 / .jpg)
                    </button>
                  </div>

                  {sourceMode === 'link' ? (
                    <input
                      type="url"
                      value={linkInput}
                      onChange={(e) => {
                        setLinkInput(e.target.value);
                        if (formError) setFormError('');
                      }}
                      placeholder="https://chromewebstore.google.com/detail/..."
                      className="w-full px-3.5 py-2.5 text-sm text-[#16143E] bg-white/75 border border-white/90 rounded-xl placeholder:text-[#6B67AC] focus:outline-none focus:border-[#5D5AF0]"
                    />
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <select
                        value={selectedFileName}
                        onChange={(e) => setSelectedFileName(e.target.value)}
                        className="flex-1 px-3.5 py-2.5 text-sm text-[#16143E] bg-white/75 border border-white/90 rounded-xl focus:outline-none focus:border-[#5D5AF0]"
                      >
                        <option value="">
                          {files.length > 0
                            ? 'Select an uploaded file...'
                            : 'No files uploaded yet — pick a local file →'}
                        </option>
                        {files.map((f) => (
                          <option key={f.id} value={f.fileName}>
                            {f.fileName} ({formatFileSize(f.sizeBytes)})
                          </option>
                        ))}
                      </select>
                      <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#16143E] bg-white/75 hover:bg-white/95 border border-white/90 rounded-xl cursor-pointer whitespace-nowrap">
                        <Upload className="w-3.5 h-3.5 text-[#5D5AF0]" aria-hidden="true" />
                        <span>Pick File</span>
                        <input
                          type="file"
                          onChange={handleLocalTestUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>

                {formError && (
                  <p role="alert" className="sm:col-span-2 text-xs font-medium text-rose-700">
                    {formError}
                  </p>
                )}

                <div className="sm:col-span-2 flex justify-end gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setBuilderOpen(false)}
                    className="px-4 py-2.5 text-xs font-semibold text-[#23205C] hover:text-[#16143E] bg-white/70 hover:bg-white/90 border border-white/90 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-bold ext-glass-cta rounded-xl cursor-pointer"
                  >
                    Add Combo Card
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Filter Bar + Inline Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label="Filter downloadable releases"
            className="flex flex-wrap items-center gap-1.5 p-1.5 ext-glass-panel rounded-xl w-fit"
          >
            {visibleTabs.map((tab) => {
              const isSelected = selectedTab === tab.id;
              const count =
                tab.id === 'all'
                  ? totalItemsCount
                  : tab.id === 'combos'
                    ? resolvedCombos.length
                    : standaloneFiles.filter((f) => f.category === tab.id).length;

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`inline-flex items-center px-3.5 py-2 text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'ext-glass-cta font-bold'
                      : 'font-semibold text-[#2D2A68] hover:text-[#16143E] hover:bg-white/55'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`ml-1.5 font-mono text-[11px] tabular-nums ${
                      isSelected ? 'text-white/90' : 'text-[#5A56A6]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-80">
            <Search
              className="w-4 h-4 text-[#5D5AF0] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search extensions, YouTube guides, files..."
              aria-label="Filter extension releases"
              className="w-full pl-10 pr-4 py-2.5 text-sm text-[#16143E] ext-glass-panel rounded-xl placeholder:text-[#5E599E] focus:outline-none focus:border-[#5D5AF0]"
            />
          </div>
        </div>

        {/* Owner GitHub Upload Hint (Hidden from Public Visitors) */}
        {isAdminMode && (
          <div className="ext-glass-panel rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-[#2E2A69] leading-relaxed">
              <span className="font-bold text-[#4B47C9]">GitHub Sync:</span> Add
              YouTube + Download combos in{' '}
              <span className="font-mono font-semibold text-[#4B47C9]">
                src/data/extensionCombos.ts
              </span>{' '}
              and drop binary files (`.exe`, `.mp4`, `.mp3`, `.jpg`, `.zip`) into{' '}
              <span className="font-mono font-semibold text-[#16143E]">
                src/extensions/
              </span>{' '}
              so all visitors see them live.
            </p>
          </div>
        )}

        {/* Main Content Grid */}
        {!hasVisibleContent ? (
          <div className="relative group">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-1 ext-glass-blob-a opacity-35 md:blur-2xl"
            />
            <div className="relative py-20 px-6 text-center ext-glass-card md:backdrop-blur-2xl rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white/80 border border-white/95 flex items-center justify-center mx-auto text-[#5D5AF0]">
                <FolderDown className="w-6 h-6" aria-hidden="true" />
              </div>
              <div className="space-y-1.5">
                <h2 className="font-display text-2xl font-bold text-[#16143E]">
                  {totalItemsCount === 0
                    ? 'No Extensions Uploaded Yet'
                    : 'No Matching Releases Found'}
                </h2>
                <p className="text-sm text-[#3B3875] max-w-md mx-auto">
                  {totalItemsCount === 0
                    ? 'Published video guides, browser extensions, installers, and media packs will appear here.'
                    : 'Try clearing your search or choosing a different category.'}
                </p>
              </div>
              {(searchQuery.trim() || selectedTab !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('');
                    setSelectedTab('all');
                  }}
                  className="px-5 py-2.5 text-sm font-bold ext-glass-cta rounded-xl cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* YouTube Thumbnail + Download Combo Cards */}
            {filteredCombos.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {filteredCombos.map((item) => {
                  const {
                    combo,
                    yt,
                    isDirectFileDownload,
                    actionHref,
                    downloadFileName,
                    badgeLabel,
                    sourceLabel,
                    ctaLabel,
                  } = item;
                  const isDownloading = downloadingId === combo.id;
                  const isCopied = copiedComboId === combo.id;

                  return (
                    <div key={combo.id} className="relative group">
                      {/* Non-circular iridescent periwinkle-lilac glass glow planes behind card */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-2 -left-2 right-8 bottom-10 ext-glass-blob-a opacity-40 md:opacity-55 md:blur-xl group-hover:opacity-80 transition-opacity duration-300"
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute top-10 left-8 -right-2 -bottom-2 ext-glass-blob-b opacity-45 md:opacity-60 md:blur-xl group-hover:opacity-85 transition-opacity duration-300"
                      />

                      <article className="relative h-full flex flex-col ext-glass-card md:backdrop-blur-2xl rounded-2xl overflow-hidden">
                        {/* Specular 3D Crystal Glass Reflection Streak */}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 ext-glass-sheen opacity-85"
                        />

                        {/* Top: Framed 16:9 Interactive YouTube Thumbnail */}
                        <div className="relative z-10 p-3 pb-0">
                          <button
                            type="button"
                            onClick={() => setActiveVideoCombo(item)}
                            aria-label={`Watch ${combo.title} YouTube video`}
                            className="relative block aspect-video w-full rounded-xl overflow-hidden bg-[#1D1B4B] border border-white/90 shadow-[inset_0_1px_2px_rgba(255,255,255,0.65),0_10px_24px_-8px_rgba(68,64,172,0.35)] text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5D5AF0]"
                          >
                            <YouTubeThumbnailImage
                              youtubeUrl={combo.youtubeUrl}
                              alt={`${combo.title} preview thumbnail`}
                              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                            />

                            {/* Measured Contrast Scrim */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#181645]/75 via-transparent to-[#181645]/45" />

                            {/* Top Corner Badges (Strictly Rectangular/Rounded-lg, Zero Circles) */}
                            <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-2">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/88 border border-white text-[11px] font-mono font-semibold text-[#1E1B52] shadow-sm">
                                <Youtube
                                  className="w-3.5 h-3.5 text-[#5D5AF0]"
                                  aria-hidden="true"
                                />
                                <span>Video Guide</span>
                              </span>
                              <span className="px-2.5 py-1 rounded-lg bg-[#5D5AF0] border border-white/55 text-white text-[11px] font-mono font-bold shadow-[0_6px_18px_rgba(93,90,240,0.45)] truncate max-w-[160px]">
                                {badgeLabel}
                              </span>
                            </div>

                            {/* Center Play Trigger — Transparent Faceted Crystal Glass */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <CrystalPlayButton className="group-hover:scale-110" />
                            </div>
                          </button>
                        </div>

                        {/* Bottom: Title, Source Info & Direct Download Action */}
                        <div className="relative z-10 p-5 flex-1 flex flex-col justify-between gap-5">
                          <div className="space-y-2">
                            <h2 className="font-display text-2xl font-bold tracking-tight text-[#16143E] leading-snug">
                              {combo.title}
                            </h2>
                            {combo.description && (
                              <p className="text-xs sm:text-sm text-[#35326B] leading-relaxed line-clamp-2">
                                {combo.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 pt-1 text-xs font-mono font-medium text-[#4B47C9] truncate">
                              <Link2
                                className="w-3.5 h-3.5 text-[#5D5AF0] shrink-0"
                                aria-hidden="true"
                              />
                              <span className="truncate">{sourceLabel}</span>
                            </div>
                          </div>

                          <div className="space-y-2.5 pt-3 border-t border-white/75">
                            <div className="flex items-center gap-2">
                              {isDirectFileDownload ? (
                                <a
                                  href={actionHref}
                                  download={downloadFileName}
                                  onClick={() => handleDirectDownload(combo.id)}
                                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold ext-glass-cta rounded-xl whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16143E]"
                                >
                                  <Download
                                    className="w-4 h-4 shrink-0"
                                    aria-hidden="true"
                                  />
                                  <span>
                                    {isDownloading
                                      ? 'Starting Download...'
                                      : ctaLabel}
                                  </span>
                                </a>
                              ) : (
                                <a
                                  href={actionHref}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold ext-glass-cta rounded-xl whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16143E]"
                                >
                                  <Download
                                    className="w-4 h-4 shrink-0"
                                    aria-hidden="true"
                                  />
                                  <span>{ctaLabel}</span>
                                  <ExternalLink
                                    className="w-3.5 h-3.5 opacity-90 shrink-0"
                                    aria-hidden="true"
                                  />
                                </a>
                              )}

                              {yt && (
                                <button
                                  type="button"
                                  onClick={() => setActiveVideoCombo(item)}
                                  aria-label={`Play ${combo.title} video`}
                                  className="inline-flex items-center justify-center px-3.5 py-3 text-xs font-semibold text-[#3B369E] hover:text-[#16143E] bg-white/75 hover:bg-white border border-white/95 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] transition-colors cursor-pointer shrink-0"
                                >
                                  <Play
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                  />
                                </button>
                              )}
                            </div>

                            {isAdminMode && combo.isLocalDraft && (
                              <div className="flex items-center gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => handleCopyComboSnippet(combo)}
                                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-mono font-semibold text-[#23205C] hover:text-[#16143E] bg-white/70 hover:bg-white border border-white/90 rounded-lg cursor-pointer"
                                >
                                  {isCopied ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5 text-[#5D5AF0]" />
                                  )}
                                  <span>
                                    {isCopied
                                      ? 'Copied for GitHub!'
                                      : 'Copy GitHub Code'}
                                  </span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onRemoveCombo(combo.id)}
                                  aria-label={`Delete ${combo.title}`}
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/70 hover:bg-rose-100 text-[#4F4B94] hover:text-rose-600 border border-white/90 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Standalone Uploaded Files from src/extensions/ */}
            {filteredFiles.length > 0 && (
              <div className="space-y-5">
                {filteredCombos.length > 0 && (
                  <div className="flex items-center justify-between border-t border-white/75 pt-8">
                    <h2 className="font-display text-2xl font-bold text-[#16143E] tracking-tight">
                      Direct File Downloads
                    </h2>
                    <span className="text-xs font-mono font-semibold text-[#4B47C9] tabular-nums">
                      {filteredFiles.length}{' '}
                      {filteredFiles.length === 1 ? 'file' : 'files'}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFiles.map((item) => {
                    const meta = getCategoryMeta(item.category);
                    const Icon = meta.icon;
                    const isImage = item.category === 'image';
                    const isDownloading = downloadingId === item.id;

                    return (
                      <div key={item.id} className="relative group">
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute -top-1.5 -left-1.5 right-6 bottom-8 ext-glass-blob-a opacity-35 md:opacity-45 md:blur-xl group-hover:opacity-70 transition-opacity duration-300"
                        />
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute top-8 left-6 -right-1.5 -bottom-1.5 ext-glass-blob-b opacity-40 md:opacity-50 md:blur-xl group-hover:opacity-75 transition-opacity duration-300"
                        />

                        <article className="relative h-full flex flex-col justify-between ext-glass-card md:backdrop-blur-2xl rounded-2xl p-5 overflow-hidden gap-5">
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 ext-glass-sheen opacity-80"
                          />

                          <div className="relative z-10 space-y-4">
                            {isImage ? (
                              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-white/60 border border-white/90">
                                <img
                                  src={item.downloadUrl}
                                  alt={item.title}
                                  loading="lazy"
                                  className="w-full h-full object-cover"
                                />
                                <span
                                  className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 text-[11px] font-mono font-semibold border rounded-lg ${meta.badgeClass}`}
                                >
                                  .{item.extension}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-start justify-between gap-3">
                                <div
                                  className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.9)] ${meta.iconBoxClass}`}
                                >
                                  <Icon className="w-6 h-6" aria-hidden="true" />
                                </div>

                                <div className="flex items-center gap-2">
                                  <span
                                    className={`px-2.5 py-1 text-[11px] font-mono font-semibold border rounded-lg ${meta.badgeClass}`}
                                  >
                                    .{item.extension}
                                  </span>
                                  {isAdminMode && item.isLocalPreview && (
                                    <button
                                      type="button"
                                      onClick={() => onRemoveLocalFile(item.id)}
                                      aria-label={`Remove ${item.fileName}`}
                                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/70 hover:bg-rose-100 text-[#4F4B94] hover:text-rose-600 border border-white/90 transition-colors cursor-pointer"
                                    >
                                      <Trash2
                                        className="w-3.5 h-3.5"
                                        aria-hidden="true"
                                      />
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="space-y-1.5 min-w-0">
                              <h2 className="font-display text-xl font-bold text-[#16143E] tracking-tight truncate">
                                {item.title}
                              </h2>
                              <p className="text-xs font-mono font-medium text-[#4B47C9] truncate">
                                {item.fileName}
                              </p>
                              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono text-[#4F4B94] pt-1 tabular-nums">
                                <span>{formatFileSize(item.sizeBytes)}</span>
                                <span aria-hidden="true">·</span>
                                <span>{formatDate(item.updatedAt)}</span>
                                {item.isLocalPreview && (
                                  <>
                                    <span aria-hidden="true">·</span>
                                    <span className="font-semibold text-[#5D5AF0]">
                                      Local Preview
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="relative z-10 pt-3 border-t border-white/75 flex items-center gap-2">
                            <a
                              href={item.downloadUrl}
                              download={item.fileName}
                              onClick={() => handleDirectDownload(item.id)}
                              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold ext-glass-cta rounded-xl whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16143E]"
                            >
                              <Download
                                className="w-4 h-4 shrink-0"
                                aria-hidden="true"
                              />
                              <span>
                                {isDownloading
                                  ? 'Starting Download...'
                                  : 'Download File'}
                              </span>
                            </a>
                            {isImage && isAdminMode && item.isLocalPreview && (
                              <button
                                type="button"
                                onClick={() => onRemoveLocalFile(item.id)}
                                aria-label={`Remove ${item.fileName}`}
                                className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/70 hover:bg-rose-100 text-[#4F4B94] hover:text-rose-600 border border-white/90 transition-colors cursor-pointer shrink-0"
                              >
                                <Trash2 className="w-4 h-4" aria-hidden="true" />
                              </button>
                            )}
                          </div>
                        </article>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Theater YouTube Video Modal + Direct Download Footer */}
      {activeVideoCombo && activeVideoCombo.yt && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${activeVideoCombo.combo.title} video preview`}
          onClick={() => setActiveVideoCombo(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-[#181645]/60 md:backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl ext-glass-card md:backdrop-blur-2xl rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-white/80 bg-white/55">
              <div className="min-w-0">
                <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#5D5AF0]">
                  {activeVideoCombo.badgeLabel}
                </p>
                <h3 className="font-display text-xl font-bold text-[#16143E] truncate">
                  {activeVideoCombo.combo.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideoCombo(null)}
                aria-label="Close video player"
                className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/80 hover:bg-[#5D5AF0] text-[#16143E] hover:text-white border border-white/95 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="aspect-video w-full bg-[#16143E]">
              <iframe
                src={activeVideoCombo.yt.embedUrl}
                title={activeVideoCombo.combo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="px-5 py-4 bg-white/60 border-t border-white/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs font-mono font-medium text-[#3B3875] truncate">
                {activeVideoCombo.sourceLabel}
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <a
                  href={activeVideoCombo.yt.watchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#23205C] hover:text-[#16143E] bg-white/80 hover:bg-white border border-white/95 rounded-xl transition-colors"
                >
                  <Youtube className="w-3.5 h-3.5 text-[#5D5AF0]" />
                  <span>Open on YouTube</span>
                </a>
                {activeVideoCombo.isDirectFileDownload ? (
                  <a
                    href={activeVideoCombo.actionHref}
                    download={activeVideoCombo.downloadFileName}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold ext-glass-cta rounded-xl"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{activeVideoCombo.ctaLabel}</span>
                  </a>
                ) : (
                  <a
                    href={activeVideoCombo.actionHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold ext-glass-cta rounded-xl"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{activeVideoCombo.ctaLabel}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
