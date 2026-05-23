import { GameClass, LeaderboardUser, MarketItem } from './types';

export const GAME_CLASSES: GameClass[] = [
  {
    name: 'Warrior (นักรบ)',
    icon: 'Sword',
    description: 'ผู้พิทักษ์แห่งแนวหน้า มีพลังป้องกันและพลังชีวิตที่สูงที่สุด คอยรับแรงกระแทกและสกัดทางให้กับเพื่อนร่วมทีม',
    difficulty: 2,
    stats: { attack: 7, defense: 9, magic: 2, speed: 4 },
    skills: [
      { name: 'Shield Bash', desc: 'กระแทกโล่ใส่เป้าหมาย สร้างความเสียหายและทำให้มึนงง (Stun) 2 วินาที' },
      { name: 'Iron Will', desc: 'เพิ่มพลังป้องกันให้กับผู้ใช้ 50% และฟื้นฟูเลือดบางส่วนเป็นเวลา 10 วินาที' }
    ]
  },
  {
    name: 'Ranger (นักธนู)',
    icon: 'Compass',
    description: 'ผู้ชำนาญการโจมตีระยะไกล รวดเร็ว ว่องไว และมีความแม่นยำสูง คอยสร้างความเสียหายจากระยะที่ปลอดภัย',
    difficulty: 3,
    stats: { attack: 8, defense: 4, magic: 3, speed: 8 },
    skills: [
      { name: 'Arrow Rain', desc: 'ระดมยิงฝนลูกธนูลงบนพื้นที่ ทำความเสียหายต่อเนื่องแก่ศัตรูทั้งหมดในวงกว้าง' },
      { name: 'Windwalk', desc: 'เพิ่มความเร็วในการเคลื่อนที่ขึ้น 40% และหลบหลีกการโจมตีทางตรงชั่วคราว' }
    ]
  },
  {
    name: 'Mage (จอมเวท)',
    icon: 'Zap',
    description: 'ผู้ควบคุมพลังงานแห่งธรรมชาติและพลังเวทมนตร์ ปลดปล่อยพลังทำลายล้างสูงสุดและสร้างสมาธิชะลอศัตรู',
    difficulty: 4,
    stats: { attack: 10, defense: 2, magic: 10, speed: 3 },
    skills: [
      { name: 'Fireball Strike', desc: 'ยิงลูกบอลเพลิงระเบิดทำความเสียหายรุนแรง และทำให้เป้าหมายติดสถานะเผาไหม้' },
      { name: 'Blizzard storm', desc: 'แช่แข็งศัตรูในพื้นที่เป้าหมายด้วยพายุหิมะ ลดความเร็วในการเคลื่อนที่ลง 60%' }
    ]
  },
  {
    name: 'Healer (ผู้รักษา)',
    icon: 'Heart',
    description: 'ผู้แบกรับชะตากรรมของทีม มีเวทมนตร์เยียวยารักษา บัฟค่าสถานะ บินข้ามสิ่งกีดขวาง และชุบชีวิตเพื่อนร่วมทีม',
    difficulty: 3,
    stats: { attack: 4, defense: 6, magic: 8, speed: 5 },
    skills: [
      { name: 'Divine Cure', desc: 'ฟื้นฟูพลังชีวิตชั่วพริบตาให้แก่สมาชิกปาร์ตี้ทุกคน และลบล้างสถานะผิดปกติทั้งหมด' },
      { name: 'Sacred Shield', desc: 'สร้างเกราะเวทมนตร์ดูดซับความเสียหายให้กับเป้าหมาย พร้อมเพิ่มพลังโจมตีชั่วคราว' }
    ]
  },
  {
    name: 'Assassin (นักฆ่า)',
    icon: 'Flame',
    description: 'เงาสังหารที่ซุ่มคอยในราตรี โดดเด่นด้านพลังการทำลายเป้าหมายแบบปั่นป่วนและมีความเร็วสูงสุด',
    difficulty: 5,
    stats: { attack: 9, defense: 3, magic: 4, speed: 10 },
    skills: [
      { name: 'Shadow Step', desc: 'เคลื่อนที่วาร์ปไปด้านหลังศัตรูในพริบตา เพื่อการโจมตีคริติคอลที่รุนแรง' },
      { name: 'Toxin Blade', desc: 'เคลือบยาพิษใส่อาวุธ ทำให้การโจมตีติดสถานะพิษร้ายแรงเพื่อตอดเลือดเหยื่อ' }
    ]
  }
];

