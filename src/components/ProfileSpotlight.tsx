import { Check, Music, Pause, PencilLine, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TeamProfile } from '../data/teamProfiles';
import { BUILT_IN_TRACKS } from '../utils/profileAudio';
import { SPACE_PLANET_THEMES, SpacePlanetCanvas } from './SpacePlanetCanvas';

interface ProfileSpotlightProps {
  profile: TeamProfile;
  allProfiles: TeamProfile[];
  onActivateProfile: (profileId: string, playMusic?: boolean) => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onSaveQuickText: (profileId: string, nextText: string, nextNote: string) => void;
  onOpenEditor: (profile: TeamProfile) => void;
  isAdminMode: boolean;
}

export function ProfileSpotlight({
  profile,
  allProfiles,
  onActivateProfile,
  isMusicPlaying,
  onToggleMusic,
  onSaveQuickText,
  onOpenEditor,
  isAdminMode,
}: ProfileSpotlightProps) {
  const [draftText, setDraftText] = useState(profile.customText);
  const [draftNote, setDraftNote] = useState(profile.panelNote);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    setDraftText(profile.customText);
    setDraftNote(profile.panelNote);
    setSavedNotice(false);
  }, [profile.id, profile.customText, profile.panelNote]);

  const activeIdx = Math.max(
    0,
    allProfiles.findIndex((item) => item.id === profile.id)
  );
  const spaceTheme =
    SPACE_PLANET_THEMES[activeIdx % SPACE_PLANET_THEMES.length] ??
    SPACE_PLANET_THEMES[0];

  const track =
    BUILT_IN_TRACKS.find((t) => t.id === profile.trackId) ?? BUILT_IN_TRACKS[0];
  const displayTrack = profile.customTrackName || `${track.label} (${track.mood})`;

  const handleQuickSave = () => {
    onSaveQuickText(
      profile.id,
      draftText.trim() || profile.customText,
      draftNote.trim()
    );
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 2200);
  };

  return (
    <section
      id="spotlight"
      aria-label="Cosmic Profile Spotlight"
      className="relative bg-[#050507] border-t border-white/10 overflow-hidden"
    >
      {/* Subtle Cosmic Ambient Edge Glow Matching Active Member Planet */}
      <div
        aria-hidden="true"
        className="absolute -left-24 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[90px] pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: spaceTheme.glowRgba }}
      />

      <div className="relative max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Editorial Vertical Column Space Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-x border-white/[0.08]">
          {/* Left Vertical Orbit Index Rail (01 — 05) */}
          <div className="lg:col-span-1 flex lg:flex-col items-center justify-between lg:justify-center gap-3 py-5 lg:py-12 px-4 border-b lg:border-b-0 lg:border-r border-white/[0.08]">
            <div className="flex lg:flex-col items-center gap-4">
              {allProfiles.map((item) => {
                const isCurrent = item.id === profile.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onActivateProfile(item.id, true)}
                    aria-label={`Switch cosmic spotlight to ${item.name}`}
                    className={`group flex items-center gap-2 font-mono text-xs tabular-nums transition-colors cursor-pointer ${
                      isCurrent
                        ? 'text-white font-semibold'
                        : 'text-neutral-500 hover:text-neutral-200'
                    }`}
                  >
                    <span
                      className={`block h-[1px] transition-all duration-300 ${
                        isCurrent ? 'w-5 bg-white' : 'w-2.5 bg-white/25 group-hover:w-4'
                      }`}
                    />
                    <span>{item.indexLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center-Left Editorial Dossier Column (Ref Design Middle Strip) */}
          <div className="lg:col-span-5 bg-white/[0.02] border-b lg:border-b-0 lg:border-r border-white/[0.08] px-6 sm:px-9 py-10 sm:py-14 flex flex-col justify-between gap-8">
            <div className="space-y-6">
              {/* Top Index & Cosmic Sector Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs tracking-widest text-neutral-400 uppercase tabular-nums">
                <span className="inline-flex items-center gap-2.5">
                  <span className="text-white">{profile.indexLabel}</span>
                  <span className="w-6 h-[1px] bg-white/30" aria-hidden="true" />
                  <span>0{allProfiles.length}</span>
                </span>
                <span style={{ color: spaceTheme.accentHex }}>
                  {spaceTheme.sectorLabel}
                </span>
              </div>

              {/* Editorial Profile Title + Animated Role Badge */}
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="relative inline-flex p-[1.5px] rounded-md overflow-hidden shadow-[0_0_14px_rgba(225,29,72,0.4)]">
                    <span aria-hidden="true" className="role-border-beam" />
                    <span className="relative z-10 inline-flex items-center px-2 py-0.5 rounded-[5px] bg-[#E11D48] text-white font-semibold text-[11px] tracking-wider uppercase">
                      {profile.badgeCode}
                    </span>
                  </span>
                  <span className="text-xs font-mono text-neutral-400 tracking-wide">
                    {profile.roleTitle}
                  </span>
                </div>

                <h2 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-white leading-[0.98]">
                  {profile.name}
                </h2>
              </div>

              {isAdminMode ? (
                <div className="space-y-3 pt-1">
                  <div>
                    <label
                      htmlFor="inline-profile-text"
                      className="block text-xs font-medium text-neutral-300 mb-1.5"
                    >
                      Hero Profile Bio / Message
                    </label>
                    <textarea
                      id="inline-profile-text"
                      rows={3}
                      value={draftText}
                      onChange={(e) => setDraftText(e.target.value)}
                      placeholder="Add custom text for this Discord panel member..."
                      className="w-full px-3.5 py-2.5 text-sm text-white bg-[#0B0B10] border border-white/15 rounded-lg placeholder:text-neutral-500 focus:outline-none focus:border-[#E11D48] resize-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="inline-profile-note"
                      className="block text-xs font-medium text-neutral-300 mb-1.5"
                    >
                      Panel Duties / Highlight Note
                    </label>
                    <input
                      id="inline-profile-note"
                      type="text"
                      value={draftNote}
                      onChange={(e) => setDraftNote(e.target.value)}
                      placeholder="Optional note about server responsibilities..."
                      className="w-full px-3.5 py-2.5 text-sm text-white bg-[#0B0B10] border border-white/15 rounded-lg placeholder:text-neutral-500 focus:outline-none focus:border-[#E11D48]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={handleQuickSave}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#E11D48] hover:bg-[#BE123C] rounded-lg transition-colors cursor-pointer"
                    >
                      {savedNotice ? (
                        <>
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Saved</span>
                        </>
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenEditor(profile)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-white/5 hover:bg-white/12 border border-white/15 rounded-lg transition-colors cursor-pointer"
                    >
                      <PencilLine className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Upload Media</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-[15px] sm:text-base text-neutral-200 leading-relaxed">
                    {profile.customText}
                  </p>
                  {profile.panelNote && (
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      {profile.panelNote}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Minimal Cosmic Audio Row */}
            <div className="pt-5 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-neutral-300 min-w-0">
                <Music className="w-3.5 h-3.5 text-[#E11D48] shrink-0" aria-hidden="true" />
                <span className="truncate font-mono">{displayTrack}</span>
              </div>
              <button
                type="button"
                onClick={onToggleMusic}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#E11D48] hover:bg-[#BE123C] rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {isMusicPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                )}
                <span>{isMusicPlaying ? 'Pause' : 'Play Theme'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live 3D Cosmic Planet Showcase (Unique World per Member) */}
          <div className="lg:col-span-6 relative min-h-[380px] sm:min-h-[440px] lg:min-h-[470px] flex flex-col justify-between overflow-hidden">
            <div className="relative flex-1 flex flex-col">
              <SpacePlanetCanvas profileIndex={activeIdx} />
            </div>
          </div>
        </div>

        {/* Bottom 3-Column Hairline Spec Strip (Matching Ref Image Bottom Bar) */}
        <dl className="grid grid-cols-1 sm:grid-cols-3 border-x border-t border-white/[0.08] divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08]">
          <div className="px-6 py-5">
            <dt className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-400">
              Discord Handle
            </dt>
            <dd className="mt-1.5 text-sm font-mono font-medium text-white">
              {profile.discordHandle}
            </dd>
          </div>
          <div className="px-6 py-5">
            <dt className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-400">
              Division · Active
            </dt>
            <dd className="mt-1.5 text-sm font-medium text-neutral-200 capitalize">
              {profile.division} · {profile.joinedYear}
            </dd>
          </div>
          <div className="px-6 py-5">
            <dt className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-400">
              Specialty
            </dt>
            <dd className="mt-1.5 text-sm font-medium text-neutral-200">
              {profile.specialty}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
