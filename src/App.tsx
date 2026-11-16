import { useEffect, useMemo, useState } from 'react';
import { AdminPasscodeModal } from './components/AdminPasscodeModal';
import { HeroCarousel } from './components/HeroCarousel';
import { Navbar, NavSection } from './components/Navbar';
import { ProfileEditorModal } from './components/ProfileEditorModal';
import { ProfileSpotlight } from './components/ProfileSpotlight';
import { ServerFooterSection } from './components/ServerFooterSection';
import { TeamRosterSection } from './components/TeamRosterSection';
import { DEFAULT_TEAM_PROFILES, TeamProfile } from './data/teamProfiles';
import { profileAudio } from './utils/profileAudio';

const PROFILES_STORAGE_KEY = 'discord_panel_profiles_v1';
const STARRED_STORAGE_KEY = 'discord_panel_starred_v1';
const ADMIN_SESSION_KEY = 'discord_panel_owner_unlocked';

export default function App() {
  const [profiles, setProfiles] = useState<TeamProfile[]>(() => {
    try {
      const saved = window.localStorage.getItem(PROFILES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((savedProfile: TeamProfile) => {
            const defaultProfile = DEFAULT_TEAM_PROFILES.find(
              (d) => d.id === savedProfile.id
            );
            if (
              defaultProfile &&
              !savedProfile.customAudioUrl &&
              defaultProfile.customAudioUrl
            ) {
              return {
                ...savedProfile,
                customAudioUrl: defaultProfile.customAudioUrl,
                customTrackName: defaultProfile.customTrackName,
              };
            }
            return savedProfile;
          });
        }
      }
    } catch {
      // Ignore storage read errors
    }
    return DEFAULT_TEAM_PROFILES;
  });

  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    try {
      return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<NavSection>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProfile, setEditingProfile] = useState<TeamProfile | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);

  const [starredIds, setStarredIds] = useState<string[]>(() => {
    try {
      const saved = window.localStorage.getItem(STARRED_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage read errors
    }
    return ['kaisar-founder', 'rafi-commander'];
  });

  useEffect(() => {
    try {
      const serializable = profiles.map((p) => ({
        ...p,
        customAudioUrl: p.customAudioUrl?.startsWith('blob:')
          ? undefined
          : p.customAudioUrl,
      }));
      window.localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(serializable));
    } catch {
      // Ignore storage quota errors
    }
  }, [profiles]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STARRED_STORAGE_KEY, JSON.stringify(starredIds));
    } catch {
      // Ignore storage write errors
    }
  }, [starredIds]);

  useEffect(() => {
    profileAudio.setVolume(0.7);
    const firstProfile = profiles[0];
    if (firstProfile) {
      profileAudio.play(firstProfile.trackId, firstProfile.customAudioUrl);
    }

    const handleFirstGesture = () => {
      profileAudio.unlockFromGesture();
    };

    window.addEventListener('pointerdown', handleFirstGesture, { passive: true });
    window.addEventListener('keydown', handleFirstGesture, { passive: true });
    window.addEventListener('touchstart', handleFirstGesture, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      profileAudio.stop();
    };
  }, []);

  const activeProfile = profiles[activeIndex] ?? profiles[0];

  useEffect(() => {
    if (isMusicPlaying && activeProfile) {
      profileAudio.play(activeProfile.trackId, activeProfile.customAudioUrl);
    }
  }, [
    isMusicPlaying,
    activeProfile?.id,
    activeProfile?.trackId,
    activeProfile?.customAudioUrl,
  ]);

  const handleToggleMusic = () => {
    if (isMusicPlaying) {
      profileAudio.stop();
      setIsMusicPlaying(false);
    } else {
      profileAudio.play(activeProfile.trackId, activeProfile.customAudioUrl);
      setIsMusicPlaying(true);
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    profileAudio.setMuted(nextMuted);
  };

  const handleChangeVolume = (nextVolume: number) => {
    const clamped = Math.max(0, Math.min(1, nextVolume));
    setVolume(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
      profileAudio.setMuted(false);
    }
    profileAudio.setVolume(clamped);
  };

  const handleSelectProfile = (index: number, autoPlayMusic = false) => {
    setActiveIndex(index);
    if (autoPlayMusic) {
      const target = profiles[index];
      if (target) {
        setIsMusicPlaying(true);
        profileAudio.play(target.trackId, target.customAudioUrl);
      }
    }
  };

  const handleActivateById = (profileId: string, playMusic = false) => {
    const idx = profiles.findIndex((p) => p.id === profileId);
    if (idx !== -1) {
      handleSelectProfile(idx, playMusic);
    }
  };

  const handleToggleStar = (profileId: string) => {
    setStarredIds((prev) =>
      prev.includes(profileId)
        ? prev.filter((id) => id !== profileId)
        : [...prev, profileId]
    );
  };

  const handleSaveProfile = (updated: TeamProfile) => {
    if (!isAdminMode) return;
    setProfiles((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const handleSaveQuickText = (
    profileId: string,
    nextText: string,
    nextNote: string
  ) => {
    if (!isAdminMode) return;
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === profileId
          ? { ...p, customText: nextText, panelNote: nextNote }
          : p
      )
    );
  };

  const handleResetProfile = (profileId: string) => {
    if (!isAdminMode) return;
    const original = DEFAULT_TEAM_PROFILES.find((p) => p.id === profileId);
    if (!original) return;
    setProfiles((prev) =>
      prev.map((p) => (p.id === profileId ? original : p))
    );
  };

  const handleUnlockAdmin = () => {
    setIsAdminMode(true);
    try {
      window.sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    } catch {
      // Ignore sessionStorage errors
    }
  };

  const handleLockAdmin = () => {
    setIsAdminMode(false);
    setEditingProfile(null);
    try {
      window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {
      // Ignore sessionStorage errors
    }
  };

  const handleExportConfig = () => {
    const dataStr = JSON.stringify(profiles, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'teamProfiles.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Keyboard shortcuts: Left/Right arrows for slider, Ctrl+Shift+E for Owner Access
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        if (isAdminMode) {
          handleLockAdmin();
        } else {
          setAdminModalOpen(true);
        }
        return;
      }

      if (editingProfile || adminModalOpen) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT')
      ) {
        return;
      }
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev + 1) % profiles.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev - 1 + profiles.length) % profiles.length);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [editingProfile, adminModalOpen, isAdminMode, profiles.length]);

  const filteredProfiles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return profiles.filter((profile) => {
      const matchesFilter =
        activeFilter === 'home'
          ? true
          : activeFilter === 'starred'
            ? starredIds.includes(profile.id)
            : profile.division === activeFilter;

      if (!matchesFilter) return false;
      if (!q) return true;

      return (
        profile.name.toLowerCase().includes(q) ||
        profile.discordHandle.toLowerCase().includes(q) ||
        profile.roleTitle.toLowerCase().includes(q) ||
        profile.customText.toLowerCase().includes(q) ||
        profile.specialty.toLowerCase().includes(q)
      );
    });
  }, [profiles, activeFilter, searchQuery, starredIds]);

  return (
    <div className="min-h-screen bg-[#070709] text-neutral-100">
      <Navbar
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main>
        <HeroCarousel
          profiles={profiles}
          activeIndex={activeIndex}
          onSelectProfile={handleSelectProfile}
          onOpenEditor={(profile) => {
            if (isAdminMode) setEditingProfile(profile);
          }}
          starredIds={starredIds}
          onToggleStar={handleToggleStar}
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={handleToggleMusic}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          volume={volume}
          onChangeVolume={handleChangeVolume}
          isAdminMode={isAdminMode}
        />

        <TeamRosterSection
          profiles={filteredProfiles}
          allProfiles={profiles}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          activeProfileId={activeProfile.id}
          onActivateProfile={handleActivateById}
          onOpenEditor={(profile) => {
            if (isAdminMode) setEditingProfile(profile);
          }}
          starredIds={starredIds}
          onToggleStar={handleToggleStar}
          isAdminMode={isAdminMode}
        />

        <ProfileSpotlight
          profile={activeProfile}
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={handleToggleMusic}
          onSaveQuickText={handleSaveQuickText}
          onOpenEditor={(profile) => {
            if (isAdminMode) setEditingProfile(profile);
          }}
          isAdminMode={isAdminMode}
        />

        <ServerFooterSection
          onSelectFilter={setActiveFilter}
          isAdminMode={isAdminMode}
          onOpenAdminLogin={() => setAdminModalOpen(true)}
          onLockAdmin={handleLockAdmin}
          onExportConfig={handleExportConfig}
        />
      </main>

      {isAdminMode && (
        <ProfileEditorModal
          profile={editingProfile}
          onClose={() => setEditingProfile(null)}
          onSaveProfile={handleSaveProfile}
          onResetProfile={handleResetProfile}
        />
      )}

      <AdminPasscodeModal
        open={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onUnlock={handleUnlockAdmin}
      />
    </div>
  );
}
