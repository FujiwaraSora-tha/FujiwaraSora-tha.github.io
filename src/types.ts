export interface PlayerProfile {
  name: string;
  email: string;
  avatar: string;
  bio: string;
  class: string;
  level: number;
  exp: number;
  expNeeded: number;
  kills: number;
  deaths: number;
  gold: number; // In-game currency
  points: number; // Top-up currency (Cash points)
  guild: string | null;
  town: string | null;
  dailyClaimedDays: number; // 0 to 7
  lastClaimDate: string | null;
  seasonPassExp: number;
  seasonPassLevel: number;
  seasonPassPremium: boolean;
  packageStatus: string; // 'None' | '1 Month' | '6 Months' | 'Lifetime'
  packageExpiry: string | null;
  bonusPackage: 'None' | 'Start' | 'Pro' | 'Elite';
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: 'Weapon' | 'Armor' | 'Consumable' | 'Material' | 'Cosmetic';
  quantity: number;
  iconName: string;
}

export interface MarketItem {
  id: string;
  sellerName: string;
  itemName: string;
  price: number;
  quantity: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: 'Weapon' | 'Armor' | 'Consumable' | 'Material' | 'Cosmetic';
  iconName: string;
  isAuction: boolean;
  currentBid?: number;
  highestBidder?: string;
  endsAt?: string; // Date string
}

export interface SupportTicket {
  id: string;
  title: string;
  category: 'Bug' | 'Payment' | 'Report Player' | 'Appeal Ban' | 'Other';
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  reply?: string;
}

export interface GameClass {
  name: string;
  icon: string;
  description: string;
  difficulty: number; // 1 to 5
  stats: {
    attack: number;
    defense: number;
    magic: number;
    speed: number;
  };
  skills: { name: string; desc: string }[];
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  class: string;
  guild: string | null;
  level: number;
  exp: number;
  kills: number;
  deaths: number;
  gold: number;
}
