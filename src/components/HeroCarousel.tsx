import {
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Music,
  Pause,
  PencilLine,
  Play,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { TeamProfile } from '../data/teamProfiles';
import { BUILT_IN_TRACKS } from '../utils/profileAudio';
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
  const activeProfile = profiles[activeIndex] ?? profiles[0];
  const isStarred = starredIds.includes(activeProfile.id);
  const total = profiles.length;

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
          return (
            <div
              key={profile.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                isCurrent ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <ResilientImage
                src={profile.backdropUrl}
                alt={`${profile.name} backdrop`}
                className={`w-full h-full object-cover object-center ${
                  isCurrent ? 'animate-cinema-backdrop' : ''
                }`}
              />
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

            {/* Action Buttons: Play Music, Edit Text/Screenshot, Favorite */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onToggleMusic}
                className="inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold text-white bg-[#E11D48] hover:bg-[#BE123C] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {isMusicPlaying ? (
                  <Pause className="w-4 h-4 fill-current" aria-hidden="true" />
                ) : (
                  <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                )}
                <span>
                  {isMusicPlaying ? 'Pause Music' : 'Play Theme Music'}
                </span>
              </button>

              {isAdminMode && (
                <button
                  type="button"
                  onClick={() => onOpenEditor(activeProfile)}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-black/50 hover:bg-white/15 border border-white/25 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <PencilLine className="w-4 h-4" aria-hidden="true" />
                  <span>Edit Text &amp; Media</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onToggleStar(activeProfile.id)}
                aria-label={
                  isStarred ? 'Remove from favorites' : 'Save to favorites'
                }
                className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg border transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  isStarred
                    ? 'bg-white text-neutral-950 border-white hover:bg-neutral-200'
                    : 'bg-black/45 text-white border-white/20 hover:bg-white/15'
                }`}
              >
                {isStarred ? (
                  <Check className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Bookmark className="w-4 h-4" aria-hidden="true" />
                )}
                <span>{isStarred ? 'Saved' : 'Favorite'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Tall 3D Glass-Outline Mirror Profile Slider */}
          <div className="lg:col-span-7">
            <div className="relative bg-white/[0.03] backdrop-blur-md border border-white/15 rounded-3xl p-4 sm:p-6 shadow-[0_24px_64px_rgba(0,0,0,0.65)] overflow-hidden">
              <div className="flex items-center justify-end mb-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous team profile"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-[#E11D48] text-white border border-white/20 backdrop-blur-md transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next team profile"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-[#E11D48] text-white border border-white/20 backdrop-blur-md transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <ChevronRight className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* 3D Mirror Coverflow Stage (Taller & Luminous Glass Outline) */}
              <div
                className="relative h-[440px] sm:h-[520px] flex items-start justify-center pt-2 overflow-hidden"
                style={{ perspective: '1400px' }}
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
                  const isCenter = offset === 0;

                  const translateX = offset * 138;
                  const translateZ = -absOffset * 90;
                  const rotateY = offset * -16;
                  const scale = isCenter ? 1 : absOffset === 1 ? 0.86 : 0.72;
                  const opacity = isCenter ? 1 : absOffset === 1 ? 0.85 : 0.48;
                  const zIndex = 30 - absOffset * 10;

                  return (
                    <div
                      key={profile.id}
                      style={{
                        transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                        opacity,
                        zIndex,
                        transformStyle: 'preserve-3d',
                      }}
                      className="group absolute w-[212px] sm:w-[252px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    >
                      {/* Frosted Glass Outline & Specular Rim Frame */}
                      <div
                        className={`relative p-[2px] rounded-[22px] transition-all duration-300 ${
                          isCenter
                            ? 'bg-gradient-to-br from-white/75 via-white/20 to-white/55 shadow-[0_28px_65px_rgba(0,0,0,0.9)]'
                            : 'bg-gradient-to-br from-white/40 via-white/10 to-white/30 shadow-[0_18px_40px_rgba(0,0,0,0.75)] hover:from-white/55 hover:to-white/40'
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

                            {/* Soft Glass Vignette & Bottom Frosted Glass Info Dock */}
                            <div
                              className={`absolute inset-x-0 bottom-0 pt-14 pb-4 px-4 bg-gradient-to-t from-black/92 via-black/68 to-transparent backdrop-blur-[4px] border-t border-white/10 transition-opacity duration-300 ${
                                isCenter ? 'opacity-100' : 'opacity-90'
                              }`}
                            >
                              <div className="flex items-baseline justify-between gap-2 mb-1">
                                <p className="font-display text-lg sm:text-xl font-semibold tracking-wide text-white truncate">
                                  {profile.name}
                                </p>
                                <span className="text-[11px] font-mono text-white/75 tabular-nums shrink-0">
                                  {Number(profile.indexLabel)} / {total}
                                </span>
                              </div>
                              <p className="text-xs text-neutral-200 line-clamp-2 leading-relaxed">
                                {isCenter ? profile.customText : profile.roleTitle}
                              </p>
                              {isCenter && (
                                <p className="text-[11px] font-mono text-neutral-300/90 mt-1.5 truncate">
                                  {profile.discordHandle} · {profile.roleTitle}
                                </p>
                              )}
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
                              className="absolute top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium text-white bg-black/35 hover:bg-black/60 border border-white/30 backdrop-blur-md rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                            >
                              <Maximize2 className="w-3 h-3" aria-hidden="true" />
                              <span>Expand</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* 3D Mirror Reflection Directly Underneath */}
                      <div
                        aria-hidden="true"
                        className="relative mt-2 h-[82px] w-full rounded-[20px] overflow-hidden pointer-events-none select-none border border-white/15"
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
                          className="w-full h-[320px] object-cover object-bottom blur-[0.5px]"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-md w-full p-[2px] rounded-[24px] bg-gradient-to-br from-white/70 via-white/20 to-white/50 shadow-2xl"
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
              <div className="absolute inset-x-0 bottom-0 pt-16 pb-5 px-5 bg-gradient-to-t from-black/95 via-black/70 to-transparent backdrop-blur-[4px] border-t border-white/15">
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
        </div>
      )}
    </section>
  );
}
