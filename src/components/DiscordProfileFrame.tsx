import { ReactNode } from 'react';
import skullFramePng from '../assets/frames/arhan-skull-frame.png';
import symbioteFramePng from '../assets/frames/rahat-symbiote-frame.png';

export type ProfileFrameVariant = 'skull' | 'symbiote';

interface DiscordProfileFrameProps {
  variant?: ProfileFrameVariant;
  enabled?: boolean;
  children: ReactNode;
  compact?: boolean;
}

const EMBER_SPARK_CLASSES = [
  'left-[14%] [animation-delay:0s] [animation-duration:2.9s] w-1.5 h-1.5',
  'left-[28%] [animation-delay:0.7s] [animation-duration:3.4s] w-1 h-1',
  'left-[46%] [animation-delay:0.2s] [animation-duration:2.5s] w-1.5 h-1.5',
  'left-[61%] [animation-delay:1.1s] [animation-duration:3.1s] w-1 h-1',
  'left-[77%] [animation-delay:0.5s] [animation-duration:2.7s] w-1.5 h-1.5',
  'left-[89%] [animation-delay:1.5s] [animation-duration:3.3s] w-1 h-1',
];

const SYMBIOTE_SPORE_CLASSES = [
  'left-[12%] [animation-delay:0.2s] [animation-duration:3.2s] w-1.5 h-1.5',
  'left-[30%] [animation-delay:1.1s] [animation-duration:2.8s] w-1 h-1',
  'left-[49%] [animation-delay:0.4s] [animation-duration:3.5s] w-1.5 h-1.5',
  'left-[68%] [animation-delay:1.6s] [animation-duration:2.9s] w-1 h-1',
  'left-[84%] [animation-delay:0.8s] [animation-duration:3.1s] w-1.5 h-1.5',
];

export function DiscordProfileFrame({
  variant,
  enabled,
  children,
  compact = false,
}: DiscordProfileFrameProps) {
  const activeVariant: ProfileFrameVariant | undefined =
    variant ?? (enabled ? 'skull' : undefined);

  if (!activeVariant) {
    return <>{children}</>;
  }

  if (activeVariant === 'symbiote') {
    return (
      <div className="relative overflow-visible">
        {/* Cold Silver-Teal Rim Aura Behind Symbiote Tendrils */}
        <div
          aria-hidden="true"
          className="discord-symbiote-aura pointer-events-none absolute -inset-3 rounded-[26px] blur-xl"
        />

        {/* Base Card Content */}
        <div className="relative z-10">{children}</div>

        {/* Animated Liquid Symbiote PNG Decoration Overlay */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute z-20 select-none left-[-10.5%] right-[-10.5%] top-[-18.5%] ${
            compact ? 'bottom-[-9.5%]' : 'bottom-[-13.5%]'
          }`}
        >
          <img
            src={symbioteFramePng}
            alt=""
            draggable={false}
            className="discord-symbiote-img w-full h-full object-fill"
          />

          {/* Subtle Drifting Abyssal Mist Spores */}
          <div className="absolute inset-x-[8%] top-[2%] h-[24%] overflow-hidden">
            {SYMBIOTE_SPORE_CLASSES.map((sporeClass, i) => (
              <span
                key={i}
                className={`discord-symbiote-spore absolute bottom-0 rounded-full bg-slate-200 shadow-[0_0_8px_rgba(45,212,191,0.8)] ${sporeClass}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-visible">
      {/* Ambient Crimson Flame Backlight Behind Card */}
      <div
        aria-hidden="true"
        className="discord-skull-aura pointer-events-none absolute -inset-3 rounded-[26px] blur-xl"
      />

      {/* Base Card Content (Portrait, Scrim, Controls) */}
      <div className="relative z-10">{children}</div>

      {/* Animated Skull & Crimson Fire PNG Decoration Overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-20 select-none left-[-7.4%] right-[-7.4%] top-[-25%] bottom-[-10.5%]"
      >
        <img
          src={skullFramePng}
          alt=""
          draggable={false}
          className="discord-skull-flame-img w-full h-full object-fill"
        />

        {/* Pulsing Crimson Eye Embers on the Top Skulls */}
        <div
          className={`discord-skull-eyes absolute left-1/2 -translate-x-1/2 flex items-center justify-center ${
            compact
              ? 'top-[13.5%] w-[38%] h-[5%]'
              : 'top-[13.2%] w-[42%] h-[5.5%]'
          }`}
        >
          <span className="w-full h-full rounded-full bg-gradient-to-r from-transparent via-[#ff3b5c]/80 to-transparent blur-[6px]" />
        </div>

        {/* Rising Ember Sparks Around Top Flames */}
        <div className="absolute inset-x-[6%] top-[4%] h-[28%] overflow-hidden">
          {EMBER_SPARK_CLASSES.map((sparkClass, i) => (
            <span
              key={i}
              className={`discord-ember-rise absolute bottom-0 rounded-full bg-[#ff6b81] shadow-[0_0_8px_#ff2e55] ${sparkClass}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
