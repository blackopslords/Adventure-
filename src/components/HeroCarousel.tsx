import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Music,
  PencilLine,
  Users,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { TeamProfile } from '../data/teamProfiles';
import { BUILT_IN_TRACKS } from '../utils/profileAudio';
import { DiscordProfileFrame } from './DiscordProfileFrame';
import { ResilientImage } from './ResilientImage';

interface HeroCarouselProps {
  profiles: TeamProfile[];
  activeIndex: number;
  onSelectProfile: (index: number, autoPlayMusic?: boolean) => void;
  onOpenEditor: (profile: TeamProfile) => void;
  starredIds: string[];
  onToggleStar: (profileId: string) => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  volume: number;
  onChangeVolume: (next: number) => void;
  isAdminMode: boolean;
}

export function HeroCarousel({
  profiles,
  activeIndex,
  onSelectProfile,
  onOpenEditor,
  starredIds,
  onToggleStar,
  isMusicPlaying,
  onToggleMusic,
  isMuted,
  onToggleMute,
  volume,
  onChangeVolume,
  isAdminMode,
}: HeroCarouselProps) {
  const [expandedProfile, setExpandedProfile] = useState<TeamProfile | null>(null);
  const [isMobileViewport, setIsMobileViewport] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const activeProfile = profiles[activeIndex] ?? profiles[0];
  const total = profiles.length;

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobileViewport(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!expandedProfile) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpandedProfile(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [expandedProfile]);

  const activeTrack =
    BUILT_IN_TRACKS.find((t) => t.id === activeProfile.trackId) ??
    BUILT_IN_TRACKS[0];
  const displayTrackName =
    activeProfile.customTrackName || activeTrack.label;

  const handlePrev = () => {
    onSelectProfile((activeIndex - 1 + total) % total, true);
  };

  const handleNext = () => {
    onSelectProfile((activeIndex + 1) % total, true);
  };

  const getCarouselOffset = (index: number) => {
    let diff = index - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  return (
    <section
      id="top"
      aria-label="Discord Panel Team Showcase"
      className="relative min-h-screen w-full overflow-hidden flex flex-col justify-between pt-24 pb-10 md:pt-28 md:pb-12"
    >
      {/* Dynamic Full-Bleed Crossfading Backdrop */}
      <div className="absolute inset-0 z-0 bg-[#070709]" aria-hidden="true">
        {profiles.map((profile, idx) => {
          const isCurrent = idx === activeIndex;
          if (isMobileViewport && !isCurrent) return null;
          return (
            <div
              key={profile.id}
              className={`absolute inset-0 transition-opacity duration-500 sm:duration-700 ease-out ${
                isCurrent ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <ResilientImage
                src={profile.backdropUrl}
                alt={`${profile.name} backdrop`}
                className={`w-full h-full object-cover object-center ${
                  isCurrent && !isMobileViewport ? 'animate-cinema-backdrop' : ''
                }`}
              />
              {profile.backdropVideoUrl && isCurrent && (
                <video
                  key={profile.backdropVideoUrl}
                  src={profile.backdropVideoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload={isMobileViewport ? 'metadata' : 'auto'}
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-45"
                />
              )}
            </div>
          );
        })}

        {/* Measured Contrast Scrims */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070709]/95 via-[#070709]/70 to-[#070709]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-[#070709]/65" />
      </div>

      {/* Main Split Content Container */}
      <div className="relative z-10 max-w-[1440px] w-full mx-auto px-6 md:px-12 my-auto py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Active Panel Member Information + Editable Text & Music Trigger */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-mono tracking-wider text-neutral-300 uppercase tabular-nums">
              <span>
                {activeProfile.indexLabel} / 0{total}
              </span>
              <span className="mx-2 text-neutral-500" aria-hidden="true">
                ·
              </span>
              <span>Discord Server Panel</span>
              <span className="mx-2 text-neutral-500" aria-hidden="true">
                ·
              </span>
              <span className="text-white">{activeProfile.discordHandle}</span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[0.98] text-balance max-w-xl">
              {activeProfile.name}
            </h1>

            {/* Unboxed Metadata Line */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm sm:text-base font-medium text-neutral-200 tabular-nums">
              <span className="relative inline-flex p-[1.5px] rounded-md overflow-hidden align-middle shadow-[0_0_16px_rgba(225,29,72,0.5)]">
                <span aria-hidden="true" className="role-border-beam" />
                <span className="relative z-10 inline-flex items-center px-2.5 py-0.5 rounded-[5px] bg-[#E11D48] text-white font-semibold text-xs tracking-wider uppercase">
                  {activeProfile.badgeCode}
                </span>
              </span>
              <span className="text-neutral-500" aria-hidden="true">
                ·
              </span>
              <span>{activeProfile.roleTitle}</span>
              <span className="text-neutral-500" aria-hidden="true">
                ·
              </span>
              <span className="text-neutral-300">{activeProfile.joinedYear}</span>
            </div>

            {/* Clickable Custom Profile Text */}
            <div className="max-w-xl space-y-2">
              <p className="text-neutral-200 text-base sm:text-[17px] leading-relaxed">
                {activeProfile.customText}
              </p>
              <p className="text-xs text-neutral-400">
                {activeProfile.specialty}
              </p>
            </div>

            {/* Action Buttons: Liquid Web3 "Meet The Team" + Owner Edit */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  document
                    .getElementById('roster')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative inline-flex items-center p-1.5 pr-6 rounded-full overflow-hidden bg-white/[0.12] md:bg-white/[0.08] hover:bg-white/[0.18] md:backdrop-blur-xl border border-white/25 hover:border-white/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_12px_32px_rgba(0,0,0,0.55)] transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span aria-hidden="true" className="liquid-web3-sheen" />
                <span className="liquid-orb-ring relative z-10 inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-white/30 via-[#E11D48]/35 to-black/40 border border-white/55 text-white transition-transform duration-200 group-hover:scale-105">
                  <Users className="w-4 h-4" aria-hidden="true" />
                </span>
                <span className="relative z-10 ml-3 text-sm font-semibold tracking-wide text-white">
                  Meet The Team
                </span>
              </button>

              {isAdminMode && (
                <button
                  type="button"
                  onClick={() => onOpenEditor(activeProfile)}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-black/50 hover:bg-white/15 border border-white/25 rounded-full transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <PencilLine className="w-4 h-4" aria-hidden="true" />
                  <span>Edit Text &amp; Media</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Tall 3D Glass-Outline Mirror Profile Slider */}
          <div className="lg:col-span-7">
            <div className="relative bg-[#0c0d12]/72 md:bg-white/[0.03] md:backdrop-blur-md border border-white/15 rounded-3xl p-4 sm:p-6 shadow-[0_24px_64px_rgba(0,0,0,0.65)] overflow-hidden">
              <div className="flex items-center justify-between sm:justify-end mb-2">
                <span className="text-[11px] font-mono text-neutral-400 sm:hidden">
                  Swipe card to switch
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous team profile"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/12 hover:bg-[#E11D48] text-white border border-white/20 md:backdrop-blur-md transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next team profile"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/12 hover:bg-[#E11D48] text-white border border-white/20 md:backdrop-blur-md transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <ChevronRight className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* 3D Mirror Coverflow Stage (Swipeable on Mobile, GPU-Composited) */}
              <div
                onTouchStart={(e) => {
                  const t = e.touches[0];
                  if (t) touchStartRef.current = { x: t.clientX, y: t.clientY };
                }}
                onTouchEnd={(e) => {
                  const start = touchStartRef.current;
                  touchStartRef.current = null;
                  const t = e.changedTouches[0];
                  if (!start || !t) return;
                  const dx = t.clientX - start.x;
                  const dy = t.clientY - start.y;
                  if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy) * 1.15) {
                    if (dx < 0) {
                      handleNext();
                    } else {
                      handlePrev();
                    }
                  }
                }}
                className="relative h-[530px] sm:h-[615px] flex items-start justify-center pt-[74px] sm:pt-[88px] overflow-hidden touch-pan-y select-none"
                style={{ perspective: isMobileViewport ? '1000px' : '1400px' }}
              >
                {/* Glossy Reflective Stage Plane */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/85 via-white/[0.05] to-transparent pointer-events-none border-t border-white/12"
                  style={{ transform: 'translateY(8px)' }}
                />

                {profiles.map((profile, idx) => {
                  const offset = getCarouselOffset(idx);
                  const absOffset = Math.abs(offset);
                  if (isMobileViewport && absOffset > 1) return null;

                  const isCenter = offset === 0;
                  const translateX = offset * (isMobileViewport ? 96 : 138);
                  const translateZ = -absOffset * (isMobileViewport ? 55 : 90);
                  const rotateY = offset * (isMobileViewport ? -10 : -16);
                  const scale = isCenter
                    ? 1
                    : absOffset === 1
                      ? isMobileViewport
                        ? 0.84
                        : 0.86
                      : 0.72;
                  const opacity = isCenter ? 1 : absOffset === 1 ? 0.84 : 0.48;
                  const zIndex = 30 - absOffset * 10;

                  return (
                    <div
                      key={profile.id}
                      style={{
                        transform: `translate3d(${translateX}px, 0, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                        opacity,
                        zIndex,
                        transformStyle: 'preserve-3d',
                      }}
                      className="group absolute w-[212px] sm:w-[252px] transition-[transform,opacity] duration-300 sm:duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
                    >
                      {/* Frosted Glass Outline OR Discord Animated Frame (01 Skull / 02 Symbiote / 03 Raven) */}
                      <DiscordProfileFrame
                        active={isCenter}
                        variant={
                          profile.indexLabel === '01'
                            ? 'skull'
                            : profile.indexLabel === '02'
                              ? 'symbiote'
                              : profile.indexLabel === '03'
                                ? 'raven'
                                : undefined
                        }
                      >
                        <div
                          className={`relative rounded-[22px] transition-all duration-300 ${
                            profile.indexLabel === '01' ||
                            profile.indexLabel === '02' ||
                            profile.indexLabel === '03'
                              ? 'p-0 shadow-[0_28px_65px_rgba(0,0,0,0.92)]'
                              : isCenter
                                ? 'p-[2px] bg-gradient-to-br from-white/75 via-white/20 to-white/55 shadow-[0_28px_65px_rgba(0,0,0,0.9)]'
                                : 'p-[2px] bg-gradient-to-br from-white/40 via-white/10 to-white/30 shadow-[0_18px_40px_rgba(0,0,0,0.75)] hover:from-white/55 hover:to-white/40'
                          }`}
                        >
                          <div className="relative aspect-[9/14] w-full rounded-[20px] overflow-hidden bg-[#0A0A0E] ring-1 ring-inset ring-white/20">
                          <button
                            type="button"
                            onClick={() => {
                              if (isCenter) {
                                if (isAdminMode) {
                                  onOpenEditor(profile);
                                } else {
                                  onToggleMusic();
                                }
                              } else {
                                onSelectProfile(idx, true);
                              }
                            }}
                            aria-label={
                              isCenter
                                ? isAdminMode
                                  ? `Edit ${profile.name} profile text and music`
                                  : `${isMusicPlaying ? 'Pause' : 'Play'} ${profile.name} theme music`
                                : `Select ${profile.name}`
                            }
                            aria-pressed={isCenter}
                            className="block w-full h-full text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48]"
                          >
                            <ResilientImage
                              src={profile.posterUrl}
                              alt={`${profile.name} profile showcase`}
                              fallbackTitle={profile.name}
                              className="w-full h-full object-cover"
                            />

                            {/* Compact Bottom Scrim (No Blur so Portrait Shows in Full) */}
                            <div
                              className={`absolute inset-x-0 bottom-0 pt-10 pb-3.5 px-4 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-300 ${
                                isCenter ? 'opacity-100' : 'opacity-90'
                              }`}
                            >
                              <div className="flex items-baseline justify-between gap-2">
                                <p className="font-display text-lg sm:text-xl font-semibold tracking-wide text-white truncate">
                                  {profile.name}
                                </p>
                                <span className="text-[11px] font-mono text-white/75 tabular-nums shrink-0">
                                  {Number(profile.indexLabel)} / {total}
                                </span>
                              </div>
                              <p className="text-[11px] font-mono text-neutral-200/90 mt-0.5 truncate">
                                {isCenter
                                  ? `${profile.discordHandle} · ${profile.roleTitle}`
                                  : profile.roleTitle}
                              </p>
                            </div>
                          </button>

                          {/* Top Center Glass Expand Action on Active Card */}
                          {isCenter && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedProfile(profile);
                              }}
                              aria-label={`Expand ${profile.name} full preview`}
                              className={`absolute left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium text-white bg-black/60 hover:bg-black/75 border border-white/30 md:backdrop-blur-md rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                                profile.indexLabel === '01' ||
                                profile.indexLabel === '02' ||
                                profile.indexLabel === '03'
                                  ? 'top-5'
                                  : 'top-3'
                              }`}
                            >
                              <Maximize2 className="w-3 h-3" aria-hidden="true" />
                              <span>Expand</span>
                            </button>
                          )}
                        </div>
                      </div>
                      </DiscordProfileFrame>

                      {/* 3D Mirror Reflection Directly Underneath */}
                      <div
                        aria-hidden="true"
                        className="relative mt-2 h-[68px] w-full rounded-[20px] overflow-hidden pointer-events-none select-none border border-white/15"
                        style={{
                          transform: 'scaleY(-1)',
                          maskImage:
                            'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 48%, transparent 94%)',
                          WebkitMaskImage:
                            'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 48%, transparent 94%)',
                          opacity: isCenter ? 0.58 : 0.32,
                        }}
                      >
                        <ResilientImage
                          src={profile.posterUrl}
                          alt=""
                          className="w-full h-[320px] object-cover object-bottom sm:blur-[0.5px]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Clean Slide Index Switcher */}
              <div className="mt-2 pt-3 border-t border-white/12 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto">
                  {profiles.map((profile, idx) => {
                    const active = idx === activeIndex;
                    return (
                      <button
                        key={profile.id}
                        type="button"
                        onClick={() => onSelectProfile(idx, true)}
                        className={`px-2.5 py-1 text-xs font-mono tabular-nums rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          active
                            ? 'bg-[#E11D48] text-white font-semibold'
                            : 'text-neutral-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {profile.indexLabel}
                      </button>
                    );
                  })}
                </div>
                {isAdminMode && (
                  <span className="text-xs text-neutral-400 hidden sm:inline whitespace-nowrap shrink-0">
                    Click center card to customize text
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Bottom Music & Quick Navigation Strip */}
      <div className="relative z-10 max-w-[1440px] w-full mx-auto px-6 md:px-12 pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onToggleMusic}
            className="inline-flex items-center gap-2.5 py-1.5 text-sm font-semibold text-white hover:text-[#FB7185] transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48] rounded"
          >
            <Music className="w-4 h-4 text-[#E11D48]" aria-hidden="true" />
            <span>
              {isMusicPlaying
                ? `Playing: ${displayTrackName}`
                : `Theme Track: ${displayTrackName}`}
            </span>
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-white/8 hover:bg-white/15 text-neutral-200 transition-colors cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Volume2 className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={100}
              value={isMuted ? 0 : Math.round(volume * 100)}
              aria-label="Background music volume"
              onChange={(e) => onChangeVolume(Number(e.target.value) / 100)}
              className="w-20 h-1.5 rounded-lg accent-[#E11D48] cursor-pointer"
            />
            <span className="text-xs font-mono text-neutral-400 tabular-nums w-9">
              {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-neutral-400 font-mono">
          {isAdminMode && (
            <button
              type="button"
              onClick={() => onOpenEditor(activeProfile)}
              className="text-neutral-200 hover:text-white underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Add Text / Upload Screenshot
            </button>
          )}
          <a
            href="#roster"
            className="text-neutral-200 hover:text-white underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            View All Panel Team
          </a>
        </div>
      </div>

      {/* Fullscreen Glass Preview Lightbox */}
      {expandedProfile && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${expandedProfile.name} full profile preview`}
          onClick={() => setExpandedProfile(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-28 sm:p-8 sm:pt-36 bg-black/92 md:bg-black/85 md:backdrop-blur-md overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-md w-full my-auto"
          >
            <DiscordProfileFrame
              variant={
                expandedProfile.indexLabel === '01'
                  ? 'skull'
                  : expandedProfile.indexLabel === '02'
                    ? 'symbiote'
                    : expandedProfile.indexLabel === '03'
                      ? 'raven'
                      : undefined
              }
            >
              <div
                className={`relative rounded-[24px] shadow-2xl ${
                  expandedProfile.indexLabel === '01' ||
                  expandedProfile.indexLabel === '02' ||
                  expandedProfile.indexLabel === '03'
                    ? 'p-0'
                    : 'p-[2px] bg-gradient-to-br from-white/70 via-white/20 to-white/50'
                }`}
              >
                <div className="relative aspect-[9/14] w-full rounded-[22px] overflow-hidden bg-[#0A0A0E]">
                  <ResilientImage
                    src={expandedProfile.posterUrl}
                    alt={`${expandedProfile.name} full view`}
                    fallbackTitle={expandedProfile.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setExpandedProfile(null)}
                    aria-label="Close preview"
                    className="absolute top-3 right-3 inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/55 hover:bg-[#E11D48] text-white border border-white/25 backdrop-blur-md transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                  <div className="absolute inset-x-0 bottom-0 pt-12 pb-5 px-5 bg-gradient-to-t from-black/90 via-black/45 to-transparent">
                    <p className="font-display text-2xl font-bold text-white">
                      {expandedProfile.name}
                    </p>
                    <p className="text-xs font-mono text-neutral-300 mt-0.5">
                      {expandedProfile.discordHandle} · {expandedProfile.roleTitle}
                    </p>
                    <p className="text-sm text-neutral-200 mt-2 leading-relaxed">
                      {expandedProfile.customText}
                    </p>
                  </div>
                </div>
              </div>
            </DiscordProfileFrame>
          </div>
        </div>
      )}
    </section>
  );
}
