import { Check, Music, Pause, PencilLine, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TeamProfile } from '../data/teamProfiles';
import { BUILT_IN_TRACKS } from '../utils/profileAudio';
import { ResilientImage } from './ResilientImage';

interface ProfileSpotlightProps {
  profile: TeamProfile;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onSaveQuickText: (profileId: string, nextText: string, nextNote: string) => void;
  onOpenEditor: (profile: TeamProfile) => void;
  isAdminMode: boolean;
}

export function ProfileSpotlight({
  profile,
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

  const track =
    BUILT_IN_TRACKS.find((t) => t.id === profile.trackId) ?? BUILT_IN_TRACKS[0];
  const displayTrack = profile.customTrackName || `${track.label} (${track.mood})`;

  const handleQuickSave = () => {
    onSaveQuickText(profile.id, draftText.trim() || profile.customText, draftNote.trim());
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 2200);
  };

  return (
    <section
      id="spotlight"
      aria-label="Member Profile Spotlight"
      className="py-20 md:py-24 bg-[#0B0B0F] border-t border-white/8"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left: Widescreen Backdrop + Audio Controls */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="relative flex-1 min-h-[300px] sm:min-h-[400px] rounded-2xl overflow-hidden border border-white/10 bg-neutral-900">
              <ResilientImage
                src={profile.backdropUrl}
                alt={`${profile.name} banner`}
                fallbackTitle={profile.name}
                className="w-full h-full lg:h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F]/92 via-[#0B0B0F]/25 to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-mono text-neutral-300 uppercase tracking-wider">
                    Active Profile Spotlight · {profile.indexLabel}
                  </p>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-white">
                    {profile.name}
                  </p>
                  <p className="text-xs text-neutral-300 mt-1 flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-[#E11D48]" aria-hidden="true" />
                    <span>{displayTrack}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onToggleMusic}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#E11D48] hover:bg-[#BE123C] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {isMusicPlaying ? (
                      <Pause className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                    )}
                    <span>{isMusicPlaying ? 'Pause' : 'Play Theme'}</span>
                  </button>
                  {isAdminMode && (
                    <button
                      type="button"
                      onClick={() => onOpenEditor(profile)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-black/60 hover:bg-white/15 border border-white/20 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <PencilLine className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Upload Screenshot / Audio</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Clean Member Story for Viewers, OR Inline Editor when Owner Mode is Unlocked */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-6">
            {isAdminMode ? (
              <div className="space-y-4">
                <p className="text-xs font-mono tracking-wider text-neutral-400 uppercase">
                  Customize Profile Text · {profile.discordHandle}
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  {profile.roleTitle}
                </h2>

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
                      className="w-full px-3.5 py-2.5 text-sm text-white bg-[#111115] border border-white/15 rounded-lg placeholder:text-neutral-500 focus:outline-none focus:border-[#E11D48] resize-none"
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
                      className="w-full px-3.5 py-2.5 text-sm text-white bg-[#111115] border border-white/15 rounded-lg placeholder:text-neutral-500 focus:outline-none focus:border-[#E11D48]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleQuickSave}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#E11D48] hover:bg-[#BE123C] rounded-lg transition-colors cursor-pointer"
                    >
                      {savedNotice ? (
                        <>
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Saved to Profile</span>
                        </>
                      ) : (
                        <span>Save Text Changes</span>
                      )}
                    </button>
                    <span className="text-xs text-neutral-400">
                      Only visible while Owner Mode is unlocked.
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs font-mono tracking-wider text-neutral-400 uppercase">
                  Member Dossier · {profile.discordHandle}
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  {profile.roleTitle}
                </h2>
                <p className="text-base text-neutral-200 leading-relaxed">
                  {profile.customText}
                </p>
                {profile.panelNote && (
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    {profile.panelNote}
                  </p>
                )}
              </div>
            )}

            {/* Clean Hairline Discord Info Table */}
            <dl className="divide-y divide-white/10 border-t border-b border-white/10 text-sm">
              <div className="py-3 flex items-center justify-between gap-4">
                <dt className="text-neutral-400">Discord Handle</dt>
                <dd className="font-mono text-white text-right">
                  {profile.discordHandle}
                </dd>
              </div>
              <div className="py-3 flex items-center justify-between gap-4">
                <dt className="text-neutral-400">Division</dt>
                <dd className="font-medium text-white capitalize text-right">
                  {profile.division}
                </dd>
              </div>
              <div className="py-3 flex items-center justify-between gap-4">
                <dt className="text-neutral-400">Specialty</dt>
                <dd className="font-medium text-neutral-200 text-right">
                  {profile.specialty}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
