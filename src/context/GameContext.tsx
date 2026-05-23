import React, { createContext, useContext, useState, useEffect } from 'react';
import { PlayerProfile, InventoryItem, MarketItem, SupportTicket } from '../types';
import { INITIAL_MARKET_ITEMS } from '../mockData';
import { GAME_CONFIG } from '../config';

interface GameContextType {
  isLoggedIn: boolean;
  isBlocked: boolean;
  playerProfile: PlayerProfile | null;
  inventory: InventoryItem[];
  marketItems: MarketItem[];
  supportTickets: SupportTicket[];
  setIsBlocked: (blocked: boolean) => void;
  login: (email: string, pass: string) => boolean | string;
  register: (name: string, email: string, pass: string) => boolean | string;
  logout: () => void;
  updateProfile: (updated: Partial<PlayerProfile>) => void;
  topUpPoints: (amount: number, method: string) => void;
  buyPackage: (duration: '1m' | '6m' | 'lifetime', cost: number) => boolean;
  claimBonusPackage: (type: 'Start' | 'Pro' | 'Elite', costPoints: number) => boolean;
  buyMarketItem: (id: string) => boolean;
  bidMarketItem: (id: string, bidAmount: number) => boolean;
  listMarketItem: (itemName: string, quantity: number, price: number, rarity: string, category: string, isAuction: boolean) => boolean;
  addSupportTicket: (title: string, category: 'Bug' | 'Payment' | 'Report Player' | 'Appeal Ban' | 'Other', description: string) => void;
  claimDailyReward: () => boolean;
  gainSeasonExp: (amount: number) => void;
  claimSeasonReward: (level: number) => void;
  changeClass: (newClass: string) => void;
  setGuildAndTown: (guild: string | null, town: string | null) => void;
  useInventoryItem: (id: string) => void;
  resetGameData: () => void; // Central reset action added
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const DEFAULT_PROFILE: PlayerProfile = {
  name: GAME_CONFIG.DEFAULT_PLAYER_NAME,
  email: GAME_CONFIG.DEFAULT_PLAYER_EMAIL,
  avatar: '🛡️',
  bio: 'ผู้พิทักษ์แห่งราชอาณาจักรราริเทีย กำลังมุ่งหน้าสู่อันดับท็อปเซิร์ฟ!',
  class: GAME_CONFIG.STARTING_CLASS,
  level: GAME_CONFIG.STARTING_LEVEL,
  exp: 2450,
  expNeeded: 5000,
  kills: 142,
  deaths: 28,
  gold: GAME_CONFIG.STARTING_GOLD,
  points: GAME_CONFIG.STARTING_POINTS,
  guild: 'Valhalla',
  town: 'Arcadia',
  dailyClaimedDays: 2,
  lastClaimDate: '2026-05-22',
  seasonPassExp: 340,
  seasonPassLevel: 2,
  seasonPassPremium: false,
  packageStatus: 'None',
  packageExpiry: null,
  bonusPackage: 'None'
};

const DEFAULT_INVENTORY: InventoryItem[] = [
  { id: 'i1', name: 'ดาบฝึกหัดสนิมเขรอะ (Rusty Recruit Sword)', description: 'ดาบฟันไม้ใช้สำหรับผู้เล่นเริ่มต้น ปัจจุบันไม่ค่อยคมแล้ว', rarity: 'common', category: 'Weapon', quantity: 1, iconName: 'Sword' },
  { id: 'i2', name: 'ยาเพิ่มพลังโจมตีกายภาพ (Atk Potion III)', description: 'เพิ่มพลังโจมตีกายภาพเพื่มขึ้น 15% เป็นเวลา 5 นาที', rarity: 'uncommon', category: 'Consumable', quantity: 5, iconName: 'GlassWater' },
  { id: 'i3', name: 'ใบชุบชีวิตผู้ร่วมทาง (Scroll of Revival)', description: 'ชุบชีวิตเพื่อนในปาร์ตี้ได้โดยไม่มีบทลงโทษสูญเสีย EXP', rarity: 'rare', category: 'Consumable', quantity: 2, iconName: 'Scroll' },
  { id: 'i4', name: 'แกนพลังงานเวทย์โบราณ (Ancient Runestone)', description: 'ก้อนหินลึกลับจารึกอักขระโบราณ ใช้สร้างอุปกรณ์เวทยมนต์ระดับสูง', rarity: 'epic', category: 'Material', quantity: 3, iconName: 'Gem' }
];

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(DEFAULT_PROFILE);
  const [inventory, setInventory] = useState<InventoryItem[]>(DEFAULT_INVENTORY);
  const [marketItems, setMarketItems] = useState<MarketItem[]>(INITIAL_MARKET_ITEMS);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([
    { id: 't1', title: 'ปัญหาตัดเงินไม่เข้า', category: 'Payment', description: 'โอนเงิน QR Code จำนวน 150 บาท ตั้งแต่เวลา 14:00 น. รอระบบยืนยันแป๊บเดียวแต่บัฟยังไม่เข้าครับ รบกวนตรวจสอบให้ที', status: 'Resolved', createdAt: '2026-05-22T14:30:00Z', reply: 'ทีมงานฝ่ายการเงินตรวจสอบสเตตเมนต์เรียบร้อย ได้ทำการเติม Points ยอดค้าง 150 Pts พร้อมแถมชดเชยแผ่นคูณ Exp สำเร็จแล้วครับ ขออภัยในความล้าช้า' }
  ]);

