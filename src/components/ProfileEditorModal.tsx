import { Film, ImagePlus, Music, RotateCcw, Upload, X } from 'lucide-react';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { TeamProfile } from '../data/teamProfiles';
import { BUILT_IN_TRACKS, BuiltInTrackId } from '../utils/profileAudio';
import { ResilientImage } from './ResilientImage';

interface ProfileEditorModalProps {
  profile: TeamProfile | null;
  onClose: () => void;
  onSaveProfile: (updated: TeamProfile) => void;
  onResetProfile: (profileId: string) => void;
}

export function ProfileEditorModal({
  profile,
  onClose,
  onSaveProfile,
  onResetProfile,
}: ProfileEditorModalProps) {
  const [name, setName] = useState('');
  const [discordHandle, setDiscordHandle] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [badgeCode, setBadgeCode] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [customText, setCustomText] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [backdropUrl, setBackdropUrl] = useState('');
  const [trackId, setTrackId] = useState<BuiltInTrackId>('abyss-synth');
  const [customTrackName, setCustomTrackName] = useState<string | undefined>(
    undefined
  );
  const [customAudioUrl, setCustomAudioUrl] = useState<string | undefined>(
    undefined
  );
  const [backdropVideoUrl, setBackdropVideoUrl] = useState<string | undefined>(
    undefined
  );
  const [customVideoName, setCustomVideoName] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    setDiscordHandle(profile.discordHandle);
    setRoleTitle(profile.roleTitle);
    setBadgeCode(profile.badgeCode);
    setSpecialty(profile.specialty);
    setCustomText(profile.customText);
    setPosterUrl(profile.posterUrl);
    setBackdropUrl(profile.backdropUrl);
    setTrackId(profile.trackId);
    setCustomTrackName(profile.customTrackName);
    setCustomAudioUrl(profile.customAudioUrl);
    setBackdropVideoUrl(profile.backdropVideoUrl);
    setCustomVideoName(undefined);
  }, [profile]);

  useEffect(() => {
    if (!profile) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [profile, onClose]);

  if (!profile) return null;

  const handleImageUpload = (
    e: ChangeEvent<HTMLInputElement>,
    target: 'poster' | 'backdrop'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (target === 'poster') {
          setPosterUrl(reader.result);
        } else {
          setBackdropUrl(reader.result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAudioUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCustomAudioUrl(url);
    setCustomTrackName(file.name.replace(/\.[^/.]+$/, ''));
  };

  const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBackdropVideoUrl(url);
    setCustomVideoName(file.name);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...profile,
      name: name.trim() || profile.name,
      discordHandle: discordHandle.trim() || profile.discordHandle,
      roleTitle: roleTitle.trim() || profile.roleTitle,
      badgeCode: (badgeCode.trim() || profile.badgeCode).toUpperCase(),
      specialty: specialty.trim() || profile.specialty,
      customText: customText.trim() || profile.customText,
      posterUrl,
      backdropUrl,
      backdropVideoUrl,
      trackId,
      customTrackName,
      customAudioUrl,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Customize ${profile.name} profile`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-[#0D0D12] border border-white/15 rounded-2xl overflow-hidden shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-white/10">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">
              Customize Profile &amp; Music
            </h2>
            <p className="text-xs text-neutral-400">
              Add custom text, upload a Discord profile screenshot, and choose theme audio.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close editor"
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-[#E11D48] text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Poster Preview + Upload */}
            <div className="md:col-span-4 space-y-3">
              <div className="aspect-[3/4] rounded-xl overflow-hidden border border-white/15 bg-neutral-900">
                <ResilientImage
                  src={posterUrl}
                  alt={name}
                  fallbackTitle={name}
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/18 border border-white/15 rounded-lg cursor-pointer transition-colors">
                <ImagePlus className="w-4 h-4" aria-hidden="true" />
                <span>Upload Discord Screenshot</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'poster')}
                  className="hidden"
                />
              </label>
              <label className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Optional Backdrop Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'backdrop')}
                  className="hidden"
                />
              </label>
              <div className="flex items-center gap-1.5">
                <label className="flex-1 min-w-0 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg cursor-pointer transition-colors">
                  <Film className="w-3.5 h-3.5 shrink-0 text-[#E11D48]" aria-hidden="true" />
                  <span className="truncate">
                    {customVideoName
                      ? customVideoName
                      : backdropVideoUrl
                        ? 'Change BG Video'
                        : 'Upload BG Video'}
                  </span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                </label>
                {backdropVideoUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setBackdropVideoUrl(undefined);
                      setCustomVideoName(undefined);
                    }}
                    title="Remove background video"
                    aria-label="Remove background video"
                    className="inline-flex items-center justify-center w-8 h-8 shrink-0 rounded-lg bg-white/5 hover:bg-[#E11D48]/20 text-neutral-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            {/* Profile Fields & Audio */}
            <div className="md:col-span-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Member Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-sm text-white bg-[#070709] border border-white/15 rounded-lg focus:outline-none focus:border-[#E11D48]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Discord Handle
                  </label>
                  <input
                    type="text"
                    value={discordHandle}
                    onChange={(e) => setDiscordHandle(e.target.value)}
                    className="w-full px-3 py-2 text-sm text-white bg-[#070709] border border-white/15 rounded-lg focus:outline-none focus:border-[#E11D48]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Panel Role Title
                  </label>
                  <input
                    type="text"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm text-white bg-[#070709] border border-white/15 rounded-lg focus:outline-none focus:border-[#E11D48]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Role Tag
                  </label>
                  <input
                    type="text"
                    maxLength={8}
                    value={badgeCode}
                    onChange={(e) => setBadgeCode(e.target.value)}
                    className="w-full px-3 py-2 text-sm text-white bg-[#070709] border border-white/15 rounded-lg focus:outline-none focus:border-[#E11D48]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Custom Profile Text
                </label>
                <textarea
                  rows={3}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-white bg-[#070709] border border-white/15 rounded-lg focus:outline-none focus:border-[#E11D48] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Specialty / Tags
                </label>
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-white bg-[#070709] border border-white/15 rounded-lg focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              {/* Music Selection */}
              <div className="pt-2 border-t border-white/10 space-y-2.5">
                <label className="flex items-center gap-2 text-xs font-medium text-neutral-200">
                  <Music className="w-4 h-4 text-[#E11D48]" aria-hidden="true" />
                  <span>Profile Theme Music</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <select
                    value={trackId}
                    onChange={(e) => {
                      setTrackId(e.target.value as BuiltInTrackId);
                      setCustomAudioUrl(undefined);
                      setCustomTrackName(undefined);
                    }}
                    className="px-3 py-2 text-xs text-white bg-[#070709] border border-white/15 rounded-lg focus:outline-none focus:border-[#E11D48]"
                  >
                    {BUILT_IN_TRACKS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label} — {t.mood}
                      </option>
                    ))}
                  </select>

                  <label className="inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white bg-white/8 hover:bg-white/15 border border-white/15 rounded-lg cursor-pointer transition-colors truncate">
                    <Upload className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span className="truncate">
                      {customTrackName ? customTrackName : 'Upload MP3 / WAV'}
                    </span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                onResetProfile(profile.id);
                onClose();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white border border-white/15 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset Default</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-neutral-300 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-semibold text-white bg-[#E11D48] hover:bg-[#BE123C] rounded-lg transition-colors cursor-pointer"
              >
                Save Profile
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
