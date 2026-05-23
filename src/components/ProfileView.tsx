import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GameIcon } from './GameIcon';
import { SEASON_PASS_REWARDS } from '../mockData';
import { motion, AnimatePresence } from 'motion/react';

export const ProfileView: React.FC = () => {
  const { 
    playerProfile, 
    inventory, 
    updateProfile, 
    changeClass, 
    setGuildAndTown, 
    useInventoryItem,
    gainSeasonExp,
    claimSeasonReward
  } = useGame();

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'inventory' | 'seasonpass' | 'mmo'>('profile');
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Profile edit fields
  const [editBio, setEditBio] = useState(playerProfile?.bio || '');
  const [isEditing, setIsEditing] = useState(false);

  // Guild/Town edit
  const [guildInput, setGuildInput] = useState(playerProfile?.guild || '');
  const [townInput, setTownInput] = useState(playerProfile?.town || '');

  // Map simulation state
  const [mapPoint, setMapPoint] = useState<string>('Arcadia (นครหลวง)');
  const [playerX, setPlayerX] = useState(145);
  const [playerZ, setPlayerZ] = useState(230);

  const mapLocations = [
    { name: 'Arcadia (นครหลวง)', x: 145, z: 230, desc: 'ศูนย์กลางอารยธรรมและกระดานตลาดค้าขาย', color: 'bg-indigo-500' },
    { name: 'Dragon Lair (ถ้ำมังกร)', x: 800, z: 95, desc: 'รังของราชามังกรเพลิง สถานที่ฟาร์มเลเวลระดับสูงสุด', color: 'bg-rose-500' },
    { name: 'Valhalla Guild-Camp', x: 410, z: 590, desc: 'ที่พักพิงแห่งขุนพลสมาคมวาลฮัลลา', color: 'bg-emerald-500' },
    { name: 'Skeleton Keep (หน้าด่าน)', x: 620, z: 410, desc: 'หน้าด่านทิศใต้ที่ทหารพยายามสะกัดการโจมตีราชาโครงกระดูก', color: 'bg-amber-500' }
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ bio: editBio });
    setIsEditing(false);
  };

  const handleSaveGuildTown = (e: React.FormEvent) => {
    e.preventDefault();
    setGuildAndTown(guildInput || null, townInput || null);
    setActionFeedback({ type: 'success', text: 'บันทึกการสังกัดกลุ่มสมาคมและเมืองสำเร็จ!' });
    setTimeout(() => setActionFeedback(null), 5000);
  };

  if (!playerProfile) {
    return (
      <div className="text-center p-8 text-slate-500 glass rounded-2xl">กรุณาลงชื่อเข้าใช้ระบบที่แท็บสมัครสมาชิกเพื่อจัดการโปรไฟล์</div>
    );
  }

  // Calculate KD
  const kd = (playerProfile.kills / Math.max(1, playerProfile.deaths)).toFixed(2);

  // Exp progress bar width
  const expProgress = (playerProfile.exp / playerProfile.expNeeded) * 100;

  return (
    <div className="space-y-6">
      
      {/* Action feedback alert banner */}
      {actionFeedback && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            actionFeedback.type === 'success' 
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold shadow' 
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold shadow'
          }`}
        >
          <GameIcon name={actionFeedback.type === 'success' ? 'Check' : 'AlertTriangle'} size={15} />
          <span>{actionFeedback.text}</span>
        </motion.div>
      )}

      {/* Sub tabs navigation */}
      <div className="flex border-b border-purple-500/10 gap-2 pb-px overflow-x-auto">
        <button
          id="profile-tab-main"
          onClick={() => setActiveSubTab('profile')}
          className={`px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeSubTab === 'profile' 
              ? 'border-purple-500 text-white' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <GameIcon name="User" size={13} />
          👤 ข้อมูลตัวละคร & สถิติ (Profile & Stats)
        </button>

        <button
          id="profile-tab-inv"
          onClick={() => setActiveSubTab('inventory')}
          className={`px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeSubTab === 'inventory' 
              ? 'border-purple-500 text-white' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <GameIcon name="Package" size={13} />
          🎒 คลังสินค้าแยกชิ้น (BACKPACK)
        </button>

        <button
          id="profile-tab-mmo"
          onClick={() => setActiveSubTab('mmo')}
          className={`px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeSubTab === 'mmo' 
              ? 'border-purple-500 text-white' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <GameIcon name="Compass" size={13} />
          ⚔ ระบบในเกม (MMO Systems & Map)
        </button>

        <button
          id="profile-tab-season"
          onClick={() => setActiveSubTab('seasonpass')}
          className={`px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeSubTab === 'seasonpass' 
              ? 'border-purple-500 text-white' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <GameIcon name="Crown" size={13} />
          🌟 ซีซั่นแบทเทิลพาส (Season Pass)
        </button>
      </div>

      {/* RENDER PROFILE SUBTAB CONTENT */}
      {activeSubTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
          
          {/* Main Visual box */}
          <div className="lg:col-span-12 xl:col-span-5 glass border border-purple-500/10 rounded-2xl p-6 text-center space-y-6 relative overflow-hidden shadow-md">
            <div className="absolute right-0 top-0 -mr-16 -mt-16 h-36 w-36 rounded-full bg-purple-500/5 blur-2xl"></div>
            
            <div className="mx-auto w-20 h-20 rounded-full bg-[#140e26]/60 border border-purple-500/20 flex items-center justify-center text-4xl shadow-lg">
              {playerProfile.avatar || '🛡️'}
            </div>

            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 font-bold border border-purple-500/20 text-[10px] tracking-widest uppercase font-mono">
                {playerProfile.class}
              </span>
              <h3 className="text-2xl font-black text-white mt-3">{playerProfile.name}</h3>
              <p className="text-xs text-purple-300/40 font-mono mt-0.5">{playerProfile.email}</p>
            </div>

            {/* EXP Progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] uppercase text-purple-300/80 font-mono font-bold">
                <span>เลเวล {playerProfile.level}</span>
                <span>EXP: {playerProfile.exp} / {playerProfile.expNeeded} ({expProgress.toFixed(0)}%)</span>
              </div>
              <div className="h-2 w-full bg-[#140e26]/80 rounded-full overflow-hidden border border-purple-500/5">
                <div className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full" style={{ width: `${expProgress}%` }}></div>
              </div>
            </div>

            {/* Bio box editing */}
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-2.5 text-left">
                <label className="text-xs text-purple-200 font-bold">คำอธิบายประวัติส่วนตัว:</label>
                <textarea
                  id="profile-bio-textarea"
                  rows={2}
                  maxLength={100}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-slate-950/70 border border-purple-500/20 text-xs text-white rounded-lg p-2.5 focus:outline-none focus:border-purple-500 font-sans"
                  required
                />
                <div className="flex gap-2 justify-end">
                  <button id="save-bio-btn" type="submit" className="bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow">บันทึก</button>
                  <button id="cancel-bio-btn" type="button" onClick={() => setIsEditing(false)} className="bg-slate-900 border border-white/5 text-slate-400 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer">ยกเลิก</button>
                </div>
              </form>
            ) : (
              <div className="space-y-3 pt-2">
                <p className="text-xs text-slate-300 italic">
                  "{playerProfile.bio || 'ไม่มีคำคมประดับประดาประวัติ'}"
                </p>
                <button
                  id="edit-bio-btn"
                  onClick={() => setIsEditing(true)}
                  className="text-[10px] text-purple-400 hover:text-purple-300 font-bold flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                >
                  <GameIcon name="Settings" size={11} />
                  แก้ไขคำโปรยบอร์ดส่วนตัว
                </button>
              </div>
            )}

            {/* Package status card */}
            <div className="glass-thin p-4 border border-purple-500/10 rounded-xl text-left space-y-1">
              <span className="text-[10px] uppercase text-purple-300/40 font-mono block font-bold tracking-wider">สถานะแพ็กเกจ (Subscription Benefit):</span>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${playerProfile.packageStatus !== 'None' ? 'text-amber-400' : 'text-slate-450 text-slate-400'}`}>
                  ⭐ {playerProfile.packageStatus !== 'None' ? playerProfile.packageStatus : 'ไม่มีแพ็กเกจที่เปิดใช้งาน (ธรรมดา)'}
                </span>
                {playerProfile.packageStatus !== 'None' && (
                  <span className="text-[9px] text-purple-300/40 font-mono font-bold">หมดสิ้นอายุ: {playerProfile.packageExpiry}</span>
                )}
              </div>
            </div>
          </div>

          {/* Stats details & transactions */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-6">
            
            {/* Kill stats */}
            <div className="glass rounded-2xl p-5 space-y-4 shadow-md border-purple-500/15">
              <h4 className="font-bold text-white text-sm border-b border-purple-500/10 pb-2 flex items-center gap-1.5">
                <GameIcon name="Award" className="text-purple-400" />
                สถิติผู้เล่น (Combat & Wealth Statistics)
              </h4>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="glass-thin p-3.5 rounded-xl border border-purple-500/10 text-center">
                  <span className="text-[9px] text-purple-300/40 uppercase font-mono block font-black tracking-wider">สังหาร (Kills)</span>
                  <span className="text-xl font-black text-rose-400 font-mono mt-1 block">{playerProfile.kills}</span>
                </div>
                <div className="glass-thin p-3.5 rounded-xl border border-purple-500/10 text-center">
                  <span className="text-[9px] text-purple-300/40 uppercase font-mono block font-black tracking-wider">เสียชีวิต (Deaths)</span>
                  <span className="text-xl font-black text-slate-400 font-mono mt-1 block">{playerProfile.deaths}</span>
                </div>
                <div className="glass-thin p-3.5 rounded-xl border border-purple-500/10 text-center">
                  <span className="text-[9px] text-purple-300/40 uppercase font-mono block font-black tracking-wider">K/D Ratio</span>
                  <span className="text-xl font-black text-purple-300 font-mono mt-1 block">{kd}</span>
                </div>
                <div className="glass-thin p-3.5 rounded-xl border border-purple-500/10 text-center flex flex-col justify-center">
                  <span className="text-[9px] text-purple-300/40 uppercase font-mono block font-black tracking-wider">ความมั่งคั่ง</span>
                  <span className="text-xs font-black text-amber-400 mt-1 block uppercase tracking-wide">ระดับอัศวิน</span>
                </div>
              </div>
            </div>

            {/* Guild Town edit */}
            <div className="glass rounded-2xl p-5 space-y-3 shadow-md border-purple-500/15">
              <h4 className="font-bold text-white text-sm border-b border-purple-500/10 pb-2 flex items-center gap-1.5">
                <GameIcon name="Compass" className="text-purple-400" />
                ข้อมูลสังกัดกิลด์และดินแดนเมือง เกิด (Guild & Town Alignment)
              </h4>
              
              <form onSubmit={handleSaveGuildTown} className="space-y-3.5 font-sans text-xs pt-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-purple-200 font-bold">กลุ่มกิลด์สมาชิก (Guild):</label>
                    <input
                      id="guild-input"
                      type="text"
                      placeholder="เช่น Valhalla"
                      value={guildInput}
                      onChange={(e) => setGuildInput(e.target.value)}
                      className="w-full bg-slate-950/70 border border-purple-500/20 text-xs text-white rounded-lg p-2.5 focus:outline-none focus:border-purple-500 font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-purple-200 font-bold">ดินแดนเมืองเกิดหลัก (Town):</label>
                    <input
                      id="town-input"
                      type="text"
                      placeholder="เช่น Arcadia"
                      value={townInput}
                      onChange={(e) => setTownInput(e.target.value)}
                      className="w-full bg-slate-950/70 border border-purple-500/20 text-xs text-white rounded-lg p-2.5 focus:outline-none focus:border-purple-500 font-semibold"
                    />
                  </div>
                </div>
                <button
                  id="save-guild-town-btn"
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 font-bold text-xs text-white rounded-lg shadow cursor-pointer transition-all accent-glow"
                >
                  ยื่นจดทะเบียนเข้ากลุ่มภูมิภาค
                </button>
              </form>
            </div>

          </div>

        </div>
      )}

      {activeSubTab === 'inventory' && (
        <div className="space-y-4">
          <div className="border-b border-purple-500/10 pb-2.5 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-white text-base">🎒 คลังเก็บของพกพาส่วนตัว (Character Backpack)</h3>
              <p className="text-xs text-purple-300/80 leading-relaxed">คุณสามารถเปิดใช้หรือติดตั้งวัตถุดิบและอุปกรณ์ฟิวชั่นที่มีอยู่เพื่อรับค่าสะสมตัวละคร</p>
            </div>
            <span className="text-xs font-mono text-purple-300 font-bold bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-lg">ช่องเก็บ: {inventory.length}/50</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {inventory.map((item) => (
              <div 
                key={item.id} 
                className="glass hover:scale-[1.01] hover:border-purple-500/20 p-4 rounded-2xl flex flex-col justify-between space-y-3 transition-all shadow-md"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg bg-slate-950 border ${
                      item.rarity === 'legendary' ? 'border-amber-500 text-amber-400' :
                      item.rarity === 'epic' ? 'border-purple-500 text-purple-400' :
                      item.rarity === 'rare' ? 'border-blue-500 text-blue-400' : 'border-slate-800 text-slate-400'
                    }`}>
                      <GameIcon name={item.iconName} size={15} />
                    </div>
                    <span className="text-xs font-bold text-white truncate">{item.name}</span>
                  </div>

                  <p className="text-[11px] text-slate-300 font-medium leading-relaxed mt-2.5 min-h-[32px]">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-purple-500/10 flex items-center justify-between gap-2 mt-1">
                  <span className="text-[10px] text-purple-300 font-mono font-bold">จำนวน: x{item.quantity}</span>
                  
                  {item.category === 'Consumable' && (
                    <button
                      id={`use-inv-btn-${item.id}`}
                      onClick={() => {
                        useInventoryItem(item.id);
                        setActionFeedback({ type: 'success', text: `ใช้งานไอเทมสำเร็จ: ${item.name} บัฟหรือคุณสมบัติสะสมได้รับการเปิดใช้งานแล้ว!` });
                        setTimeout(() => setActionFeedback(null), 5000);
                      }}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] rounded-lg transition-all cursor-pointer"
                    >
                      เปิดกิน/ใช้งาน
                    </button>
                  )}
                </div>
              </div>
            ))}

            {inventory.length === 0 && (
              <div className="col-span-full text-center p-8 text-xs text-slate-500 glass border border-purple-500/10 rounded-2xl">
                กระเป๋าเดินทางของคุณว่างเปล่า ลองไปเปิดแคชช็อปหรือซื้อโบราณวัตถุในตลาดผู้เล่นดู!
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'mmo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* MMO controls */}
          <div className="lg:col-span-5 glass border border-purple-500/10 rounded-2xl p-5 space-y-4 shadow-md">
            <div className="border-b border-purple-500/10 pb-2">
              <h4 className="font-bold text-white text-sm">⚔ ระบบบริหารอาชีพในเกม (In-Game Class Switcher)</h4>
              <p className="text-[10px] text-purple-300/60 mt-0.5">เปลี่ยนสายอาชีพหลักของตัวละครเพื่อประครองความถนัดเซ็ตชุดต่างแบบเร่งด่วน</p>
            </div>

            <div className="space-y-2">
              {['Warrior (นักรบ)', 'Ranger (นักธนู)', 'Mage (จอมเวท)', 'Healer (ผู้รักษา)', 'Assassin (นักฆ่า)'].map((cls) => {
                const isActive = playerProfile.class === cls;
                return (
                  <button
                    key={cls}
                    id={`class-switch-btn-${cls}`}
                    onClick={() => changeClass(cls)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between text-xs cursor-pointer ${
                      isActive 
                        ? 'glass-thin border-purple-500 text-white font-bold' 
                        : 'bg-black/25 border-purple-500/10 hover:border-purple-500/25 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{cls}</span>
                    {isActive ? (
                      <span className="text-purple-400 font-black uppercase text-[9px] tracking-wider">ACTIVE</span>
                    ) : (
                      <span className="text-[9px] text-purple-300/60 font-bold hover:text-purple-350">สลับอาชีพ</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="glass-thin p-3.5 rounded-xl border border-purple-500/10 space-y-1.5 text-xs text-slate-300 font-sans leading-relaxed font-medium">
              <p>
                <span className="font-bold text-white">หมายเหตุสำคัญ:</span> การพึ่งพาการสลับสายอาชีพตัวละครเป็นสัญชาติจำลองฟรี ไม่หักตอมพอยท์ แต่ควรสวมเกราะและอาวุธให้สอดคล้องกันที่กระเป๋วเก็บของเซิร์ฟเพื่อหลีกเลี่ยงบัฟหักล้าง
              </p>
            </div>
          </div>

          {/* Map display simulation */}
          <div className="lg:col-span-7 glass border border-purple-500/10 rounded-2xl p-5 space-y-4 shadow-md">
            <div className="border-b border-purple-500/10 pb-2 flex justify-between items-center text-xs">
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <GameIcon name="Compass" className="text-purple-400 animate-spin" size={14} />
                แผนที่โลกไดนามิกจำลอง (Simulated Dynmap / Lands)
              </h4>
              <span className="text-[9px] font-mono text-purple-400 bg-purple-950/30 px-2 py-0.5 rounded border border-purple-500/10">GPS ACTIVE</span>
            </div>

            <p className="text-xs text-purple-300/80 font-medium">
              พิกัดผู้เล่นพัดลอย: <span className="font-bold text-white font-mono">X: {playerX} | Z: {playerZ}</span> กำลังพำนักที่เมือง: <span className="font-bold text-purple-300">{mapPoint}</span>
            </p>

            {/* Simulated map frame */}
            <div className="glass-thin rounded-2xl border border-purple-500/20 bg-black/40 p-2 h-[220px] relative overflow-hidden flex flex-col justify-between shadow-inner">
              
              {/* Fake contour map gridlines and icons */}
              <div className="absolute inset-0 bg-radial-gradient flex flex-wrap gap-4 p-4 opacity-15 pointer-events-none select-none">
                {[...Array(60)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                ))}
              </div>

              {/* Locations markers */}
              {mapLocations.map((loc) => {
                const isActive = mapPoint === loc.name;
                return (
                  <button
                    key={loc.name}
                    id={`map-loc-${loc.name}`}
                    onClick={() => {
                       setMapPoint(loc.name);
                       setPlayerX(loc.x);
                       setPlayerZ(loc.z);
                       gainSeasonExp(20); // reward slightly for map exploration
                       setActionFeedback({ type: 'success', text: `วาร์ปไปที่ดินแดนใหม่สำเร็จ! ได้รับ 20 EXP ซีซั่นแบทเทิลพาสสำหรับการสำรวจพิกัด X: ${loc.x} Z: ${loc.z}` });
                       setTimeout(() => setActionFeedback(null), 4000);
                    }}
                    className={`absolute p-1 bg-slate-900/90 border rounded-lg text-left text-[9px] transition-all hover:scale-105 cursor-pointer ${
                      isActive ? 'border-purple-500 ring-1 ring-purple-500' : 'border-purple-500/20'
                    }`}
                    style={{
                      left: `${(loc.x / 1000) * 80 + 10}%`,
                      top: `${(loc.z / 800) * 60 + 10}%`
                    }}
                  >
                    <span className="font-bold text-white flex items-center gap-1 leading-none">
                      <span className={`w-1.5 h-1.5 rounded-full ${loc.color} shrink-0`} />
                      {loc.name.split(' (')[0]}
                    </span>
                  </button>
                );
              })}

              <div className="z-10 mt-auto bg-slate-900/95 border border-purple-500/15 p-2.5 rounded-xl text-[10px] text-slate-300 max-w-[280px] shadow">
                <span className="font-bold text-white block mb-0.5 uppercase tracking-wide text-[9px] text-purple-300">ลักษณะแผ่นดิน:</span>
                {mapLocations.find(l => l.name === mapPoint)?.desc}
              </div>
            </div>

            <div className="text-[10px] text-slate-500 font-medium italic text-center">
              *คลิกปุ่มจุดแผงแลนด์มาร์กบนแผนที่จำลองด้านบนเพื่อสแกนวาร์ปกิลด์ สลัมรังมังกร หรือหน้าด่านทหารโครงกระดูก!
            </div>
          </div>

        </div>
      )}

      {activeSubTab === 'seasonpass' && (
        <div className="glass border border-purple-500/10 rounded-2xl p-6 space-y-6 font-sans shadow-md">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-500/10 pb-4">
            <div className="space-y-1">
              <span className="text-[9px] bg-amber-500/15 text-amber-300 font-mono font-bold px-2 py-0.5 rounded border border-amber-500/30">SEASON 5: GILDED DRAGON</span>
              <h3 className="text-xl font-bold text-white flex items-center gap-1.5 mt-1.5">
                <GameIcon name="Crown" className="text-amber-400" />
                แบทเทิลพาสพิทักษ์มังกร (Battle Pass Timeline)
              </h3>
            </div>

            <div className="text-right">
              <span className="text-xs text-purple-300/40 font-mono block font-black uppercase tracking-wider">เอกสิทธิ์ซีซั่นพาส:</span>
              <span className={`text-xs font-black uppercase ${playerProfile.seasonPassPremium ? 'text-amber-400' : 'text-slate-400'}`}>
                {playerProfile.seasonPassPremium ? '★ PREMIUM PASS ACTIVE' : 'FREE PASS (ระดับเริ่มต้น)'}
              </span>
            </div>
          </div>

          {/* Progression stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-thin p-3.5 border border-purple-500/10 rounded-xl text-center">
              <span className="text-[10px] text-purple-300/40 block font-bold uppercase tracking-wider">เทียร์ซีซั่นปัจจุบัน (Level)</span>
              <span className="text-2xl font-black text-white font-mono block mt-1">Lv. {playerProfile.seasonPassLevel}</span>
            </div>
            <div className="glass-thin p-3.5 border border-purple-500/10 rounded-xl text-center col-span-2 space-y-2">
              <div className="flex justify-between text-[10px] text-purple-300 font-mono font-bold">
                <span>ความคืบหน้าค่าพาส (EXP: {playerProfile.seasonPassExp}/150)</span>
                <span>เหลืออีก {150 - playerProfile.seasonPassExp} EXP เพื่อปรับเทียร์</span>
              </div>
              <div className="h-2 w-full bg-[#140e26]/80 rounded-full border border-purple-500/5 overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: `${(playerProfile.seasonPassExp / 150) * 100}%` }}></div>
              </div>
            </div>
          </div>

          {/* Premium pass activation simulation button */}
          {!playerProfile.seasonPassPremium && (
            <div className="bg-gradient-to-r from-amber-600/10 via-amber-950/40 to-black/30 border border-amber-500/30 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-amber-200/90 leading-relaxed font-sans max-w-lg">
                <span className="font-bold text-white block">★ อัปเกรดเป็นชุด Premium Pass เพื่อปลดล็อครางวัลแถวพรีเม็มพิเศษ</span>
                รับชุดเกราะมังกรคราฟต์ มงกุฎโบราณ S5 เหรียญกษาปณ์ทองคำ และบัฟเพิ่มแรงใจอัศวิน ตลอดชีพแคมเปญเพียง 500 Points!
              </p>
              <button
                id="unlock-premium-pass-btn"
                onClick={() => {
                  if (playerProfile.points >= 500) {
                     updateProfile({
                       points: playerProfile.points - 500,
                       seasonPassPremium: true
                     });
                     setActionFeedback({ type: 'success', text: 'อัปเกรดแบทเทิลพาสพรีเมี่ยม ซีซัน 5 สำเร็จแล้ว!' });
                  } else {
                     setActionFeedback({ type: 'error', text: 'Points ของคุณมีไม่พอสำหรับการอัปเกรดพาสพรีเมี่ยม กรุณาเติมพอยท์ในหน้าช็อป' });
                  }
                  setTimeout(() => setActionFeedback(null), 5500);
                }}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black text-xs rounded-lg transition uppercase whitespace-nowrap cursor-pointer shadow-md"
              >
                ปลดพาสพรีเมี่ยม 500 Pts
              </button>
            </div>
          )}

          {/* Timeline slider of rewards level 1 to 8 */}
          <div className="space-y-4">
            <span className="text-[10px] font-black text-purple-300 uppercase tracking-wider block">ลำดับรายการของเทียร์รางวัลซีซั่น:</span>
            
            <div className="space-y-3">
              {SEASON_PASS_REWARDS.map((reward) => {
                const canClaim = playerProfile.seasonPassLevel >= reward.level;
                const isPremiumOnlyAndNotOwned = reward.premiumOnly && !playerProfile.seasonPassPremium;
                return (
                  <div 
                    key={reward.level}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                      canClaim && !isPremiumOnlyAndNotOwned
                        ? 'glass border-purple-500/20'
                        : 'glass-thin border-purple-500/5 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-black/35 border ${
                        canClaim ? 'border-amber-500 text-amber-400' : 'border-slate-800 text-slate-400'
                      }`}>
                        <GameIcon name={reward.icon} size={15} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold text-purple-300">เทียร์ {reward.level}</span>
                          {reward.premiumOnly && (
                            <span className="text-[8px] bg-amber-500/20 text-amber-400 border border-amber-500/35 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                              Premium Only
                            </span>
                          )}
                        </div>
                        <h4 className="text-white text-xs font-bold leading-snug mt-1">{reward.reward}</h4>
                      </div>
                    </div>

                    <div>
                      {canClaim ? (
                        isPremiumOnlyAndNotOwned ? (
                          <span className="text-[10px] text-rose-400 font-bold flex items-center gap-1">
                            🔒 พาสเริ่มต้นธรรมดา เคลมพรีเมี่ยมไม่ได้
                          </span>
                        ) : (
                          <button
                            id={`claim-pass-tier-${reward.level}`}
                            onClick={() => {
                              claimSeasonReward(reward.level);
                              setActionFeedback({ type: 'success', text: `คุณได้รับการเคลมของรางวัล เทียร์ ${reward.level} เข้าช่อง Backpack เรียบร้อยแล้ว!` });
                              setTimeout(() => setActionFeedback(null), 5000);
                            }}
                            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold rounded-lg transition-all cursor-pointer shadow-sm"
                          >
                            เคลมของเข้ากระเป๋า
                          </button>
                        )
                      ) : (
                        <span className="text-[10px] text-slate-500 font-bold block bg-[#140e26]/50 px-2.5 py-1 rounded-lg border border-purple-500/5">
                          ต้องใช้ Lv.{reward.level} ของพาสซีซั่น
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
