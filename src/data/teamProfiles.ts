import { applyFolderMediaOverrides } from '../utils/folderMediaLoader';
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

const BASE_TEAM_PROFILES: TeamProfile[] = [
  /*
   * ============================================================================
   * ZERO-CODE DRAG & DROP MEDIA FOLDERS:
   * 1. Music: Drop 01.mp3, 02.mp3, 03.mp3, 04.mp3, 05.mp3 into -> src/music/
   * 2. Card Photos: Drop 01.png, 02.png, ... into -> src/posters/
   * 3. Hero Backgrounds: Drop 01.jpg, 02.jpg, ... into -> src/backdrops/
   *    (Zero code edits needed! Files automatically match Profiles 01 - 05.)
   *
   * 4. Edit text fields (name, discordHandle, roleTitle, badgeCode, customText) below.
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
  },
  {
    id: 'arjun-admin',
    indexLabel: '02',
    name: 'Rahat Bhai',
    discordHandle: '@RAHAT',
    roleTitle: 'Administrator',
    division: 'admins',
    joinedYear: 'Since 2018',
    badgeCode: 'OWNER',
    specialty: 'Unmarried',
    backdropUrl: bgCretaceousHorizon,
    posterUrl: posterCretaceousHorizon,
    customText:
      'The ocean owed the shell nothing',
    panelNote:
      'Know your place, idiot',
    trackId: 'horizon-arp',
  },
  {
    id: 'rafi-commander',
    indexLabel: '03',
    name: 'Aurora',
    discordHandle: '@cross_aura',
    roleTitle: 'Aura',
    division: 'founders',
    joinedYear: 'Since 2023',
    badgeCode: 'ADVISOR',
    specialty: 'Her aura was made to shine, not to be dimmed by anyone 🤍',
    backdropUrl: bgIronCovenant,
    posterUrl: posterIronCovenant,
    customText:
      "About me? I'm working on myself right now!",
    panelNote:
      'Her aura was made to shine, not to be dimmed by anyone🤍.',
    trackId: 'covenant-bass',
  },
  {
    id: 'zara-security',
    indexLabel: '04',
    name: 'Cyrus',
    discordHandle: '@proffessor27',
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
    name: 'Eshad',
    discordHandle: '@Eshad',
    roleTitle: 'Creative & Media Mod',
    division: 'moderators',
    joinedYear: 'Since 2024',
    badgeCode: 'MOD',
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

export const DEFAULT_TEAM_PROFILES: TeamProfile[] =
  applyFolderMediaOverrides(BASE_TEAM_PROFILES);

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