export const INITIAL_MARKET_ITEMS: MarketItem[] = [
  {
    id: 'm1',
    sellerName: 'DragonSlayer_99',
    itemName: 'ดาบเพลิงโลกันตร์ (Hellfire Greatsword)',
    price: 3500,
    quantity: 1,
    rarity: 'epic',
    category: 'Weapon',
    iconName: 'Sword',
    isAuction: true,
    currentBid: 3200,
    highestBidder: 'RichBoy_Vip',
    endsAt: '2026-05-25T18:00:00Z'
  },
  {
    id: 'm2',
    sellerName: 'Alchemist_Z',
    itemName: 'ยาฟื้นฟูมานาระดับสูงสุด (Elixir of Pure Mana)',
    price: 150,
    quantity: 10,
    rarity: 'rare',
    category: 'Consumable',
    iconName: 'GlassWater',
    isAuction: false
  },
  {
    id: 'm3',
    sellerName: 'Merchant_King',
    itemName: 'หมวกอัศวินมังกร (Dragon Lord Helm)',
    price: 12500,
    quantity: 1,
    rarity: 'legendary',
    category: 'Armor',
    iconName: 'Shield',
    isAuction: false
  },
  {
    id: 'm4',
    sellerName: 'Miner_Pro',
    itemName: 'แร่วารีบริสุทธิ์ (Prismatic Crystal Ore)',
    price: 80,
    quantity: 50,
    rarity: 'uncommon',
    category: 'Material',
    iconName: 'Gem',
    isAuction: false
  },
  {
    id: 'm5',
    sellerName: 'Shadow_Strike',
    itemName: 'มีดสั้นวายุ (Breeze Dagger)',
    price: 1200,
    quantity: 1,
    rarity: 'rare',
    category: 'Weapon',
    iconName: 'Sword',
    isAuction: true,
    currentBid: 950,
    highestBidder: 'ShadowHunter',
    endsAt: '2026-05-24T22:00:00Z'
  },
  {
    id: 'm6',
    sellerName: 'CatcherInTheDark',
    itemName: 'ปีกราตรีทมิฬ (Midnight Angel Wings)',
    price: 25000,
    quantity: 1,
    rarity: 'legendary',
    category: 'Cosmetic',
    iconName: 'Sparkles',
    isAuction: false
  }
];

export const LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: 'ExcaliburX', class: 'Warrior', guild: 'Valhalla', level: 120, exp: 9845012, kills: 2314, deaths: 145, gold: 12500000 },
  { rank: 2, name: 'Merlin_The_Wise', class: 'Mage', guild: 'ArchMage', level: 118, exp: 9245100, kills: 1845, deaths: 98, gold: 8640200 },
  { rank: 3, name: 'Robin_H00D', class: 'Ranger', guild: 'Woodland', level: 117, exp: 8945200, kills: 2110, deaths: 230, gold: 5120000 },
  { rank: 4, name: 'RichBoy_Vip', class: 'Assassin', guild: 'TheSindicate', level: 112, exp: 7451200, kills: 1420, deaths: 410, gold: 34500000 },
  { rank: 5, name: 'Mercy_Main', class: 'Healer', guild: 'Valhalla', level: 112, exp: 7412500, kills: 312, deaths: 89, gold: 1200000 },
  { rank: 6, name: 'Nightshade', class: 'Assassin', guild: 'TheSindicate', level: 110, exp: 6810200, kills: 1980, deaths: 512, gold: 4670000 },
  { rank: 7, name: 'Spellweaver', class: 'Mage', guild: 'ArchMage', level: 109, exp: 6245000, kills: 1120, deaths: 184, gold: 2901200 },
  { rank: 8, name: 'StoneWall_Bob', class: 'Warrior', guild: 'Ironclad', level: 108, exp: 5971400, kills: 845, deaths: 312, gold: 1450200 },
];

