import {
  ArrowLeft,
  Download,
  FileArchive,
  FileAudio,
  FileBox,
  FileCode2,
  FileImage,
  FileText,
  FileVideo,
  FolderDown,
  HardDriveDownload,
  Plus,
  Search,
  Trash2,
  Upload,
} from 'lucide-react';
import { ChangeEvent, useMemo, useState } from 'react';
import type {
  ExtensionFileCategory,
  ExtensionFileItem,
} from '../types/extensions';

interface DownloadExtensionsPageProps {
  files: ExtensionFileItem[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onBackHome: () => void;
  isAdminMode: boolean;
  onAddLocalFile: (file: ExtensionFileItem) => void;
  onRemoveLocalFile: (fileId: string) => void;
}

const CATEGORY_TABS: { id: 'all' | ExtensionFileCategory; label: string }[] = [
  { id: 'all', label: 'All Files' },
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

function getCategoryMeta(category: ExtensionFileCategory) {
  switch (category) {
    case 'software':
      return {
        icon: FileCode2,
        badgeClass:
          'bg-rose-500/15 text-rose-300 border-rose-500/35',
        iconBoxClass: 'bg-rose-500/12 text-rose-400 border-rose-500/25',
      };
    case 'video':
      return {
        icon: FileVideo,
        badgeClass:
          'bg-orange-500/15 text-orange-300 border-orange-500/35',
        iconBoxClass: 'bg-orange-500/12 text-orange-400 border-orange-500/25',
      };
    case 'audio':
      return {
        icon: FileAudio,
        badgeClass:
          'bg-sky-500/15 text-sky-300 border-sky-500/35',
        iconBoxClass: 'bg-sky-500/12 text-sky-400 border-sky-500/25',
      };
    case 'image':
      return {
        icon: FileImage,
        badgeClass:
          'bg-emerald-500/15 text-emerald-300 border-emerald-500/35',
        iconBoxClass:
          'bg-emerald-500/12 text-emerald-400 border-emerald-500/25',
      };
    case 'archive':
      return {
        icon: FileArchive,
        badgeClass:
          'bg-amber-500/15 text-amber-300 border-amber-500/35',
        iconBoxClass: 'bg-amber-500/12 text-amber-400 border-amber-500/25',
      };
    case 'document':
      return {
        icon: FileText,
        badgeClass:
          'bg-violet-500/15 text-violet-300 border-violet-500/35',
        iconBoxClass: 'bg-violet-500/12 text-violet-400 border-violet-500/25',
      };
    default:
      return {
        icon: FileBox,
        badgeClass:
          'bg-neutral-500/15 text-neutral-300 border-neutral-500/35',
        iconBoxClass: 'bg-white/6 text-neutral-300 border-white/15',
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

export function DownloadExtensionsPage({
  files,
  searchQuery,
  onSearchChange,
  onBackHome,
  isAdminMode,
  onAddLocalFile,
  onRemoveLocalFile,
}: DownloadExtensionsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | ExtensionFileCategory
  >('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const visibleTabs = useMemo(() => {
    return CATEGORY_TABS.filter((tab) => {
      if (tab.id === 'all') return true;
      return files.some((file) => file.category === tab.id);
    });
  }, [files]);

  const filteredFiles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return files.filter((file) => {
      if (selectedCategory !== 'all' && file.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      return (
        file.title.toLowerCase().includes(q) ||
        file.fileName.toLowerCase().includes(q) ||
        file.extension.toLowerCase().includes(q)
      );
    });
  }, [files, selectedCategory, searchQuery]);

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
    e.target.value = '';
  };

  const handleDirectDownload = (item: ExtensionFileItem) => {
    setDownloadingId(item.id);
    window.setTimeout(() => {
      setDownloadingId((cur) => (cur === item.id ? null : cur));
    }, 1200);
  };

  return (
    <section
      id="download-extensions"
      aria-label="Download Extensions Public Directory"
      className="min-h-[calc(100vh-80px)] pt-28 pb-20 md:pt-32 md:pb-24 bg-[#070709]"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 space-y-10">
        {/* Top Back Navigation + Page Header */}
        <div className="space-y-6">
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-[#111115] hover:bg-white/10 border border-white/12 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48]"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Back to Panel Showcase</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/10 pb-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#FB7185]">
                <HardDriveDownload className="w-4 h-4" aria-hidden="true" />
                <span>Public Extension Vault</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
                Download Extensions
              </h1>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                Direct public downloads for panel tools, installers (
                <span className="font-mono text-white">.exe</span>), media clips
                (<span className="font-mono text-white">.mp4</span> /{' '}
                <span className="font-mono text-white">.mp3</span>), images (
                <span className="font-mono text-white">.jpg</span>), and asset
                packs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="px-4 py-2.5 bg-[#111115] border border-white/10 rounded-xl text-xs font-mono text-neutral-300 tabular-nums">
                <span className="text-white font-semibold">{files.length}</span>{' '}
                {files.length === 1 ? 'File Available' : 'Files Available'}
              </div>

              {isAdminMode && (
                <label className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#E11D48] hover:bg-[#BE123C] rounded-xl transition-colors cursor-pointer whitespace-nowrap">
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>Test File Locally</span>
                  <input
                    type="file"
                    onChange={handleLocalTestUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Filter Bar + Inline Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label="Filter downloadable files by format"
            className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#111115] border border-white/10 rounded-xl w-fit"
          >
            {visibleTabs.map((tab) => {
              const isSelected = selectedCategory === tab.id;
              const count =
                tab.id === 'all'
                  ? files.length
                  : files.filter((f) => f.category === tab.id).length;

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`inline-flex items-center px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-[#E11D48] text-white'
                      : 'text-neutral-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`ml-1.5 font-mono text-[11px] tabular-nums ${
                      isSelected ? 'text-white/90' : 'text-neutral-500'
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
              className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search .exe, .mp4, .mp3, .jpg..."
              aria-label="Filter extension files"
              className="w-full pl-10 pr-4 py-2.5 text-sm text-white bg-[#111115] border border-white/12 rounded-xl placeholder:text-neutral-500 focus:outline-none focus:border-[#E11D48]"
            />
          </div>
        </div>

        {/* Owner GitHub Upload Hint (Hidden from Public Visitors) */}
        {isAdminMode && (
          <div className="bg-[#111115] border border-[#E11D48]/35 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">
                Owner Upload Path for GitHub Pages
              </p>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Push any <span className="font-mono text-rose-300">.exe</span>,{' '}
                <span className="font-mono text-rose-300">.zip</span>,{' '}
                <span className="font-mono text-rose-300">.jpg</span>,{' '}
                <span className="font-mono text-rose-300">.mp4</span>, or{' '}
                <span className="font-mono text-rose-300">.mp3</span> file into{' '}
                <span className="font-mono text-white">src/extensions/</span>{' '}
                and push to GitHub. Every file pushed there appears ONLY on this
                Download Extensions page for direct public download.
              </p>
            </div>
            <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/15 rounded-lg cursor-pointer whitespace-nowrap shrink-0">
              <Upload className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Preview Local File</span>
              <input
                type="file"
                onChange={handleLocalTestUpload}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Files Grid or Clean Empty State */}
        {filteredFiles.length === 0 ? (
          <div className="py-20 px-6 text-center bg-[#111115] border border-white/10 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-white/6 border border-white/12 flex items-center justify-center mx-auto text-neutral-400">
              <FolderDown className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="space-y-1.5">
              <h2 className="font-display text-2xl font-semibold text-white">
                {files.length === 0
                  ? 'No Extensions Uploaded Yet'
                  : 'No Matching Files Found'}
              </h2>
              <p className="text-sm text-neutral-400 max-w-md mx-auto">
                {files.length === 0
                  ? 'Published tools, installers, media packs, and community files will appear here for direct download.'
                  : 'Try clearing your search or choosing a different file category.'}
              </p>
            </div>
            {(searchQuery.trim() || selectedCategory !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange('');
                  setSelectedCategory('all');
                }}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#E11D48] hover:bg-[#BE123C] rounded-lg transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFiles.map((item) => {
              const meta = getCategoryMeta(item.category);
              const Icon = meta.icon;
              const isImage = item.category === 'image';
              const isDownloading = downloadingId === item.id;

              return (
                <article
                  key={item.id}
                  className="group flex flex-col justify-between bg-[#111115] border border-white/10 hover:border-white/25 rounded-2xl p-5 transition-colors duration-150 gap-5"
                >
                  <div className="space-y-4">
                    {/* Optional Clean Image Thumbnail or Crisp Format Header */}
                    {isImage ? (
                      <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-black/60 border border-white/10">
                        <img
                          src={item.downloadUrl}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                        <span
                          className={`absolute top-2.5 left-2.5 px-2 py-0.5 text-[11px] font-mono font-semibold border rounded ${meta.badgeClass}`}
                        >
                          .{item.extension}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${meta.iconBoxClass}`}
                        >
                          <Icon className="w-6 h-6" aria-hidden="true" />
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 text-[11px] font-mono font-semibold border rounded-md ${meta.badgeClass}`}
                          >
                            .{item.extension}
                          </span>
                          {isAdminMode && item.isLocalPreview && (
                            <button
                              type="button"
                              onClick={() => onRemoveLocalFile(item.id)}
                              aria-label={`Remove ${item.fileName}`}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/6 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-300 border border-white/10 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5 min-w-0">
                      <h2 className="font-display text-xl font-semibold text-white tracking-tight truncate">
                        {item.title}
                      </h2>
                      <p className="text-xs font-mono text-neutral-400 truncate">
                        {item.fileName}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono text-neutral-500 pt-1 tabular-nums">
                        <span>{formatFileSize(item.sizeBytes)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{formatDate(item.updatedAt)}</span>
                        {item.isLocalPreview && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-amber-400">Local Preview</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Direct Public Download Action */}
                  <div className="pt-3 border-t border-white/8 flex items-center gap-2">
                    <a
                      href={item.downloadUrl}
                      download={item.fileName}
                      onClick={() => handleDirectDownload(item)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#E11D48] hover:bg-[#BE123C] rounded-xl transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>
                        {isDownloading ? 'Starting Download...' : 'Download File'}
                      </span>
                    </a>
                    {isImage && isAdminMode && item.isLocalPreview && (
                      <button
                        type="button"
                        onClick={() => onRemoveLocalFile(item.id)}
                        aria-label={`Remove ${item.fileName}`}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/6 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-300 border border-white/10 transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
