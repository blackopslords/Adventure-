import {
  ChevronLeft,
  ChevronRight,
  Film,
  Play,
  Plus,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { FunnyClip } from '../utils/funnyVideoLoader';
import { CrystalPlayButton } from './CrystalPlayButton';

interface FunnyClipsSectionProps {
  clips: FunnyClip[];
  isAdminMode: boolean;
  onOpenAdminLogin: () => void;
  onAddLocalClip: (clip: FunnyClip) => void;
  onRemoveLocalClip: (clipId: string) => void;
  onClipPlaybackChange: (isPlaying: boolean) => void;
}

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? `0${secs}` : secs}`;
}

function formatSerial(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

export function FunnyClipsSection({
  clips,
  isAdminMode,
  onOpenAdminLogin,
  onAddLocalClip,
  onRemoveLocalClip,
  onClipPlaybackChange,
}: FunnyClipsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [durations, setDurations] = useState<Record<string, string>>({});
  const [uploadPanelOpen, setUploadPanelOpen] = useState(false);
  const [nextSerialInput, setNextSerialInput] = useState('01');
  const [customClipTitle, setCustomClipTitle] = useState('');

  const playerVideoRef = useRef<HTMLVideoElement | null>(null);
  const totalClips = clips.length;
  const safeIndex = totalClips > 0 ? Math.min(activeIndex, totalClips - 1) : 0;
  const activeClip = totalClips > 0 ? clips[safeIndex] : null;

  useEffect(() => {
    const maxSerial = clips.reduce(
      (max, clip) => Math.max(max, clip.serialNumber),
      0
    );
    setNextSerialInput(formatSerial(maxSerial + 1));
  }, [clips]);

  useEffect(() => {
    if (!playerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPlayerOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [playerOpen]);

  useEffect(() => {
    if (!playerOpen) {
      if (playerVideoRef.current) {
        playerVideoRef.current.pause();
      }
      onClipPlaybackChange(false);
    }
  }, [playerOpen, onClipPlaybackChange]);

  const handleOpenClip = (index: number) => {
    if (index < 0 || index >= totalClips) return;
    setActiveIndex(index);
    setPlayerOpen(true);
  };

  const handleRecordDuration = (clipId: string, durationSec: number) => {
    const formatted = formatDuration(durationSec);
    setDurations((prev) =>
      prev[clipId] === formatted ? prev : { ...prev, [clipId]: formatted }
    );
  };

  const handleLocalFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const parsedNum = Math.max(
      1,
      Number.parseInt(nextSerialInput.replace(/\D/g, ''), 10) ||
        clips.length + 1
    );
    const serialLabel = formatSerial(parsedNum);
    const rawFileTitle = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/^0*[1-9]\d*[-_.\s]*/, '')
      .replace(/[-_]+/g, ' ')
      .trim();

    const finalTitle =
      customClipTitle.trim() ||
      (rawFileTitle
        ? rawFileTitle.replace(/\b\w/g, (c) => c.toUpperCase())
        : `Discord Funny Clip ${serialLabel}`);

    const url = URL.createObjectURL(file);
    const newClip: FunnyClip = {
      id: `local-${serialLabel}-${Date.now()}`,
      serialNumber: parsedNum,
      serialLabel,
      title: finalTitle,
      subtitle: `Discord Voice & Chat · Serial #${serialLabel}`,
      videoUrl: url,
      isLocalPreview: true,
    };

    onAddLocalClip(newClip);
    setCustomClipTitle('');
    setUploadPanelOpen(false);
    e.target.value = '';
  };

  const handleOpenUploadTrigger = (prefillSerial?: string) => {
    if (!isAdminMode) {
      onOpenAdminLogin();
      return;
    }
    if (prefillSerial) {
      setNextSerialInput(prefillSerial);
    }
    setUploadPanelOpen((prev) => (prefillSerial ? true : !prev));
  };

  const placeholderSerials = ['01', '02', '03', '04'];

  return (
    <section
      id="funny-clips"
      aria-label="Discord Funny Videos Playlist"
      className="relative py-20 md:py-24 ext-glass-stage text-[#16143E] border-t border-white/80 overflow-hidden"
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
            <linearGradient id="clipsRibbonA" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6E6DF3" stopOpacity="0.42" />
              <stop offset="50%" stopColor="#A9A5FF" stopOpacity="0.26" />
              <stop offset="100%" stopColor="#F2B8EC" stopOpacity="0.34" />
            </linearGradient>
            <linearGradient id="clipsRibbonB" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="48%" stopColor="#8E8BFF" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#6462EE" stopOpacity="0.38" />
            </linearGradient>
          </defs>
          <path
            d="M-120,160 C220,40 460,380 840,220 C1140,95 1320,210 1560,70 L1560,320 C1280,440 1050,270 760,410 C420,570 210,250 -120,370 Z"
            fill="url(#clipsRibbonA)"
          />
          <path
            d="M-120,640 C260,490 540,790 940,580 C1210,440 1370,540 1560,440 L1560,670 C1290,770 1070,610 790,750 C460,910 200,690 -120,790 Z"
            fill="url(#clipsRibbonB)"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-[#4B47C9] uppercase">
              <Film className="w-3.5 h-3.5 text-[#5D5AF0] shrink-0" aria-hidden="true" />
              <span>Discord Funny Clips</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#16143E] text-balance">
              Up Next · Serial Playlist
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="px-3.5 py-2 ext-glass-panel rounded-xl text-xs font-mono font-semibold text-[#2F2C69] tabular-nums whitespace-nowrap">
              Ordered sequentially 01 →{' '}
              {formatSerial(Math.max(totalClips, placeholderSerials.length))}
            </span>
            {isAdminMode && (
              <button
                type="button"
                onClick={() => handleOpenUploadTrigger()}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold ext-glass-cta rounded-xl whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16143E]"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Add Clip (01, 02...)</span>
              </button>
            )}
          </div>
        </div>

        {/* Owner Quick Upload Drawer */}
        {isAdminMode && uploadPanelOpen && (
          <div className="ext-glass-card md:backdrop-blur-2xl rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-xl font-bold text-[#16143E]">
                  Upload Funny Clip by Serial Number
                </h3>
                <p className="text-xs text-[#3B3875] mt-1">
                  Test clips right here, or drop files named{' '}
                  <span className="font-mono font-semibold text-[#4B47C9]">01.mp4</span>,{' '}
                  <span className="font-mono font-semibold text-[#4B47C9]">02.mp4</span> inside{' '}
                  <span className="font-mono font-semibold text-[#16143E]">src/funny-videos/</span>{' '}
                  for all public visitors on GitHub Pages.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setUploadPanelOpen(false)}
                aria-label="Close upload panel"
                className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/75 hover:bg-white text-[#23205C] border border-white/90 cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#23205C] mb-1">
                  Serial No.
                </label>
                <input
                  type="text"
                  maxLength={3}
                  value={nextSerialInput}
                  onChange={(e) => setNextSerialInput(e.target.value)}
                  placeholder="01"
                  className="w-full px-3 py-2.5 text-sm font-mono text-[#16143E] bg-white/75 border border-white/90 rounded-xl focus:outline-none focus:border-[#5D5AF0]"
                />
              </div>
              <div className="sm:col-span-6">
                <label className="block text-xs font-semibold text-[#23205C] mb-1">
                  Clip Title (Optional)
                </label>
                <input
                  type="text"
                  value={customClipTitle}
                  onChange={(e) => setCustomClipTitle(e.target.value)}
                  placeholder="e.g. Late Night Voice Room Chaos"
                  className="w-full px-3 py-2.5 text-sm text-[#16143E] bg-white/75 border border-white/90 rounded-xl placeholder:text-[#6B67AC] focus:outline-none focus:border-[#5D5AF0]"
                />
              </div>
              <div className="sm:col-span-4">
                <label className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold ext-glass-cta rounded-xl cursor-pointer whitespace-nowrap">
                  <Upload className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Select Video (.mp4 / .mov)</span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
                    onChange={handleLocalFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Up Next · Serial Playlist Container — 3D Iridescent Lavender Frosted Glass */}
        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-3 -left-3 right-12 bottom-12 ext-glass-blob-a opacity-45 md:opacity-55 md:blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-12 left-12 -right-3 -bottom-3 ext-glass-blob-b opacity-50 md:opacity-65 md:blur-2xl"
          />

          <div className="relative ext-glass-card md:backdrop-blur-2xl overflow-hidden rounded-2xl p-5 sm:p-7 space-y-5">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 ext-glass-sheen opacity-80"
            />

            <div className="relative z-10 flex items-center justify-between gap-4 border-b border-white/75 pb-4">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#16143E] tracking-tight">
                Up Next · Serial Playlist
              </h3>
              <span className="px-3 py-1 rounded-lg bg-white/75 border border-white/95 text-xs font-mono font-bold text-[#4B47C9] tabular-nums whitespace-nowrap shadow-sm">
                {totalClips > 0
                  ? `${formatSerial(safeIndex + 1)} / ${formatSerial(totalClips)}`
                  : '00 Ready'}
              </span>
            </div>

            {totalClips > 0 ? (
              <div className="relative z-10 space-y-3">
                {clips.map((clip, idx) => {
                  const isCurrent = playerOpen && idx === safeIndex;
                  return (
                    <div
                      key={clip.id}
                      onClick={() => handleOpenClip(idx)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleOpenClip(idx);
                        }
                      }}
                      className={`group flex flex-col sm:flex-row sm:items-center gap-4 p-3 rounded-2xl border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5D5AF0] ${
                        isCurrent
                          ? 'bg-white/70 border-white shadow-[0_12px_30px_-10px_rgba(93,90,240,0.28)]'
                          : 'bg-white/25 hover:bg-white/55 border-white/55 hover:border-white/90'
                      }`}
                    >
                      {/* 3D Glass Video Back/Front Thumbnail Frame */}
                      <div className="relative w-full sm:w-56 shrink-0">
                        <div
                          aria-hidden="true"
                          className={`ext-glass-blob-a absolute -inset-1.5 md:blur-lg transition-opacity duration-300 ${
                            isCurrent
                              ? 'opacity-85'
                              : 'opacity-40 group-hover:opacity-80'
                          }`}
                        />
                        <div className="relative aspect-video p-[3px] rounded-xl ext-glass-card overflow-hidden">
                          <div className="relative w-full h-full rounded-[9px] overflow-hidden bg-[#181645]">
                            <video
                              src={clip.videoUrl}
                              muted
                              loop
                              playsInline
                              preload="metadata"
                              onMouseEnter={(e) => {
                                e.currentTarget.play().catch(() => {});
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.pause();
                                e.currentTarget.currentTime = 0;
                              }}
                              onLoadedMetadata={(e) =>
                                handleRecordDuration(
                                  clip.id,
                                  e.currentTarget.duration
                                )
                              }
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                            />
                            {/* Frosted Scrim & Front Glass Sheen */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#16143E]/70 via-transparent to-[#16143E]/25" />
                            <div
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-0 ext-glass-sheen opacity-55"
                            />

                            {/* Crystal-Shape Transparent Glass Play Button on Video Front */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <CrystalPlayButton
                                size="sm"
                                className="opacity-95 group-hover:scale-110"
                              />
                            </div>

                            <span className="absolute bottom-1.5 left-2 px-1.5 py-0.5 rounded bg-white/85 border border-white text-[11px] font-mono font-bold text-[#16143E] tabular-nums">
                              {clip.serialLabel}
                            </span>
                            {durations[clip.id] && (
                              <span className="absolute bottom-1.5 right-2 px-1.5 py-0.5 rounded bg-[#16143E]/75 border border-white/30 text-[11px] font-mono text-white tabular-nums">
                                {durations[clip.id]}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Serial & Title Column */}
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#4B47C9] tabular-nums">
                          <span>Serial #{clip.serialLabel}</span>
                          <span className="text-[#4B47C9]/45" aria-hidden="true">
                            ·
                          </span>
                          <span className="text-[#35326B] font-medium truncate">
                            {clip.subtitle}
                          </span>
                        </div>
                        <h4 className="font-display text-xl sm:text-2xl font-bold text-[#16143E] group-hover:text-[#4B47C9] transition-colors truncate">
                          {clip.title}
                        </h4>
                      </div>

                      {/* Right Action Indicator */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#23205C] group-hover:text-white bg-white/80 group-hover:bg-[#5D5AF0] border border-white/95 group-hover:border-white/50 rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] transition-colors whitespace-nowrap">
                          <Play className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Watch</span>
                        </span>

                        {isAdminMode && clip.isLocalPreview && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveLocalClip(clip.id);
                            }}
                            aria-label={`Remove ${clip.title}`}
                            className="p-2 rounded-lg text-[#4F4B94] hover:text-rose-600 hover:bg-rose-100/70 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="relative z-10 space-y-3">
                {placeholderSerials.map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleOpenUploadTrigger(num)}
                    className="w-full flex flex-col sm:flex-row sm:items-center gap-4 p-3 rounded-2xl bg-white/25 hover:bg-white/55 border border-white/55 hover:border-white/90 transition-all text-left cursor-pointer group"
                  >
                    {/* 3D Glass Placeholder Video Frame + Crystal Play Button */}
                    <div className="relative w-full sm:w-56 shrink-0">
                      <div
                        aria-hidden="true"
                        className="ext-glass-blob-a absolute -inset-1.5 md:blur-lg opacity-40 group-hover:opacity-80 transition-opacity"
                      />
                      <div className="relative aspect-video p-[3px] rounded-xl ext-glass-card overflow-hidden">
                        <div className="relative w-full h-full rounded-[9px] overflow-hidden bg-gradient-to-br from-[#2C286D]/90 via-[#4B47B8]/82 to-[#1B184B]/95 flex items-center justify-center">
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 ext-glass-sheen opacity-75"
                          />
                          <CrystalPlayButton
                            size="sm"
                            className="group-hover:scale-110"
                          />
                          <span className="absolute bottom-1.5 left-2 px-1.5 py-0.5 rounded bg-white/85 border border-white text-[11px] font-mono font-bold text-[#16143E] tabular-nums">
                            {num}.mp4
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="text-xs font-mono font-bold text-[#4B47C9] tabular-nums">
                        Serial #{num}
                      </p>
                      <p className="font-display text-xl font-bold text-[#16143E] group-hover:text-[#4B47C9] transition-colors truncate">
                        Drop src/funny-videos/{num}.mp4
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3D Lavender Glass Theater Video Player Modal */}
      {playerOpen && activeClip && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Playing ${activeClip.title}`}
          onClick={() => setPlayerOpen(false)}
          className="fixed inset-0 z-50 bg-[#181645]/60 md:backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl ext-glass-card md:backdrop-blur-2xl rounded-2xl overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 border-b border-white/80 bg-white/55">
              <div className="min-w-0">
                <p className="text-xs font-mono font-bold text-[#5D5AF0] tabular-nums">
                  Serial #{activeClip.serialLabel} · {activeClip.subtitle}
                </p>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#16143E] truncate">
                  {activeClip.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {totalClips > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveIndex(
                          (safeIndex - 1 + totalClips) % totalClips
                        )
                      }
                      aria-label="Previous clip"
                      className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-[#23205C] hover:text-[#16143E] bg-white/80 hover:bg-white border border-white/95 rounded-xl cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                      <span>Prev</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveIndex((safeIndex + 1) % totalClips)
                      }
                      aria-label="Next clip"
                      className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-[#23205C] hover:text-[#16143E] bg-white/80 hover:bg-white border border-white/95 rounded-xl cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setAutoAdvance((prev) => !prev)}
                      className={`px-3 py-2 text-xs font-semibold rounded-xl border cursor-pointer ${
                        autoAdvance
                          ? 'ext-glass-cta border-transparent'
                          : 'text-[#3B3875] bg-white/70 border-white/90 hover:bg-white'
                      }`}
                    >
                      Auto-Next {autoAdvance ? 'On' : 'Off'}
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => setPlayerOpen(false)}
                  aria-label="Close video player"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/80 hover:bg-[#5D5AF0] text-[#16143E] hover:text-white border border-white/95 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-4 bg-white/30">
              <div className="aspect-video rounded-xl overflow-hidden bg-[#16143E] border border-white/85 shadow-lg">
                <video
                  ref={playerVideoRef}
                  key={`player-${activeClip.id}`}
                  src={activeClip.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  onPlay={() => onClipPlaybackChange(true)}
                  onPause={() => onClipPlaybackChange(false)}
                  onEnded={() => {
                    if (autoAdvance && totalClips > 1) {
                      setActiveIndex((safeIndex + 1) % totalClips);
                    } else {
                      onClipPlaybackChange(false);
                    }
                  }}
                  className="w-full h-full object-contain bg-[#16143E]"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