export const FAQ_DATA = [
  {
    question: 'เซิร์ฟเวอร์เปิดกี่โมงและมีกิจกรรมช่วงเวลาไหนบ้าง?',
    answer: 'เซิร์ฟเวอร์ของเราเปิดให้บริการแบบ 24/7 ไม่มีเวลาปิด ยกเว้นรอบปิดปรับปรุงประจำสัปดาห์ (วันพุธ 09:00 - 11:00 น.) กิจกรรมสงครามชิงเมือง (Guild War) จัดทุกวันพุธและเสาร์ เวลา 20:00 - 21:30 น. และกิจกรรม World Boss เกิดทุกวันเวลา 13:00, 18:00, และ 22:00 น.'
  },
  {
    question: 'แพ็กเกจ VIP นับเวลาอย่างไร?',
    answer: 'หลังจากได้รับสิทธิ์ VIP คุณจะได้รับการเปิดใช้งานวันใช้งานทันที โดยสิทธิประโยชน์สูงสุดจะเริ่มตั้งแต่วินาทีแรก สำหรับแพ็กเกจรายเดือน (30 วัน) และราย 6 เดือน (180 วัน) เมื่อหมดเวลา ระบบจะเปลี่ยนกลับมาเป็นสถาณะผู้ใช้ระดับปกติ โดยไม่มีการหักสิทธิ์หรือลบตัวละครใดๆ'
  },
  {
    question: 'ระบบคราฟต์ไอเทมและอุปกรณ์คำนวณอัตราความสำเร็จอย่างไร?',
    answer: 'อัตราความสำเร็จพื้นฐานจะถูกกำหนดโดยสูตรแต่ละชิ้น โดยสามารถเพิ่มโอกาสประสบความสำเร็จได้สูงสุดอีก 20% โดยการใส่แร่น้ำยาฟูรินต์เกรดสูงสุดในช่องบัฟสนับสนุน อุปกรณ์ที่คราฟต์ล้มเหลวจะคืนทรัพยากรพื้นฐาน 25-50% และไม่สูญเสียความทนทานถาวร'
  },
  {
    question: 'ซื้อแพ็กเกจ Elite แล้วจะได้สิทธิ์อะไรบ้าง?',
    answer: 'แพ็กเกจ Elite มอบสิทธิประโยชน์สูงสุด: ได้รับสัตว์เลี้ยงเกรดระดับตำนาน "Gilded Griffin, หมวก Elite Crown แอลเอฟเฟกต์สีทองถาวร, สมุดสถากลางฉายาเฉพาะ Elite, สิทธิ์กระโดดข้ามเลเวลซีซั่นพาส 10 เทียร์ และแต้ม 5,000 Points ที่นำไปใช้จ่ายช็อปได้ทันที'
  },
  {
    question: 'หากไอเทมตกหายไป หรือโดนขโมยในเมืองปลอยภัยทำอย่างไร?',
    answer: 'โดยปกติในเขตนครหลวงและปลอดภัย (Safe Zone) จะไม่มีระบบความเสียหายทางไอเทมหรือการถูกฉกชิงเด็ดขาด หากพบเจออาการบั๊กจนไอเทมในคลังสูญหาย สามารถส่งข้อมูลการทดสอบ /สกรีนช็อตรูปภาพ และรายละเอียดประวัติการกระทำเข้ามาผ่านคอลัมน์ซัพพอร์ต "แจ้งปัญหา (Ticket System)" เพื่อให้แอดมินดำเนินการตรวจสอบ Log ดึงคืนทันที'
  }
];

