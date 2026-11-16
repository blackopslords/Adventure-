import { CheckCircle2, Download, Lock, Unlock } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { SERVER_PILLARS } from '../data/teamProfiles';
import { NavSection } from './Navbar';

interface ServerFooterSectionProps {
  onSelectFilter: (section: NavSection) => void;
  isAdminMode: boolean;
  onOpenAdminLogin: () => void;
  onLockAdmin: () => void;
  onExportConfig: () => void;
}

export function ServerFooterSection({
  onSelectFilter,
  isAdminMode,
  onOpenAdminLogin,
  onLockAdmin,
  onExportConfig,
}: ServerFooterSectionProps) {
  const [discordTag, setDiscordTag] = useState('');
  const [error, setError] = useState('');
  const [submittedTag, setSubmittedTag] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = discordTag.trim();
    if (trimmed.length < 2) {
      setError('Please enter your Discord username (e.g. @username).');
      return;
    }
    setError('');
    setSubmittedTag(trimmed);
    setDiscordTag('');
  };

  return (
    <>
      <section
        id="community"
        aria-label="Discord Community Highlights"
        className="py-20 md:py-24 bg-[#070709] border-t border-white/8"
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 space-y-16">
          {/* Server Highlights */}
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-xs font-mono tracking-wider text-neutral-400 uppercase mb-2">
                  Server Highlights
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  Built Around Our Community
                </h2>
              </div>
              <p className="text-sm text-neutral-400 max-w-md">
                Managed daily by our panel team to keep voice rooms, text channels, and events welcoming.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/10 pt-8">
              {SERVER_PILLARS.map((item, idx) => (
                <div key={item.id} className="space-y-3">
                  <div className="text-xs font-mono text-neutral-400 tabular-nums">
                    <span>0{idx + 1}.</span>
                    <span className="mx-2 text-neutral-600" aria-hidden="true">
                      ·
                    </span>
                    <span>{item.tag}</span>
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Join Discord / Panel Application Box */}
          <div className="bg-[#111115] border border-white/10 rounded-2xl p-6 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-xl space-y-2">
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Connect With Our Discord Panel
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Drop your Discord username to request server role verification, join the staff waitlist, or receive event pings.
              </p>
            </div>

            {submittedTag ? (
              <div
                role="status"
                className="flex items-center gap-3 px-5 py-3.5 bg-white/6 border border-white/15 rounded-xl text-sm text-white"
              >
                <CheckCircle2
                  className="w-5 h-5 text-emerald-400 shrink-0"
                  aria-hidden="true"
                />
                <span>
                  Request noted for <span className="font-semibold">{submittedTag}</span>. Our panel team will reach out in Discord.
                </span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="w-full lg:w-auto lg:min-w-[420px] space-y-2"
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <label htmlFor="discord-handle-input" className="sr-only">
                    Discord username
                  </label>
                  <input
                    id="discord-handle-input"
                    type="text"
                    value={discordTag}
                    onChange={(e) => {
                      setDiscordTag(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="@your_discord_handle"
                    aria-invalid={Boolean(error)}
                    className="flex-1 px-4 py-3 text-sm text-white bg-[#070709] border border-white/15 rounded-lg placeholder:text-neutral-500 focus:outline-none focus:border-[#E11D48]"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 text-sm font-semibold text-white bg-[#E11D48] hover:bg-[#BE123C] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    Send Request
                  </button>
                </div>
                {error && (
                  <p role="alert" className="text-xs text-rose-400">
                    {error}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Quiet Editorial Footer with Protected Owner Access */}
      <footer className="bg-[#070709] border-t border-white/10 py-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                onSelectFilter('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="font-display text-xl font-bold text-white"
            >
              PanelHub
            </a>
            <span className="text-xs text-neutral-500">
              Discord Server Panel Showcase
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs text-neutral-400">
            <a
              href="#roster"
              onClick={() => onSelectFilter('home')}
              className="hover:text-white transition-colors"
            >
              Team Roster
            </a>
            <a href="#spotlight" className="hover:text-white transition-colors">
              Spotlight
            </a>
            <a href="#community" className="hover:text-white transition-colors">
              Community
            </a>

            <span className="text-neutral-600" aria-hidden="true">
              ·
            </span>

            {isAdminMode ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onExportConfig}
                  className="inline-flex items-center gap-1.5 text-neutral-200 hover:text-white cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Export Config</span>
                </button>
                <button
                  type="button"
                  onClick={onLockAdmin}
                  className="inline-flex items-center gap-1.5 text-rose-400 hover:text-rose-300 cursor-pointer"
                >
                  <Unlock className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Lock Owner Mode</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAdminLogin}
                className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
              >
                <Lock className="w-3 h-3" aria-hidden="true" />
                <span>Owner Access</span>
              </button>
            )}
          </div>
        </div>
      </footer>
    </>
  );
}
