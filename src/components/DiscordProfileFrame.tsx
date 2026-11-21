import { ReactNode } from 'react';
import skullFramePng from '../assets/frames/arhan-skull-frame.png';
import symbioteFramePng from '../assets/frames/rahat-symbiote-frame.png';
import ravenFramePng from '../assets/frames/profile03-raven-frame.png';

export type ProfileFrameVariant = 'skull' | 'symbiote' | 'raven';

interface DiscordProfileFrameProps {
  variant?: ProfileFrameVariant;
  enabled?: boolean;
  children: ReactNode;
  compact?: boolean;
}

const EMBER_SPARK_CLASSES = [
  'left-[16%] bottom-1 [animation-delay:0s] [animation-duration:2.8s] w-1 h-1',
  'left-[31%] bottom-3 [animation-delay:0.8s] [animation-duration:3.3s] w-1.5 h-1.5',
  'left-[48%] bottom-0 [animation-delay:0.3s] [animation-duration:2.5s] w-1 h-1',
  'left-[64%] bottom-4 [animation-delay:1.2s] [animation-duration:3.1s] w-1.5 h-1.5',
  'left-[81%] bottom-1 [animation-delay:0.6s] [animation-duration:2.7s] w-1 h-1',
];

const SYMBIOTE_SPORE_CLASSES = [
  'left-[14%] bottom-1 [animation-delay:0.2s] [animation-duration:3.1s] w-1 h-1',
  'left-[33%] bottom-3 [animation-delay:1.1s] [animation-duration:2.7s] w-1.5 h-1.5',
  'left-[52%] bottom-0 [animation-delay:0.5s] [animation-duration:3.4s] w-1 h-1',
  'left-[71%] bottom-2 [animation-delay:1.5s] [animation-duration:2.9s] w-1 h-1',
  'left-[86%] bottom-1 [animation-delay:0.9s] [animation-duration:3.0s] w-1.5 h-1.5',
];

const MOON_MOTE_CLASSES = [
  'left-[20%] bottom-1 [animation-delay:0.1s] [animation-duration:3.2s] w-1 h-1',
  'left-[36%] bottom-3 [animation-delay:1.0s] [animation-duration:2.9s] w-1.5 h-1.5',
  'left-[51%] bottom-0 [animation-delay:0.6s] [animation-duration:3.5s] w-1 h-1',
  'left-[69%] bottom-2 [animation-delay:1.4s] [animation-duration:3.0s] w-1 h-1',
  'left-[84%] bottom-1 [animation-delay:0.4s] [animation-duration:2.8s] w-1.5 h-1.5',
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

          {/* Subtle Drifting Abyssal Mist Spores Above Top Tendrils */}
          <div className="absolute inset-x-[10%] top-[-4%] h-[16%] overflow-hidden">
            {SYMBIOTE_SPORE_CLASSES.map((sporeClass, i) => (
              <span
                key={i}
                className={`discord-symbiote-spore absolute rounded-full bg-slate-200/90 blur-[0.5px] shadow-[0_0_8px_rgba(45,212,191,0.85)] ${sporeClass}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeVariant === 'raven') {
    return (
      <div className="relative overflow-visible">
        {/* Pale Moonlight & Abyssal Teal Aura Behind Card */}
        <div
          aria-hidden="true"
          className="discord-raven-aura pointer-events-none absolute -inset-3 rounded-[26px] blur-xl"
        />

        {/* Base Card Content */}
        <div className="relative z-10">{children}</div>

        {/* Animated Thorny Raven & Full Moon PNG Decoration Overlay */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute z-20 select-none left-[-10.4%] right-[-10.4%] top-[-26.8%] ${
            compact ? 'bottom-[-9.5%]' : 'bottom-[-12.6%]'
          }`}
        >
          <img
            src={ravenFramePng}
            alt=""
            draggable={false}
            className="discord-raven-img w-full h-full object-fill"
          />

          {/* Subtle Pulsing Crimson Glint on the Perched Raven Eyes (Top Moon Band) */}
          <div className="discord-raven-eyes absolute left-[36%] top-[9.8%] w-4 h-4 rounded-full bg-[#ff3b5c]/65 blur-[5px]" />
          <div className="discord-raven-eyes absolute left-[84.5%] top-[8.8%] w-3.5 h-3.5 rounded-full bg-[#ff3b5c]/60 blur-[5px] [animation-delay:0.9s]" />

          {/* Drifting Icy Moonlight Motes Strictly Above the Top Twigs & Moon */}
          <div className="absolute inset-x-[10%] top-[-3%] h-[14%] overflow-hidden">
            {MOON_MOTE_CLASSES.map((moteClass, i) => (
              <span
                key={i}
                className={`discord-moon-mote absolute rounded-full bg-cyan-100/90 blur-[0.5px] shadow-[0_0_8px_rgba(165,243,252,0.9)] ${moteClass}`}
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

        {/* Rising Ember Sparks Strictly Above the Top Skulls & Flame Crown */}
        <div className="absolute inset-x-[10%] top-[-4%] h-[16%] overflow-hidden">
          {EMBER_SPARK_CLASSES.map((sparkClass, i) => (
            <span
              key={i}
              className={`discord-ember-rise absolute rounded-full bg-[#ff6b81]/90 blur-[0.5px] shadow-[0_0_8px_#ff2e55] ${sparkClass}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