export const SHOP_CASH_ITEMS = [
  { id: 'sc1', name: 'Elite Double EXP Book (1 Hr)', price: 350, points: 350, category: 'Consumable', description: 'สมุดคูณค่าประสบการณ์ 2 เท่า เป็นเวลา 1 ชั่วโมง', isNew: true },
  { id: 'sc2', name: 'Guild Charter Voucher', price: 990, points: 990, category: 'Material', description: 'ใบประกาศสัญญาก่อตั้งสมาคม (ใช้ผ่านด่านสำหรับเปิดฟังก์ชันกิลด์เลเวล 1 ได้ทันที)', isNew: false },
  { id: 'sc3', name: 'Mount: Gilded Tiger (สัตว์พาหนะถาวร)', price: 2990, points: 2990, category: 'Cosmetic', description: 'เสือทองคำแห่งอรุโณทัย เพิ่มความเร็วการเดินบนพื้นราบ 80% ทรงคุณค่าและสง่างาม', isNew: true },
  { id: 'sc4', name: 'Reset Attribute Scroll', price: 450, points: 450, category: 'Consumable', description: 'รีเซ็ตแต้มสเตตัสทั้งหมดของตัวละครเพื่ออัปใหม่', isNew: false },
  { id: 'sc5', name: 'Chest of Legendaries (10x Secret Keys Included)', price: 1590, points: 1590, category: 'Consumable', description: 'หีบลึกลับสิบกุญแจทอง เปิดหาชิ้นส่วนคราฟต์ระดับสูงและอาวุธวิญญาณสเปกตรัม', isNew: true },
  { id: 'sc6', name: 'Insignia of Wealth Level Title', price: 2500, points: 2500, category: 'Cosmetic', description: 'ฉายานามทองคำ "มหาคหบดี" ลอยเหนือหัวตัวละคร ถิ่นความมั่งคั่งประดับเพชรระยิบระยับ', isNew: false }
];

export const PATCH_NOTES = [
  {
    date: '23 พ.ค. 2026',
    title: 'อัปเดตแพทช์เวอร์ชัน 2.4.5: สิ้นสุดอุทกภัยแห่งดินแดนนกยูง!',
    version: 'v2.4.5',
    category: 'Update',
    highlights: [
      'ปลดล็อกขีดจำกัดเลเวลตัวละครสูงสุดเป็นเลเวล 120 ท้าทายดันเจียนระดับพระราชวังโบราณ',
      'เพิ่มสายอาชีพย่อย และทักษะเฉพาะสายสำหรับนักดาบ และผู้รักษาเวทมนตร์',
      'ปรับสมดุลทักษะของ "ธนูล่องสายลม" ให้ลดดีเลย์การถอยตัวหนีลง 0.5 วินาที',
      'เปิดฤดูกาลศึกชิงความเป็นหนึ่งซีซัน 5 (Season Pass: Gilded Dragon) ของรางวัลสเปเชียลตี้จำกัดเวลา'
    ]
  },
  {
    date: '12 พ.ค. 2026',
    title: 'ปรับสมดุลระบบแอนตี้เจล และแก้ไขความคงที่ระบบเสถียรสหการ (Anti-DDoS)',
    version: 'v2.4.1',
    category: 'Security',
    highlights: [
      'อัปเกรดระบบตัวกรองป้องกันเลเยอร์ 7 ช่วยให้ผู้เล่นเพลิดเพลินโดยค่าปิงเสถียรที่ 15-25ms',
      'แก้ไขกระบวนการคลังแยกชิ้นไอเทม (Inventory splitting bug) ที่ส่งผลให้อัตราบิดดิ้งเสียหายชั่วคราว',
      'เริ่มแบนไอดีบอตและสแกนพฤติกรรมรวม 142 บัญชี เพื่อคงสังคมดีงามของตลาดเสรี'
    ]
  }
];

