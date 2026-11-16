import { BuiltInTrackId } from '../utils/profileAudio';
import bgSirenAbyss from '../assets/images/bg_siren_abyss_1794824346199.jpg';
import posterSirenAbyss from '../assets/images/poster_siren_abyss_1794824345515.jpg';
import bgCretaceousHorizon from '../assets/images/bg_cretaceous_horizon_1794824348252.jpg';
import posterCretaceousHorizon from '../assets/images/poster_cretaceous_horizon_1794824348137.jpg';
import bgIronCovenant from '../assets/images/bg_iron_covenant_1794824347495.jpg';
import posterIronCovenant from '../assets/images/poster_iron_covenant_1794824348129.jpg';
import bgObsidianTide from '../assets/images/bg_obsidian_tide_1794824348784.jpg';
import posterObsidianTide from '../assets/images/poster_obsidian_tide_1794824348927.jpg';
import bgHollowVault from '../assets/images/bg_hollow_vault_1794824350053.jpg';
import posterHollowVault from '../assets/images/poster_hollow_vault_1794824349995.jpg';

export type PanelDivision = 'all' | 'founders' | 'admins' | 'moderators' | 'starred';

export interface TeamProfile {
  id: string;
  indexLabel: string;
  name: string;
  discordHandle: string;
  roleTitle: string;
  division: 'founders' | 'admins' | 'moderators';
  joinedYear: string;
  badgeCode: string;
  specialty: string;
  backdropUrl: string;
  posterUrl: string;
  customText: string;
  panelNote: string;
  trackId: BuiltInTrackId;
  customTrackName?: string;
  customAudioUrl?: string;
}

export const DEFAULT_TEAM_PROFILES: TeamProfile[] = [
  /*
   * ============================================================================
   * HOW TO EDIT PICTURES, MUSIC & PROFILE INFO ON GITHUB:
   * 1. Put your Discord profile screenshots inside: public/images/
   *    -> Then set: posterUrl: './images/your-screenshot.png'
   *    -> And background photo: backdropUrl: './images/your-bg.jpg'
   *
   * 2. Put your .mp3 music files inside: public/music/
   *    -> Then set: customAudioUrl: './music/your-song.mp3'
   *    -> And song title: customTrackName: 'Your Song Name'
   *
   * 3. Edit name, discordHandle, roleTitle, badgeCode, specialty & customText below.
   * ============================================================================
   */
  {
    id: 'kaisar-founder',
    indexLabel: '01',
    name: 'Arhan Ishaq',
    discordHandle: '@kaisar.dev',
    roleTitle: 'Server Founder & Owner',
    division: 'founders',
    joinedYear: 'Since 2022',
    badgeCode: 'OWNER',
    specialty: 'Server Architecture · Community Vision · Core Panel',
    backdropUrl: bgSirenAbyss,
    posterUrl: posterSirenAbyss,
    customText:
      'Architect of our Discord sanctuary. Leading server culture, bot infrastructure, and welcoming every new member into the community.',
    panelNote:
      'Click "Edit Profile & Text" anytime to paste your own bio, drop in your real Discord profile screenshot, and attach custom theme music.',
    trackId: 'abyss-synth',
    customTrackName: 'Kaisar Sakib — Background Theme',
    customAudioUrl:
      './assets/aistudio/AQNn_NVValVvil3gXGdaifGW_hVRUAXG8MYeBx3AOO8X-zdlwvHNdt5iYkQz1izM7kL0MyD73wQVzXZzvFaCBKtHBKMy1QPgUlrr_011f6c43.mp3',
  },
  {
    id: 'arjun-admin',
    indexLabel: '02',
    name: 'Rahat Bhai',
    discordHandle: '@arjun.ops',
    roleTitle: 'Head Administrator',
    division: 'admins',
    joinedYear: 'Since 2023',
    badgeCode: 'OWNER',
    specialty: 'Permissions · Automation · Voice Channels',
    backdropUrl: bgCretaceousHorizon,
    posterUrl: posterCretaceousHorizon,
    customText:
      'Managing server channels, custom role hierarchies, and keeping all automated Discord systems running smoothly around the clock.',
    panelNote:
      'Oversees staff onboarding, permission audits, and weekly panel sync calls across all voice stages.',
    trackId: 'horizon-arp',
  },
  {
    id: 'rafi-commander',
    indexLabel: '03',
    name: 'Rafi Ortega',
    discordHandle: '@rafi.panel',
    roleTitle: 'Senior Panel Lead',
    division: 'founders',
    joinedYear: 'Since 2023',
    badgeCode: 'LEAD',
    specialty: 'Tournaments · Server Events · Partnerships',
    backdropUrl: bgIronCovenant,
    posterUrl: posterIronCovenant,
    customText:
      'Coordinating weekend voice stage nights, gaming tournaments, and cross-server collaborations with partner communities.',
    panelNote:
      'Keeps community events active every Friday night with live stage brackets and custom giveaways.',
    trackId: 'covenant-bass',
  },
  {
    id: 'zara-security',
    indexLabel: '04',
    name: 'Zara Solberg',
    discordHandle: '@zara.shield',
    roleTitle: 'Lead Moderator',
    division: 'moderators',
    joinedYear: 'Since 2024',
    badgeCode: 'MOD',
    specialty: 'Anti-Raid · Ticket Support · Chat Safety',
    backdropUrl: bgObsidianTide,
    posterUrl: posterObsidianTide,
    customText:
      'First line of defense against spam and raids. Handling member support tickets with calm, fair moderation across every channel.',
    panelNote:
      'Maintains 24/7 ticket response coverage and keeps general voice rooms safe and welcoming.',
    trackId: 'obsidian-lofi',
  },
  {
    id: 'clara-creative',
    indexLabel: '05',
    name: 'Clara Bennett',
    discordHandle: '@clara.art',
    roleTitle: 'Creative & Media Mod',
    division: 'moderators',
    joinedYear: 'Since 2024',
    badgeCode: 'CREW',
    specialty: 'Server Banners · Stickers · Stage Music',
    backdropUrl: bgHollowVault,
    posterUrl: posterHollowVault,
    customText:
      'Designing server icons, custom emotes, and curating late-night chill music sessions inside our Discord lounge.',
    panelNote:
      'Crafts seasonal server aesthetics, announcement embeds, and visual showcases for the team.',
    trackId: 'lantern-chime',
  },
];

export const SERVER_PILLARS = [
  {
    id: 'moderation',
    title: 'Fair Panel Moderation',
    tag: '24/7 Ticket Support · Safe Chat',
    description:
      'Our admin and moderator panel keeps every channel friendly, raid-free, and welcoming for newcomers.',
  },
  {
    id: 'stage-events',
    title: 'Weekly Voice & Music Stages',
    tag: 'Fridays 9 PM · Live Hangouts',
    description:
      'Join curated listening parties, gaming lobbies, and community Q&A sessions hosted by our panel leads.',
  },
  {
    id: 'custom-roles',
    title: 'Custom Profiles & Server Ranks',
    tag: 'Active Levels · Crew Badges',
    description:
      'Unlock custom Discord profile colors, lounge access, and showcase spotlights as you participate.',
  },
];