  // Load state from localStorage on mount (safe local persistence)
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem('mmo_isLoggedIn');
      const storedBlocked = localStorage.getItem('mmo_isBlocked');
      const storedProfile = localStorage.getItem('mmo_profile');
      const storedInventory = localStorage.getItem('mmo_inventory');
      const storedMarket = localStorage.getItem('mmo_market');
      const storedTickets = localStorage.getItem('mmo_tickets');

      if (storedAuth) setIsLoggedIn(JSON.parse(storedAuth));
      if (storedBlocked) setIsBlocked(JSON.parse(storedBlocked));
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        if (parsed && typeof parsed === 'object') {
          setPlayerProfile(parsed);
        }
      }
      if (storedInventory) {
        const parsed = JSON.parse(storedInventory);
        if (Array.isArray(parsed)) {
          setInventory(parsed);
        }
      }
      if (storedMarket) {
        const parsed = JSON.parse(storedMarket);
        if (Array.isArray(parsed)) {
          setMarketItems(parsed);
        }
      }
      if (storedTickets) {
        const parsed = JSON.parse(storedTickets);
        if (Array.isArray(parsed)) {
          setSupportTickets(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load state from localStorage:', e);
    }
  }, []);

  // Save changes to localStorage helper
  const saveState = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const login = (email: string, pass: string): boolean | string => {
    if (!email || !pass) return 'กรุณากรอกข้อมูลให้ครบถ้วน';
    if (email === 'banned@mmo.com') {
      setIsBlocked(true);
      saveState('mmo_isBlocked', true);
      return 'บัญชีนี้ถูกระงับการใช้งานชั่วคราวเนื่องจากละเมิดกฎกฎระเบียบเซิร์ฟเวอร์';
    }

    // Default simulation login
    setIsLoggedIn(true);
    setIsBlocked(false);
    
    // Setup standard profile if missing
    const userProfile = playerProfile || { ...DEFAULT_PROFILE, email: email };
    setPlayerProfile(userProfile);

    saveState('mmo_isLoggedIn', true);
    saveState('mmo_isBlocked', false);
    saveState('mmo_profile', userProfile);
    return true;
  };

  const register = (name: string, email: string, pass: string): boolean | string => {
    if (!name || !email || !pass) return 'กรุณากรอกข้อมูลเพื่อสร้างบัญชีให้ครบ';
    
    const newProfile: PlayerProfile = {
      ...DEFAULT_PROFILE,
      name: name,
      email: email,
      points: 200, // starting bonus
      gold: 5000,
      level: 1,
      exp: 0,
      expNeeded: 100,
      guild: null,
      town: null,
      packageStatus: 'None',
      bonusPackage: 'None'
    };
    
    setPlayerProfile(newProfile);
    setIsLoggedIn(true);
    setIsBlocked(false);
    setInventory(DEFAULT_INVENTORY);

    saveState('mmo_isLoggedIn', true);
    saveState('mmo_isBlocked', false);
    saveState('mmo_profile', newProfile);
    saveState('mmo_inventory', DEFAULT_INVENTORY);
    return true;
  };

  const logout = () => {
    setIsLoggedIn(false);
    saveState('mmo_isLoggedIn', false);
  };

  const updateProfile = (updated: Partial<PlayerProfile>) => {
    if (!playerProfile) return;
    const newProfile = { ...playerProfile, ...updated };
    setPlayerProfile(newProfile);
    saveState('mmo_profile', newProfile);
  };

  const changeClass = (newClass: string) => {
    if (!playerProfile) return;
    const updated = { ...playerProfile, class: newClass };
    // also adapt characteristics slightly as simulation visual impact
    if (newClass.includes('Mage')) {
      updated.avatar = '🔮';
    } else if (newClass.includes('Warrior')) {
      updated.avatar = '⚔️';
    } else if (newClass.includes('Ranger')) {
      updated.avatar = '🏹';
    } else if (newClass.includes('Healer')) {
      updated.avatar = '✨';
    } else {
      updated.avatar = '🗡️';
    }
    setPlayerProfile(updated);
    saveState('mmo_profile', updated);
  };

  const setGuildAndTown = (guild: string | null, town: string | null) => {
    if (!playerProfile) return;
    const updated = { ...playerProfile, guild, town };
    setPlayerProfile(updated);
    saveState('mmo_profile', updated);
  };

  const topUpPoints = (amount: number, method: string) => {
    if (!playerProfile) return;
    // 1 THB = 1 Point (simulated conversion bonus)
    const pointsReceived = amount;
    const updatedProfile = {
      ...playerProfile,
      points: playerProfile.points + pointsReceived
    };
    setPlayerProfile(updatedProfile);
    saveState('mmo_profile', updatedProfile);
  };

  const buyPackage = (duration: '1m' | '6m' | 'lifetime', cost: number): boolean => {
    if (!playerProfile || playerProfile.points < cost) return false;

    let packageLabel = '';
    let daysToAdd = 0;

    if (duration === '1m') {
      packageLabel = '1 Month VIP';
      daysToAdd = 30;
    } else if (duration === '6m') {
      packageLabel = '6 Months VIP';
      daysToAdd = 180;
    } else {
      packageLabel = 'Lifetime VIP';
      daysToAdd = 9999;
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + daysToAdd);

    const updatedProfile = {
      ...playerProfile,
      points: playerProfile.points - cost,
      packageStatus: packageLabel,
      packageExpiry: duration === 'lifetime' ? 'ไม่มีวันหมดอายุ' : expiryDate.toLocaleDateString('th-TH')
    };

    setPlayerProfile(updatedProfile);
    saveState('mmo_profile', updatedProfile);
    return true;
  };

  const claimBonusPackage = (type: 'Start' | 'Pro' | 'Elite', costPoints: number): boolean => {
    if (!playerProfile || playerProfile.points < costPoints) return false;

    // Craft inventory item matching package bonuses
    let extraItems: InventoryItem[] = [];
    let extraGold = 0;

    if (type === 'Start') {
      extraGold = 5000;
      extraItems = [
        { id: `pkg-${Date.now()}-1`, name: 'หีบเซ็ตตั้งตัวด่วน (Beginner Box)', description: 'หีบอุปกรณ์ช่วยเหลือเพื่อการเติบโตอย่างรวดเร็ว', rarity: 'uncommon', category: 'Consumable', quantity: 1, iconName: 'Gift' }
      ];
    } else if (type === 'Pro') {
      extraGold = 25000;
      extraItems = [
        { id: `pkg-${Date.now()}-1`, name: 'สัตว์เลี้ยงหมีเกราะดิน (Stone Grizzly Pet)', description: 'สัตว์เลี้ยงอรรถประโยชน์ช่วยเก็บไอเทมอัตโนมัติ', rarity: 'rare', category: 'Cosmetic', quantity: 1, iconName: 'Heart' },
        { id: `pkg-${Date.now()}-2`, name: 'กุญแจเหล็กกล้า (Steel Chest Key)', description: 'สำหรับไขหีบอุปสรรคระดับสูง', rarity: 'rare', category: 'Material', quantity: 3, iconName: 'Key' }
      ];
    } else {
      extraGold = 100000;
      extraItems = [
        { id: `pkg-${Date.now()}-1`, name: 'มงกุฎผู้ครองนภา (Gilded Elite Crown)', description: 'แฟชั่นลอยหัวถาวรเปี่ยมบารมีสีทองระยิบระยับ', rarity: 'legendary', category: 'Cosmetic', quantity: 1, iconName: 'Award' },
        { id: `pkg-${Date.now()}-2`, name: 'ยาอมฤตคูณ EXP ถาวร (Eternal XP Potion)', description: 'ยาเพิ่มผลคูณอัตรา EXP 10% ถาวรสะสมชีวิต', rarity: 'legendary', category: 'Consumable', quantity: 1, iconName: 'GlassWater' }
      ];
    }

    const updatedProfile = {
      ...playerProfile,
      points: playerProfile.points - costPoints,
      gold: playerProfile.gold + extraGold,
      bonusPackage: type
    };

    setPlayerProfile(updatedProfile);
    setInventory(prev => {
      const updatedInv = [...prev, ...extraItems];
      saveState('mmo_inventory', updatedInv);
      return updatedInv;
    });

    saveState('mmo_profile', updatedProfile);
    return true;
  };

  const buyMarketItem = (id: string): boolean => {
    if (!playerProfile) return false;
    const targetItem = marketItems.find(item => item.id === id);
    if (!targetItem) return false;

    // Check cost
    if (playerProfile.gold < targetItem.price) return false;

    // Deduct gold, add to inventory
    const updatedProfile = {
      ...playerProfile,
      gold: playerProfile.gold - targetItem.price
    };

    setPlayerProfile(updatedProfile);
    setMarketItems(prev => {
      const filtered = prev.filter(item => item.id !== id);
      saveState('mmo_market', filtered);
      return filtered;
    });

    // Add back to player inventory
    setInventory(prev => {
      const existing = prev.find(item => item.name === targetItem.itemName);
      let nextInv;
      if (existing) {
        nextInv = prev.map(item => item.name === targetItem.itemName ? { ...item, quantity: item.quantity + targetItem.quantity } : item);
      } else {
        nextInv = [...prev, {
          id: `inv-${Date.now()}`,
          name: targetItem.itemName,
          description: `ซื้อจากตลาดค้าขาย มอบกรรมสิทธิ์เจ้าของโดยชอบธรรม`,
          rarity: targetItem.rarity,
          category: targetItem.category,
          quantity: targetItem.quantity,
          iconName: targetItem.iconName
        }];
      }
      saveState('mmo_inventory', nextInv);
      return nextInv;
    });

    saveState('mmo_profile', updatedProfile);
    return true;
  };

  const bidMarketItem = (id: string, bidAmount: number): boolean => {
    if (!playerProfile) return false;
    const targetItem = marketItems.find(item => item.id === id);
    if (!targetItem || !targetItem.isAuction || bidAmount <= (targetItem.currentBid || targetItem.price)) return false;

    if (playerProfile.gold < bidAmount) return false;

    // Hold player's gold (mock action) and update price
    const updatedProfile = {
      ...playerProfile,
      gold: playerProfile.gold - (bidAmount - (targetItem.highestBidder === playerProfile.name ? (targetItem.currentBid || 0) : 0))
    };

    setPlayerProfile(updatedProfile);
    setMarketItems(prev => {
      const updatedList = prev.map(item => item.id === id ? {
        ...item,
        currentBid: bidAmount,
        highestBidder: playerProfile.name
      } : item);
      saveState('mmo_market', updatedList);
      return updatedList;
    });

    saveState('mmo_profile', updatedProfile);
    return true;
  };

  const listMarketItem = (itemName: string, quantity: number, price: number, rarity: string, category: string, isAuction: boolean): boolean => {
    if (!playerProfile) return false;

    // Deduct item from inventory
    const inventoryItem = inventory.find(item => item.name === itemName);
    if (!inventoryItem || inventoryItem.quantity < quantity) return false;

    setInventory(prev => {
      const updatedInv = prev.map(item => item.name === itemName ? { ...item, quantity: item.quantity - quantity } : item).filter(item => item.quantity > 0);
      saveState('mmo_inventory', updatedInv);
      return updatedInv;
    });

    const newMarket: MarketItem = {
      id: `mkt-${Date.now()}`,
      sellerName: playerProfile.name,
      itemName,
      price,
      quantity,
      rarity: rarity as any,
      category: category as any,
      iconName: inventoryItem.iconName,
      isAuction,
      currentBid: isAuction ? price : undefined,
      endsAt: isAuction ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : undefined
    };

    setMarketItems(prev => {
      const updatedMarket = [newMarket, ...prev];
      saveState('mmo_market', updatedMarket);
      return updatedMarket;
    });

    return true;
  };

  const addSupportTicket = (title: string, category: 'Bug' | 'Payment' | 'Report Player' | 'Appeal Ban' | 'Other', description: string) => {
    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      title,
      category,
      description,
      status: 'Open',
      createdAt: new Date().toISOString()
    };

    setSupportTickets(prev => {
      const updated = [newTicket, ...prev];
      saveState('mmo_tickets', updated);
      return updated;
    });
  };

  const claimDailyReward = (): boolean => {
    if (!playerProfile) return false;

    // Ensure they can claim once per localized interval (or simplify to a single click for premium UX)
    const todayStr = new Date().toDateString();
    if (playerProfile.lastClaimDate === todayStr) {
      return false; // already claimed
    }

    const nextDays = (playerProfile.dailyClaimedDays % 7) + 1;
    let goldReward = 500 * nextDays;
    let pointsReward = nextDays === 7 ? 100 : 0; // big day 7 reward

    // Add a custom premium item if they reach specific milestone
    let bonusItem: InventoryItem | null = null;
    if (nextDays === 3) {
      bonusItem = { id: `daily-${Date.now()}`, name: 'คริสตัลทอแสงอรรถกาล (Luminous Shard)', description: 'ได้รับจากรางวัญล็อกอินประจำวัน นำไปสร้างวัตถุดิบตีบวก', rarity: 'rare', category: 'Material', quantity: 2, iconName: 'Gem' };
    } else if (nextDays === 7) {
      bonusItem = { id: `daily-${Date.now()}`, name: 'หีบล็อกอินครบรอบเจ็ดวัน (Lucky Box VII)', description: 'เปิดสิทธิสุ่มแฟรี่สัตว์เลี้ยงและเหรียญทองกษาปณ์จุใจ', rarity: 'epic', category: 'Consumable', quantity: 1, iconName: 'Gift' };
    }

    const updatedProfile = {
      ...playerProfile,
      dailyClaimedDays: nextDays,
      lastClaimDate: todayStr,
      gold: playerProfile.gold + goldReward,
      points: playerProfile.points + pointsReward,
      seasonPassExp: playerProfile.seasonPassExp + 40 // Also grants Battle pass XP
    };

    // calculate season pass level
    let tempXp = updatedProfile.seasonPassExp;
    let tempLvl = updatedProfile.seasonPassLevel;
    while (tempXp >= 150) {
      tempXp -= 150;
      tempLvl += 1;
    }
    updatedProfile.seasonPassExp = tempXp;
    updatedProfile.seasonPassLevel = tempLvl;

    setPlayerProfile(updatedProfile);
    if (bonusItem) {
      setInventory(prev => {
        const nextInv = [...prev, bonusItem!];
        saveState('mmo_inventory', nextInv);
        return nextInv;
      });
    }

    saveState('mmo_profile', updatedProfile);
    return true;
  };

  const gainSeasonExp = (amount: number) => {
    if (!playerProfile) return;
    const updated = { ...playerProfile };
    let tempXp = updated.seasonPassExp + amount;
    let tempLvl = updated.seasonPassLevel;
    while (tempXp >= 150) {
      tempXp -= 150;
      tempLvl += 1;
    }
    updated.seasonPassExp = tempXp;
    updated.seasonPassLevel = tempLvl;

    setPlayerProfile(updated);
    saveState('mmo_profile', updated);
  };

  const claimSeasonReward = (level: number) => {
    // Reward claiming mock logic (grants some gold or item)
    if (!playerProfile) return;
    const bonusGold = level * 1000;
    
    // Add custom voucher
    const rewardItem: InventoryItem = {
      id: `season-reward-${level}-${Date.now()}`,
      name: `รางวัลเกียรติยศเทียร์ ${level} (Tier ${level} Medal)`,
      description: `เหรียญตราเกียรติคุณจากการอัปเลเวลแบทเทิลพาสซีซันพาส`,
      rarity: level >= 5 ? 'epic' : 'uncommon',
      category: 'Cosmetic',
      quantity: 1,
      iconName: 'Award'
    };

    const updated = {
      ...playerProfile,
      gold: playerProfile.gold + bonusGold
    };
    setPlayerProfile(updated);
    setInventory(prev => {
      const nextInv = [...prev, rewardItem];
      saveState('mmo_inventory', nextInv);
      return nextInv;
    });
    saveState('mmo_profile', updated);
  };

  const useInventoryItem = (id: string) => {
    const item = inventory.find(i => i.id === id);
    if (!item || item.quantity <= 0) return;

    // Simulate consumption effect
    let alertMsg = `คุณใช้ไอเทม ${item.name} เรียบร้อยแล้ว!`;
    if (playerProfile) {
      let updatedProfile = { ...playerProfile };
      if (item.name.includes('Atk Potion')) {
        updatedProfile.bio += ' [บัฟเพิ่มพลังกายพละกำลังทำงานอยู่]';
      } else if (item.name.includes('XP') || item.name.includes('Double EXP')) {
        updatedProfile.exp += 1500;
        let tempXp = updatedProfile.exp;
        let tempLvl = updatedProfile.level;
        while (tempXp >= updatedProfile.expNeeded) {
          tempXp -= updatedProfile.expNeeded;
          tempLvl += 1;
          updatedProfile.expNeeded = Math.floor(updatedProfile.expNeeded * 1.25);
        }
        updatedProfile.exp = tempXp;
        updatedProfile.level = tempLvl;
      }
      setPlayerProfile(updatedProfile);
      saveState('mmo_profile', updatedProfile);
    }

    setInventory(prev => {
      const nextInv = prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0);
      saveState('mmo_inventory', nextInv);
      return nextInv;
    });
  };

  const resetGameData = () => {
    localStorage.removeItem('mmo_isLoggedIn');
    localStorage.removeItem('mmo_isBlocked');
    localStorage.removeItem('mmo_profile');
    localStorage.removeItem('mmo_inventory');
    localStorage.removeItem('mmo_market');
    localStorage.removeItem('mmo_tickets');

    setIsLoggedIn(false);
    setIsBlocked(false);
    setPlayerProfile(null);
    setInventory(DEFAULT_INVENTORY);
    setMarketItems(INITIAL_MARKET_ITEMS);
    setSupportTickets([
      { id: 't1', title: 'ปัญหาตัดเงินไม่เข้า', category: 'Payment', description: 'โอนเงิน QR Code จำนวน 150 บาท ตั้งแต่เวลา 14:00 น. รอระบบยืนยันแป๊บเดียวแต่บัฟยังไม่เข้าครับ รบกวนตรวจสอบให้ที', status: 'Resolved', createdAt: '2026-05-22T14:30:00Z', reply: 'ทีมงานฝ่ายการเงินตรวจสอบสเตตเมนต์เรียบร้อย ได้ทำการเติม Points ยอดค้าง 150 Pts พร้อมแถมชดเชยแผ่นคูณ Exp สำเร็จแล้วครับ ขออภัยในความล้าช้า' }
    ]);
  };

  return (
    <GameContext.Provider value={{
      isLoggedIn,
      isBlocked,
      playerProfile,
      inventory,
      marketItems,
      supportTickets,
      setIsBlocked,
      login,
      register,
      logout,
      updateProfile,
      topUpPoints,
      buyPackage,
      claimBonusPackage,
      buyMarketItem,
      bidMarketItem,
      listMarketItem,
      addSupportTicket,
      claimDailyReward,
      gainSeasonExp,
      claimSeasonReward,
      changeClass,
      setGuildAndTown,
      useInventoryItem,
      resetGameData
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
