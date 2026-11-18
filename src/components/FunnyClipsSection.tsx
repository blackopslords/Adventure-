import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Play,
  Plus,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { FunnyClip } from '../utils/funnyVideoLoader';

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
      className="relative py-20 md:py-24 bg-[#070709] border-t border-white/10 overflow-hidden"
    >
      {/* Subtle Ambient Ember Backdrop Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[240px] bg-gradient-to-b from-orange-600/12 via-rose-700/8 to-transparent blur-3xl"
      />

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-12 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-orange-400 uppercase">
              <Flame className="w-3.5 h-3.5 text-orange-400 shrink-0" aria-hidden="true" />
              <span>Discord Funny Clips</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white text-balance">
              Up Next · Serial Playlist
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-mono text-neutral-400 tabular-nums whitespace-nowrap">
              Ordered sequentially 01 →{' '}
              {formatSerial(Math.max(totalClips, placeholderSerials.length))}
            </span>
            {isAdminMode && (
              <button
                type="button"
                onClick={() => handleOpenUploadTrigger()}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#E11D48] to-orange-600 hover:from-[#BE123C] hover:to-orange-500 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Add Clip (01, 02...)</span>
              </button>
            )}
          </div>
        </div>

        {/* Owner Quick Upload Drawer */}
        {isAdminMode && uploadPanelOpen && (
          <div className="bg-[#0D0D12] border border-orange-500/35 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-xl font-bold text-white">
                  Upload Funny Clip by Serial Number
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Test clips right here, or drop files named{' '}
                  <span className="font-mono text-orange-300">01.mp4</span>,{' '}
                  <span className="font-mono text-orange-300">02.mp4</span> inside{' '}
                  <span className="font-mono text-white">src/funny-videos/</span>{' '}
                  for all public visitors on GitHub Pages.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setUploadPanelOpen(false)}
                aria-label="Close upload panel"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/8 hover:bg-white/15 text-neutral-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Serial No.
                </label>
                <input
                  type="text"
                  maxLength={3}
                  value={nextSerialInput}
                  onChange={(e) => setNextSerialInput(e.target.value)}
                  placeholder="01"
                  className="w-full px-3 py-2.5 text-sm font-mono text-white bg-[#070709] border border-white/15 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="sm:col-span-6">
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Clip Title (Optional)
                </label>
                <input
                  type="text"
                  value={customClipTitle}
                  onChange={(e) => setCustomClipTitle(e.target.value)}
                  placeholder="e.g. Late Night Voice Room Chaos"
                  className="w-full px-3 py-2.5 text-sm text-white bg-[#070709] border border-white/15 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="sm:col-span-4">
                <label className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-lg cursor-pointer transition-colors whitespace-nowrap">
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

        {/* Up Next · Serial Playlist Container (Only Category) */}
        <div className="serial-playlist-gradient relative overflow-hidden rounded-2xl p-5 sm:p-7 space-y-5 border border-[#FF9408]/45 shadow-[0_24px_65px_-20px_rgba(255,148,8,0.42)]">
          <div className="flex items-center justify-between gap-4 border-b border-[#100C08]/12 pb-4">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#100C08] tracking-tight">
              Up Next · Serial Playlist
            </h3>
            <span className="text-xs font-mono font-semibold text-[#95122C] tabular-nums whitespace-nowrap">
              {totalClips > 0
                ? `${formatSerial(safeIndex + 1)} / ${formatSerial(totalClips)}`
                : '00 Ready'}
            </span>
          </div>

          {totalClips > 0 ? (
            <div className="space-y-3">
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
                    className={`group flex flex-col sm:flex-row sm:items-center gap-4 p-3 rounded-xl transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#95122C] ${
                      isCurrent ? 'bg-[#95122C]/12' : 'hover:bg-[#100C08]/8'
                    }`}
                  >
                    {/* Fire-Lit 16:9 Video Thumbnail Frame */}
                    <div className="relative w-full sm:w-52 shrink-0">
                      <div
                        aria-hidden="true"
                        className={`fire-frame-aura absolute -inset-1 rounded-xl blur-md transition-opacity duration-300 ${
                          isCurrent
                            ? 'opacity-95'
                            : 'opacity-45 group-hover:opacity-90'
                        }`}
                      />
                      <div className="relative aspect-video overflow-hidden rounded-xl bg-[#1b0b08] shadow-[0_0_24px_-3px_rgba(249,115,22,0.6)]">
                        <div
                          aria-hidden="true"
                          className={`fire-frame-beam transition-opacity duration-200 ${
                            isCurrent
                              ? 'opacity-100 fire-frame-beam-fast'
                              : 'opacity-95 group-hover:opacity-100'
                          }`}
                        />
                        <div className="absolute inset-[3px] z-10 rounded-[9px] overflow-hidden bg-black">
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
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="w-10 h-10 rounded-full bg-black/75 border border-orange-400/70 flex items-center justify-center text-white shadow-[0_0_18px_rgba(249,115,22,0.6)]">
                              <Play className="w-4 h-4 ml-0.5" aria-hidden="true" />
                            </span>
                          </div>
                          <span className="absolute bottom-1.5 left-2 text-[11px] font-mono font-bold text-orange-300 tabular-nums">
                            {clip.serialLabel}
                          </span>
                          {durations[clip.id] && (
                            <span className="absolute bottom-1.5 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[11px] font-mono text-white tabular-nums">
                              {durations[clip.id]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Serial & Title Column */}
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#95122C] tabular-nums">
                        <span>Serial #{clip.serialLabel}</span>
                        <span className="text-[#100C08]/35" aria-hidden="true">
                          ·
                        </span>
                        <span className="text-[#100C08]/75 font-medium truncate">
                          {clip.subtitle}
                        </span>
                      </div>
                      <h4 className="font-display text-xl sm:text-2xl font-semibold text-[#100C08] group-hover:text-[#95122C] transition-colors truncate">
                        {clip.title}
                      </h4>
                    </div>

                    {/* Right Action Indicator */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#100C08] group-hover:text-white bg-[#100C08]/10 group-hover:bg-[#95122C] border border-[#100C08]/15 group-hover:border-[#95122C] rounded-lg transition-colors whitespace-nowrap">
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
                          className="p-2 text-[#100C08]/70 hover:text-[#95122C] cursor-pointer"
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
            <div className="space-y-3">
              {placeholderSerials.map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleOpenUploadTrigger(num)}
                  className="w-full flex flex-col sm:flex-row sm:items-center gap-4 p-3 rounded-xl hover:bg-[#100C08]/8 transition-colors text-left cursor-pointer group"
                >
                  <div className="relative w-full sm:w-52 shrink-0">
                    <div
                      aria-hidden="true"
                      className="fire-frame-aura absolute -inset-1 rounded-xl blur-md opacity-45 group-hover:opacity-90 transition-opacity"
                    />
                    <div className="relative aspect-video overflow-hidden rounded-xl bg-[#1a0b08] shadow-[0_0_24px_-3px_rgba(249,115,22,0.55)]">
                      <div
                        aria-hidden="true"
                        className="fire-frame-beam opacity-95 group-hover:opacity-100"
                      />
                      <div className="absolute inset-[3px] z-10 rounded-[9px] bg-[#09090d] flex items-center justify-center">
                        <span className="text-sm font-mono font-semibold text-orange-300 tabular-nums">
                          {num}.mp4
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-xs font-mono font-semibold text-[#95122C] tabular-nums">
                      Serial #{num}
                    </p>
                    <p className="font-display text-xl font-semibold text-[#100C08] group-hover:text-[#95122C] truncate">
                      Drop src/funny-videos/{num}.mp4
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fire-Framed Theater Video Player Modal */}
      {playerOpen && activeClip && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Playing ${activeClip.title}`}
          onClick={() => setPlayerOpen(false)}
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl space-y-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-mono text-orange-400 tabular-nums">
                  Serial #{activeClip.serialLabel} · {activeClip.subtitle}
                </p>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white truncate">
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
                      className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-neutral-200 hover:text-white bg-white/10 hover:bg-white/18 border border-white/15 rounded-lg cursor-pointer"
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
                      className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-neutral-200 hover:text-white bg-white/10 hover:bg-white/18 border border-white/15 rounded-lg cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setAutoAdvance((prev) => !prev)}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border cursor-pointer ${
                        autoAdvance
                          ? 'text-orange-300 bg-orange-500/15 border-orange-500/40'
                          : 'text-neutral-400 bg-white/5 border-white/10'
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
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-[#E11D48] text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="relative">
              <div
                aria-hidden="true"
                className="fire-frame-aura absolute -inset-3 rounded-3xl blur-2xl opacity-95"
              />
              <div className="relative overflow-hidden rounded-2xl p-[3px] bg-[#1a0a08] shadow-[0_0_45px_-6px_rgba(249,115,22,0.65)]">
                <div
                  aria-hidden="true"
                  className="fire-frame-beam fire-frame-beam-fast"
                />
                <div className="relative z-10 aspect-video rounded-[13px] overflow-hidden bg-black">
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
                    className="w-full h-full object-contain bg-black"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
