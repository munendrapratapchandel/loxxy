export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  logoText: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  discordInvite: string;
  discordPageEnabled: boolean;
  recruitmentEnabled: boolean;
  maintenanceMode: boolean;
  adminPin: string; // Admin passkey / PIN for security
  supabaseConfig?: {
    url: string;
    anonKey: string;
    serviceRoleKey: string;
    enabled: boolean;
  };
  liveStatus: {
    enabled: boolean;
    membersOnline: number;
    playersInGame: number;
    discordOnline: boolean;
    currentActivity: string;
  };
  hero: {
    title: string;
    tagline: string;
    description: string;
    cta1Text: string;
    cta1Link: string;
    cta2Text: string;
    cta2Link: string;
    cta3Text: string;
    cta3Link: string;
    featuredPlayerId: string;
  };
  navigation: {
    home: boolean;
    roster: boolean;
    rankings: boolean;
    compare: boolean;
    matches: boolean;
    clips: boolean;
    achievements: boolean;
    dominance: boolean;
    discord: boolean;
  };
  sections: {
    hero: boolean;
    universe: boolean;
    liveStatus: boolean;
    stats: boolean;
    featuredPlayers: boolean;
    rankingsPreview: boolean;
    latestNews: boolean;
    matches: boolean;
    clips: boolean;
    achievements: boolean;
    discordCta: boolean;
  };
}

export interface PlayerCareerMilestone {
  date: string;
  title: string;
  description: string;
}

export interface PlayerMedia {
  id: string;
  title: string;
  url: string;
  type: 'image' | 'video';
}

export interface Player {
  id: string;
  name: string;
  ign: string;
  role: string;
  skinUrl: string;
  avatarUrl?: string;
  joinDate: string;
  status: 'Active' | 'Captain' | 'Reserve' | 'Trial' | 'Former';
  featured: boolean;
  region: string;
  mainGamemode: string;
  bio: string;
  powerIndex?: number; // Loxxy Power Index (calculated or manual)
  pvpTiers: Record<string, string>; // e.g. { "Sword": "HT1", "Axe": "HT2", "Crystal": "LT1" }
  skills: Record<string, number>;   // e.g. { "PvP": 98, "Building": 82, "Redstone": 74 }
  careerTimeline?: PlayerCareerMilestone[];
  mediaGallery?: PlayerMedia[];
  socials: {
    discord?: string;
    youtube?: string;
    twitter?: string;
    twitch?: string;
    instagram?: string;
    tiktok?: string;
    namemc?: string;
  };
}

export interface TierDefinition {
  id: string;
  name: string;
  badgeTitle: string;
  type: 'HT' | 'LT';
  level: number;
  color: string;
  glowColor: string;
  badgeGradient: string;
  description: string;
}

export interface GamemodeDefinition {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: 'PvP' | 'Tournament' | 'Championship' | 'Dominance' | 'Record';
  result: string;
  imageUrl: string;
  linkedPlayers: string[];
  linkUrl?: string;
}

export interface TimelineMilestone {
  id: string;
  date: string;
  title: string;
  description: string;
  category: string;
}

export interface MatchItem {
  id: string;
  opponent: string;
  opponentTag?: string;
  date: string;
  tournament: string;
  gamemode: string;
  status: 'Upcoming' | 'Completed' | 'Live';
  result?: 'Victory' | 'Defeat' | 'Draw';
  score?: string; // "5 - 2"
  vodUrl?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  category: 'Announcement' | 'Tournament Win' | 'Roster Update' | 'Promotion';
  date: string;
  summary: string;
  imageUrl?: string;
  linkUrl?: string;
}

export interface DominanceStat {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  description: string;
  icon: string;
}

export interface RecruitmentApplication {
  id: string;
  ign: string;
  discordTag: string;
  age: string;
  region: string;
  mainGamemode: string;
  pvpTierClaim: string;
  experience: string;
  clipsUrl: string;
  whyJoin: string;
  submittedAt: string;
  status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
}

export interface TeamRole {
  id: string;
  name: string;
  color: string;
  badgeStyle?: string;
  description?: string;
  isDefault?: boolean;
}

export interface ClipItem {
  id: string;
  title: string;
  category: 'Tournament Clutch' | '1v1 Duel' | 'Montage' | 'Screenshot / Photo' | 'VOD';
  mediaType: 'video' | 'image';
  url: string;
  thumbnailUrl?: string;
  authorOrPlayer?: string;
  gamemode?: string;
  date: string;
  description?: string;
  featured?: boolean;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  category: 'skin' | 'logo' | 'banner' | 'achievement' | 'other';
  uploadedAt: string;
}

export interface LoxxyDatabase {
  settings: SiteSettings;
  players: Player[];
  tiers: TierDefinition[];
  gamemodes: GamemodeDefinition[];
  roles: TeamRole[];
  clips: ClipItem[];
  achievements: Achievement[];
  timelineMilestones: TimelineMilestone[];
  matches: MatchItem[];
  news: NewsItem[];
  dominanceStats: DominanceStat[];
  recruitmentApplications: RecruitmentApplication[];
  mediaLibrary: MediaItem[];
}
