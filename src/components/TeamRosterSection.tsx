import { Bookmark, Check, Music, PencilLine, Play, Users } from 'lucide-react';
import { TeamProfile } from '../data/teamProfiles';
import { NavSection } from './Navbar';
import { ResilientImage } from './ResilientImage';

interface TeamRosterSectionProps {
  profiles: TeamProfile[];
  allProfiles: TeamProfile[];
  activeFilter: NavSection;
  onSelectFilter: (section: NavSection) => void;
  searchQuery: string;
  onClearSearch: () => void;
  activeProfileId: string;
  onActivateProfile: (profileId: string, playMusic?: boolean) => void;
  onOpenEditor: (profile: TeamProfile) => void;
  starredIds: string[];
  onToggleStar: (profileId: string) => void;
  isAdminMode: boolean;
}

const FILTER_TABS: { id: NavSection; label: string }[] = [
  { id: 'home', label: 'All Panel' },
  { id: 'founders', label: 'Founders' },
  { id: 'admins', label: 'Admins' },
  { id: 'moderators', label: 'Moderators' },
  { id: 'starred', label: 'Favorites' },
];

export function TeamRosterSection({
  profiles,
  allProfiles,
  activeFilter,
  onSelectFilter,
  searchQuery,
  onClearSearch,
  activeProfileId,
  onActivateProfile,
  onOpenEditor,
  starredIds,
  onToggleStar,
  isAdminMode,
}: TeamRosterSectionProps) {
  return (
    <section
      id="roster"
      className="py-20 md:py-24 bg-[#070709] border-t border-white/8"
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Section Header + Segmented Division Filter */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-mono tracking-wider text-neutral-400 uppercase mb-2">
              Discord Server Staff
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Panel Team Profiles
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Filter panel team by division"
            className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#111115] border border-white/10 rounded-xl w-fit"
          >
            {FILTER_TABS.map((tab) => {
              const isSelected = activeFilter === tab.id;
              const count =
                tab.id === 'home'
                  ? allProfiles.length
                  : tab.id === 'starred'
                    ? starredIds.length
                    : allProfiles.filter((p) => p.division === tab.id).length;

              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isSelected}
                  type="button"
                  data-no-music-unlock={tab.id !== 'home' ? 'true' : undefined}
                  onClick={() => onSelectFilter(tab.id)}
                  className={`relative p-[1.5px] overflow-hidden rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48] ${
                    isSelected
                      ? 'shadow-[0_0_16px_rgba(225,29,72,0.45)]'
                      : 'hover:bg-white/5'
                  }`}
                >
                  {isSelected && (
                    <span aria-hidden="true" className="role-border-beam" />
                  )}
                  <span
                    className={`relative z-10 inline-flex items-center px-3.5 py-2 text-xs sm:text-sm font-medium rounded-[6.5px] ${
                      isSelected
                        ? 'bg-[#E11D48] text-white'
                        : 'text-neutral-300 hover:text-white'
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
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Notice */}
        {searchQuery.trim() && (
          <div className="mb-8 flex items-center justify-between gap-4 px-4 py-3 bg-[#111115] border border-white/10 rounded-xl">
            <p className="text-sm text-neutral-300">
              Showing members matching{' '}
              <span className="font-semibold text-white">"{searchQuery}"</span>{' '}
              <span className="text-neutral-500 font-mono tabular-nums">
                ({profiles.length})
              </span>
            </p>
            <button
              type="button"
              onClick={onClearSearch}
              className="text-xs font-medium text-neutral-300 hover:text-white underline underline-offset-4 cursor-pointer whitespace-nowrap shrink-0"
            >
              Reset search
            </button>
          </div>
        )}

        {/* Empty State */}
        {profiles.length === 0 ? (
          <div className="py-16 px-6 text-center bg-[#111115] border border-white/10 rounded-2xl">
            <Users
              className="w-8 h-8 text-neutral-500 mx-auto mb-3"
              aria-hidden="true"
            />
            <h3 className="font-display text-2xl font-semibold text-white mb-2">
              {activeFilter === 'starred'
                ? 'No favorite profiles yet'
                : 'No panel members found'}
            </h3>
            <p className="text-sm text-neutral-400 max-w-md mx-auto mb-6">
              {activeFilter === 'starred'
                ? 'Star your top panel leads from the 3D showcase or directory to pin them here.'
                : 'Try clearing your search or selecting All Panel.'}
            </p>
            <button
              type="button"
              onClick={() => {
                onSelectFilter('home');
                onClearSearch();
              }}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#E11D48] hover:bg-[#BE123C] rounded-lg transition-colors cursor-pointer"
            >
              Show All Panel
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {profiles.map((profile) => {
              const isHeroActive = profile.id === activeProfileId;
              const isStarred = starredIds.includes(profile.id);

              return (
                <article
                  key={profile.id}
                  className={`group flex flex-col bg-[#111115] rounded-xl overflow-hidden border transition-colors duration-200 ${
                    isHeroActive
                      ? 'border-[#E11D48]/80'
                      : 'border-white/10 hover:border-white/25'
                  }`}
                >
                  {/* Tall 9:14 Profile Poster / Screenshot with Frosted Glass Rim */}
                  <div className="relative aspect-[9/14] overflow-hidden bg-neutral-900 ring-1 ring-inset ring-white/20">
                    <button
                      type="button"
                      onClick={() => {
                        onActivateProfile(profile.id, true);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      aria-label={`Select ${profile.name} and play theme music`}
                      className="block w-full h-full cursor-pointer text-left"
                    >
                      <ResilientImage
                        src={profile.posterUrl}
                        alt={`${profile.name} profile poster`}
                        fallbackTitle={profile.name}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    </button>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111115] via-transparent to-black/20 opacity-85 pointer-events-none" />

                    {/* Top Right Favorite Toggle */}
                    <button
                      type="button"
                      onClick={() => onToggleStar(profile.id)}
                      aria-label={
                        isStarred
                          ? `Remove ${profile.name} from favorites`
                          : `Save ${profile.name} to favorites`
                      }
                      className={`absolute top-3 right-3 w-9 h-9 rounded-lg flex items-center justify-center border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                        isStarred
                          ? 'bg-[#E11D48] text-white border-[#E11D48]'
                          : 'bg-black/60 text-white border-white/20 hover:bg-black/85'
                      }`}
                    >
                      {isStarred ? (
                        <Check className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <Bookmark className="w-4 h-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex flex-col flex-1 justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl font-semibold tracking-tight text-white leading-snug mb-1">
                        {profile.name}
                      </h3>
                      <div className="text-xs text-neutral-400 tabular-nums flex flex-wrap items-center gap-x-1.5">
                        <span>{profile.discordHandle}</span>
                        <span aria-hidden="true">·</span>
                        <span>{profile.roleTitle}</span>
                      </div>
                      <p className="text-xs text-neutral-300 mt-2 line-clamp-2 leading-relaxed">
                        {profile.customText}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/8">
                      <button
                        type="button"
                        onClick={() => {
                          onActivateProfile(profile.id, true);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#E11D48] hover:bg-[#BE123C] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                      >
                        {isHeroActive ? (
                          <Music className="w-3.5 h-3.5" aria-hidden="true" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                        )}
                        <span>{isHeroActive ? 'Active' : 'Select & Play'}</span>
                      </button>
                      {isAdminMode && (
                        <button
                          type="button"
                          onClick={() => onOpenEditor(profile)}
                          className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-neutral-200 hover:text-white bg-white/6 hover:bg-white/12 border border-white/10 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                        >
                          <PencilLine className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Edit Text</span>
                        </button>
                      )}
                    </div>
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
