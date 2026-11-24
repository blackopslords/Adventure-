import { Menu, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export type NavSection =
  | 'home'
  | 'founders'
  | 'admins'
  | 'moderators'
  | 'starred'
  | 'extensions';

interface NavbarProps {
  activeFilter: NavSection;
  onSelectFilter: (section: NavSection) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const NAV_ITEMS: { id: NavSection; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'founders', label: 'Founders' },
  { id: 'admins', label: 'Admins' },
  { id: 'moderators', label: 'Moderators' },
  { id: 'extensions', label: 'Download Extensions' },
];

export function Navbar({
  activeFilter,
  onSelectFilter,
  searchQuery,
  onSearchChange,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  const handleNavClick = (section: NavSection) => {
    const wasOnExtensions = activeFilter === 'extensions';
    onSelectFilter(section);
    setMobileMenuOpen(false);
    if (section === 'home' || section === 'extensions') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (wasOnExtensions) {
      window.setTimeout(() => {
        document.getElementById('roster')?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      const target = document.getElementById('roster');
      target?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isExtensionsTab = activeFilter === 'extensions';

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-colors duration-200 ${
        isExtensionsTab
          ? 'ext-glass-nav md:backdrop-blur-xl'
          : scrolled || mobileMenuOpen
            ? 'bg-[#070709]/95 md:bg-[#070709]/92 md:backdrop-blur-md border-b border-white/10'
            : 'bg-gradient-to-b from-[#070709]/85 to-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-16 md:h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
          className={`font-display text-2xl md:text-3xl font-bold tracking-tight whitespace-nowrap shrink-0 focus-visible:outline-none rounded ${
            isExtensionsTab
              ? 'text-[#16143E] focus-visible:ring-2 focus-visible:ring-[#5D5AF0]'
              : 'text-white focus-visible:ring-2 focus-visible:ring-[#E11D48]'
          }`}
        >
          PanelHub
        </a>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeFilter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                data-no-music-unlock={item.id !== 'home' ? 'true' : undefined}
                onClick={() => handleNavClick(item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none rounded cursor-pointer ${
                  isExtensionsTab
                    ? isActive
                      ? 'text-[#16143E] font-semibold focus-visible:ring-2 focus-visible:ring-[#5D5AF0]'
                      : 'text-[#3B3875] hover:text-[#16143E] focus-visible:ring-2 focus-visible:ring-[#5D5AF0]'
                    : isActive
                      ? 'text-white focus-visible:ring-2 focus-visible:ring-[#E11D48]'
                      : 'text-neutral-300 hover:text-white focus-visible:ring-2 focus-visible:ring-[#E11D48]'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 -bottom-0.5 h-0.5 transition-transform duration-200 origin-left ${
                    isExtensionsTab ? 'bg-[#5D5AF0]' : 'bg-[#E11D48]'
                  } ${isActive ? 'scale-x-100' : 'scale-x-0'}`}
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action (Search toggle / mobile drawer trigger) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setSearchOpen((prev) => !prev)}
            aria-expanded={searchOpen}
            aria-label={searchOpen ? 'Close search' : 'Search panel members'}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none ${
              isExtensionsTab
                ? 'text-[#16143E] bg-white/65 hover:bg-white/85 border border-white/85 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] focus-visible:ring-2 focus-visible:ring-[#5D5AF0]'
                : 'text-white bg-white/10 hover:bg-white/18 border border-white/15 focus-visible:ring-2 focus-visible:ring-[#E11D48]'
            }`}
          >
            {searchOpen ? (
              <X className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Search className="w-4 h-4" aria-hidden="true" />
            )}
            <span>{searchOpen ? 'Close' : 'Search'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className={`md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl cursor-pointer focus-visible:outline-none ${
              isExtensionsTab
                ? 'text-[#16143E] bg-white/65 border border-white/85 focus-visible:ring-2 focus-visible:ring-[#5D5AF0]'
                : 'text-white bg-white/10 border border-white/15 focus-visible:ring-2 focus-visible:ring-[#E11D48]'
            }`}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Search Bar */}
      {searchOpen && (
        <div
          className={
            isExtensionsTab
              ? 'border-t border-white/75 bg-[#E6E5FF]/92 backdrop-blur-md'
              : 'border-t border-white/10 bg-[#0A0A0D]/95 backdrop-blur-md'
          }
        >
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-4 flex items-center gap-4">
            <Search
              className={`w-4 h-4 shrink-0 ${
                isExtensionsTab ? 'text-[#5D5AF0]' : 'text-neutral-400'
              }`}
              aria-hidden="true"
            />
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (activeFilter !== 'extensions' && e.target.value.trim()) {
                  const target = document.getElementById('roster');
                  target?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              placeholder={
                activeFilter === 'extensions'
                  ? 'Search Download Extensions (.exe, .mp4, .mp3, .jpg)...'
                  : 'Search panel members, Discord @handles, roles, or notes...'
              }
              aria-label={
                activeFilter === 'extensions'
                  ? 'Search extension files'
                  : 'Search panel members'
              }
              className={`w-full bg-transparent text-sm md:text-base focus:outline-none ${
                isExtensionsTab
                  ? 'text-[#16143E] placeholder:text-[#4F4B94]'
                  : 'text-white placeholder:text-neutral-500'
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className={`text-xs font-medium px-3 py-1.5 rounded border whitespace-nowrap shrink-0 cursor-pointer ${
                  isExtensionsTab
                    ? 'text-[#272363] hover:text-[#16143E] border-white/85 bg-white/55'
                    : 'text-neutral-300 hover:text-white border-white/10'
                }`}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className={`md:hidden px-6 py-4 flex flex-col gap-2 ${
            isExtensionsTab
              ? 'border-t border-white/80 bg-[#E3E2FF]'
              : 'border-t border-white/10 bg-[#070709]'
          }`}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeFilter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                data-no-music-unlock={item.id !== 'home' ? 'true' : undefined}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-3 text-sm font-medium rounded-xl transition-colors cursor-pointer ${
                  isExtensionsTab
                    ? isActive
                      ? 'ext-glass-cta text-white font-semibold'
                      : 'text-[#272363] hover:bg-white/60 hover:text-[#16143E]'
                    : isActive
                      ? 'bg-[#E11D48] text-white'
                      : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
}