export const CRAFTING_RECIPES = [
  {
    name: 'กระบี่วารีสยบมังกร (Dragon Sea Blade)',
    successRate: 65,
    difficulty: 'ยากมาก (Elite)',
    ingredients: [
      { name: 'แร่คริสตัลม่วง (Purple Crystal)', qty: 10 },
      { name: 'หัวใจธาตุน้ำ (Essence of Water)', qty: 2 },
      { name: 'เหล็กกล้าใต้ทะเลลึก (Abyssal Steel)', qty: 15 }
    ],
    result: 'ดาบระดับ Epic มอบโบนัสสร้างพลังทำความเสียหายแก่สิ่งมีชีวิตประเภทสัตว์เลื้อยคลานและมังกรเพิ่มขึ้น 25%'
  },
  {
    name: 'ยาฟื้นฟูล้างคำสาป (Sanctuary Restoration Potion)',
    successRate: 90,
    difficulty: 'ง่าย (Common)',
    ingredients: [
      { name: 'สมุนไพรทรายทอง (Gold-Sand Herb)', qty: 5 },
      { name: 'น้ำทิพย์บริสุทธิ์ (Sacred Spring Water)', qty: 1 }
    ],
    result: 'ยาฟื้นฟูเลือดและมานา 50% พร้อมล้างสถานะสลายบัฟ หรือดีบัฟคำสะกดจิตในทันใด'
  },
  {
    name: 'เสื้อคลุมจอมพลเงาหมอก (Mist Vanguard Cloak)',
    successRate: 45,
    difficulty: 'สูงสุด (Legendary)',
    ingredients: [
      { name: 'หนังสัตว์ร้ายแห่งขุนเขา (Mountain Behemoth Leather)', qty: 8 },
      { name: 'เส้นใยทองดาวหาง (Comet Gold Thread)', qty: 20 },
      { name: 'ไอหม่นราตรี (Essence of Shadow Night)', qty: 4 }
    ],
    result: 'เกราะระดับสี่สายสับสังหาร เพิ่มค่าการหลบหลีกสูงสุด และมีสถานะหายตัวชั่วคราว 3 วินาทีทันทีที่โดนโจมตีวิกฤต'
  }
];

export const QUESTS_LIST = [
  { id: 'q1', title: 'ปราบราชาปีศาจโครงกระดูก (The Skeleton King Demise)', type: 'Boss Hunt', reward: '5,000 EXP, 200 Gold, 10 Ruby Piece', desc: 'กองทัพอสุรกายโครงกระดูกเข้าโจมตีหน้าด่านทิศใต้ จงร่วมมือกับปาร์ตี้เพื่อเผชิญหน้าและแก้ปัญหา', status: 'Available' },
  { id: 'q2', title: 'รวบรวมสมุนไพรรักษาไข้ป่า (Flora of the High Glades)', type: 'Gathering', reward: '1,500 EXP, 50 Gold, 5 Health Elixir', desc: 'สมุนไพรไข้ป่าหาได้ตามที่ราบสูงทางทิศเหนือ นำกลับมาให้หมอยาประจำป้อมปราการเพื่อปรุงยารักษาทหาร', status: 'In Progress' },
  { id: 'q3', title: 'ปราบฝูงหมาป่าพิทักษ์ถ้ำ (Lupine Infestation)', type: 'Extermination', reward: '2,800 EXP, 120 Gold, Custom Archer Boot', desc: 'ประชากรหมาป่าเพิ่มจำนวนอย่างรวดเร็วและบล็อกเส้นทางเหมืองแร่ กำจัดหมาป่าสีเทา 20 ตัวเพื่อกู้ดินแดน', status: 'Available' }
];

export const SEASON_PASS_REWARDS = [
  { level: 1, reward: '1,000 Gold + Premium: EXP Booster Scroll', premiumOnly: false, icon: 'Gift' },
  { level: 2, reward: 'Premium: 50 Custom Coins + Common Ring Box', premiumOnly: true, icon: 'Gem' },
  { level: 3, reward: 'Title "Novice Knight" อัปเกรดฉายา', premiumOnly: false, icon: 'Award' },
  { level: 4, reward: 'Premium: Gilded Key + Dragon Skin Dust', premiumOnly: true, icon: 'Key' },
  { level: 5, reward: '1x Level-Up Token บัฟสถิติทันใด', premiumOnly: false, icon: 'Sparkles' },
  { level: 6, reward: 'Premium: 100 Cash points (Points)', premiumOnly: true, icon: 'Coins' },
  { level: 7, reward: 'Mount Speed Upgrade Potion (ถาวร)', premiumOnly: false, icon: 'Compass' },
  { level: 8, reward: 'Premium: Insignia of Dragon Crown (S5 Limited)', premiumOnly: true, icon: 'Shield' }
];
