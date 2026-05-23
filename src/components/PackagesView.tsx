import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GameIcon } from './GameIcon';
import { motion } from 'motion/react';

interface PackagesViewProps {
  onNavigate: (tab: string) => void;
}

export const PackagesView: React.FC<PackagesViewProps> = ({ onNavigate }) => {
  const { playerProfile, buyPackage, claimBonusPackage } = useGame();
  
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const VIP_TIERS = [
    {
      id: 'sub-1m',
      name: '1 เดือน (รายเดือน)',
      desc: 'เหมาะสำหรับทริปสั้นสัมผัสความหรูหรา',
      duration: '1m',
      pointsCost: 150,
      perks: [
        'รับชื่อ VIP ตระกูลทองคำเหนือตัวละคร (+5% EXP)',
        'ลดอัตรารายตลาดประมูลเหลือ 1% (จาก 5%)',
        'เพิ่มโควต้าวางไอเทมขายเป็นสูงสุด 10 ชิ้นพร้อมกัน'
      ],
      badge: 'แนะนำเริ่มต้น',
      borderClass: 'border-t-4 border-t-purple-500'
    },
    {
      id: 'sub-6m',
      name: '6 เดือน (สุดคุ้มสุดประหยัด)',
      desc: 'เตรียมความพร้อมสำหรับผู้พิชิตอาณาจักรระยะกลาง',
      duration: '6m',
      pointsCost: 750, // Save 150 points
      perks: [
        'สิทธิพิเศษเหมือนรายเดือน 1 เดือนครบวงจร',
        'รับสัตว์เลี้ยงเหยี่ยวดาบน้ำแข็ง (Ice Raptor Pet) ถาวร',
        'รับกุญแจทองกล่องแห่งโชคชะตา 5 ชิ้นคืนประวัติ'
      ],
      badge: 'ความคุ้มค่าสูงสุด',
      borderClass: 'border-t-4 border-t-indigo-500 shadow-lg accent-glow',
      highlight: true
    },
    {
      id: 'sub-lifetime',
      name: 'ซื้อขาดตลอดชีพ (Lifetime)',
      desc: 'สูงสุดแห่งความคุ้มค่า ไม่ต้องคอยชำระรายเดือน มอบกรรมสิทธิ์ตลอดกาล',
      duration: 'lifetime',
      pointsCost: 1990,
      perks: [
        'เลเวลดั้งเดิม VIP ขีดสุดถาวรตลอดกาล',
        'ไม่มีความเสี่ยงวัน VIP หมดเวลาเล่น',
        'ปลดล็อกคลังเก็บของพกพาส่วนตัวในเกมฟรี 1 แถวยาว',
        'รับฉายานามแห่งยุคทอง "Infinite Sovereign"'
      ],
      badge: 'จำกัดเวลาตลอดชีพ',
      borderClass: 'border-t-4 border-t-amber-500'
    }
  ];

  const BONUS_TIERS = [
    {
      id: 'bonus-start',
      name: '🎁 Start Package',
      value: 'Start',
      pointsCost: 200,
      itemsDescription: 'หีบเซ็ตตั้งตัวด่วน 1 กล่อง + ทองโบนัส 5,000 Gold ทันที',
      colorClass: 'border-l-4 border-l-slate-400'
    },
    {
      id: 'bonus-pro',
      name: '🎁 Pro Package',
      value: 'Pro',
      pointsCost: 800,
      itemsDescription: 'หมีเกราะดิน (สัตว์เลี้ยงถาวร) + กุญแจกล่องเหล็ก 3 ดอก + ทองโบนัส 25,000 Gold',
      colorClass: 'border-l-4 border-l-purple-500 accent-glow-sm'
    },
    {
      id: 'bonus-elite',
      name: '🎁 Elite Package',
      value: 'Elite',
      pointsCost: 2500,
      itemsDescription: 'มงกุฎทองคำประดับเพชร (แฟชั่นถาวร) + ยาคูณ EXP 10% ถาวร + ทองโบนัส 100,000 Gold',
      colorClass: 'border-l-4 border-l-amber-500 shadow-xl'
    }
  ];

  const handleBuyVIP = (tier: typeof VIP_TIERS[0]) => {
    setSuccessMsg('');
    setErrorMsg('');
    
    if (!playerProfile) {
      setErrorMsg('กรุณาลงชื่อเข้าใช้ระบบก่อนดำเนินการสั่งซื้อ');
      return;
    }

    const success = buyPackage(tier.duration as any, tier.pointsCost);
    if (success) {
      setSuccessMsg(`สั่งซื้อแพ็กเกจ "${tier.name}" สำเร็จเรียบร้อยแล้ว! ขยายสถานะสิทธิ์ VIP ของคุณเรียบร้อยแล้ว`);
    } else {
      setErrorMsg(`แต้ม Points ของคุณไม่เพียงพอ (ต้องการ ${tier.pointsCost} Pts, คุณมีอยู่ ${playerProfile.points} Pts)`);
    }
  };

  const handleClaimBonus = (tier: typeof BONUS_TIERS[0]) => {
    setSuccessMsg('');
    setErrorMsg('');

    if (!playerProfile) {
      setErrorMsg('กรุณาลงชื่อเข้าใช้ระบบก่อนสมัครเคลมแพ็คเกจ');
      return;
    }

    const success = claimBonusPackage(tier.value as any, tier.pointsCost);
    if (success) {
      setSuccessMsg(`เคลมชุดรางวัลแพ็กเกจโบนัสพิเศษ "${tier.name}" สำเร็จ! ตรวจสอบทองและไอเทมได้ที่แท็บโปรไฟล์คลังสินค้า`);
    } else {
      setErrorMsg(`แต้ม Points ของคุณไม่เพียงพอสำหรับการเคลมโบนัสชิ้นนี้ (ต้องการ ${tier.pointsCost} Pts, คุณมีอยู่ ${playerProfile.points} Pts)`);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Dynamic Notifications */}
      {successMsg && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-4 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-bold">
            <GameIcon name="Check" size={16} />
            <span>{successMsg}</span>
          </div>
          <button id="nav-inv-p" onClick={() => onNavigate('profile')} className="px-4 py-1.5 bg-emerald-500 text-slate-950 rounded font-bold text-[10px] uppercase cursor-pointer">
            เปิดคลังสินค้า
          </button>
        </motion.div>
      )}

      {errorMsg && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl p-4 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-bold">
            <GameIcon name="AlertTriangle" size={16} />
            <span>{errorMsg}</span>
          </div>
          <button id="nav-shop-p" onClick={() => onNavigate('shop')} className="px-4 py-1.5 bg-purple-600 text-white rounded font-bold text-[10px] uppercase cursor-pointer accent-glow">
            เติมพอยท์ด่วน
          </button>
        </motion.div>
      )}

      {/* Package Section title */}
      <div>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <GameIcon name="Crown" className="text-purple-400" />
          สิทธิประโยชน์สภาผู้ใช้งานระดับสูง (Subscriber Packages)
        </h2>
        <p className="text-xs text-purple-300/80 leading-relaxed mt-1">
          ยื่นสมัครรับบัฟสถานะอภิสิทธิ์ชน VIP ด้วย Points, ลดอัตราหักค่าธรรมเนียมกลาง ช่วยให้ก้าวหน้าและรวยในเซิร์ฟเวอร์ไวขึ้น
        </p>
      </div>

      {/* Subscription cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {VIP_TIERS.map((tier) => (
          <div 
            key={tier.id}
            className={`glass rounded-2xl p-5 flex flex-col justify-between transition-all hover:scale-[1.01] ${tier.borderClass}`}
          >
            {/* Top Indicator */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] px-2.5 py-0.5 rounded-full uppercase font-black tracking-wider bg-purple-500/10 text-purple-300 border border-purple-500/20">
                {tier.badge}
              </span>
              {tier.highlight && (
                <span className="bg-indigo-600 text-white text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider">RECOMMENDED</span>
              )}
            </div>

            <div className="space-y-4 mt-4">
              <div>
                <h3 className="font-bold text-white text-lg">{tier.name}</h3>
                <p className="text-[11px] text-purple-300/60 mt-1 min-h-[32px] leading-relaxed">{tier.desc}</p>
              </div>

              {/* Price Tag */}
              <div className="glass-thin p-3 rounded-xl text-center font-mono">
                <span className="text-[9px] text-purple-300/50 block font-bold uppercase tracking-wider">สมาชิกเหมาจ่าย</span>
                <span className="text-2xl font-black text-purple-300">{tier.pointsCost} <span className="text-xs font-semibold">Points</span></span>
              </div>

              {/* Perks Checklist */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-black text-white uppercase tracking-wider block">สิทธิประโยชน์สูงสุด:</span>
                <ul className="space-y-2">
                  {tier.perks.map((p, idx) => (
                    <li key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5 leading-relaxed">
                      <span className="text-purple-400 font-bold mt-0.5">✔</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-5 border-t border-purple-500/10 mt-5">
              <button
                id={`buy-sub-btn-${tier.id}`}
                onClick={() => handleBuyVIP(tier)}
                className={`w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  tier.highlight
                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg accent-glow'
                    : 'bg-white/5 hover:bg-white/10 text-purple-200 border border-white/10'
                }`}
              >
                สั่งซื้อบัฟ VIP ชุดนี้
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bonus Packages Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <GameIcon name="Gift" className="text-purple-400" />
            โบนัสแพ็กเกจพิเศษหนุนผู้เล่น (One-Time Bonus Packs)
          </h3>
          <p className="text-xs text-purple-300/80 leading-relaxed mt-1">
            แพ็คเกจช่วยเหลือพิเศษเพื่อก้าวกระโดดข้ามเลเวล สุ่มรับไอเทมตกแต่งระดับตำนานและทองโบนัสในทันที ชำระเป็นแต้ม Points
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BONUS_TIERS.map((tier) => (
            <div 
              key={tier.id}
              className={`glass rounded-2xl p-5 flex flex-col justify-between transition-all hover:scale-[1.01] ${tier.colorClass}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm md:text-base">
                    {tier.name}
                  </h4>
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {tier.pointsCost} Pts
                  </span>
                </div>
                <div className="glass-thin p-3 rounded-xl">
                  <span className="text-[9px] text-purple-300/60 uppercase block font-bold tracking-wider mb-1">สิ่งที่จะได้รับ:</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {tier.itemsDescription}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-purple-500/10">
                <button
                  id={`claim-bonus-btn-${tier.id}`}
                  onClick={() => handleClaimBonus(tier)}
                  className="w-full py-2 bg-purple-600/20 hover:bg-purple-600 text-purple-100 hover:text-white text-xs font-bold rounded-lg border border-purple-500/20 transition-all cursor-pointer text-center"
                >
                  แลกรับโบนัสชุดนี้
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
