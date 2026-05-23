import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GameIcon } from './GameIcon';
import { PATCH_NOTES } from '../mockData';
import { motion } from 'motion/react';
import { GAME_CONFIG } from '../config';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const { playerProfile, claimDailyReward } = useGame();
  const [copiedIP, setCopiedIP] = useState(false);

  const handleCopyIP = () => {
    navigator.clipboard.writeText(GAME_CONFIG.SERVER_IP);
    setCopiedIP(true);
    setTimeout(() => setCopiedIP(false), 2000);
  };

  // Check if daily already claimed today
  const isClaimedToday = playerProfile?.lastClaimDate === new Date().toDateString();

  return (
    <div className="space-y-6">
      {/* Grid of Dynamic Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Server Status Widget */}
        <div className="glass rounded-2xl p-5 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-purple-500/10 pb-3">
            <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
              <GameIcon name="Activity" className="text-purple-400" />
              สถานะเซิร์ฟเวอร์ (Server Status)
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-mono tracking-wider font-bold">
              Online
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="glass-thin p-3 rounded-xl space-y-1">
              <div className="text-[10px] text-purple-300/60 uppercase font-mono">ผู้เล่นออนไลน์</div>
              <div className="text-lg font-bold text-white font-mono">{GAME_CONFIG.PLAYERS_ONLINE} / {GAME_CONFIG.PLAYERS_MAX}</div>
            </div>
            <div className="glass-thin p-3 rounded-xl space-y-1">
              <div className="text-[10px] text-purple-300/60 uppercase font-mono">ความลื่นไหล (TPS)</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">{GAME_CONFIG.SERVER_TPS} <span className="text-xs text-purple-300/40">/ 20</span></div>
            </div>
            <div className="glass-thin p-3 rounded-xl space-y-1">
              <div className="text-[10px] text-purple-300/60 uppercase font-mono">ความเสถียร (Ping)</div>
              <div className="text-lg font-bold text-indigo-400 font-mono">{GAME_CONFIG.SERVER_PING} ms</div>
            </div>
            <div className="glass-thin p-3 rounded-xl space-y-1">
              <div className="text-[10px] text-purple-300/60 uppercase font-mono">อัปไทม์ระบบ</div>
              <div className="text-xs font-bold text-white pt-1">{GAME_CONFIG.SERVER_UPTIME}</div>
            </div>
          </div>
        </div>

        {/* Daily Reward Widget */}
        <div className="glass rounded-2xl p-5 flex flex-col justify-between shadow-md">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-purple-500/10 pb-3">
              <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
                <GameIcon name="Calendar" className="text-purple-400" />
                ล็อกอินรับโบนัสรายวัน (Daily Reward)
              </h3>
              <span className="text-xs text-purple-300">ความต่อเนื่อง: {playerProfile?.dailyClaimedDays || 0}/7 วัน</span>
            </div>

            <p className="text-xs text-purple-300/80 leading-relaxed">
              รับทองฟรีสะสมได้ทุกวัน และเมื่อล็อกอินครบถึงวันที่ 7 จะได้รับคะแนนสะสม 100 Points และรับกล่องของรางวัลระดับมหาเศรษฐีฟรี!
            </p>

            {/* Micro grid for visual reward timeline */}
            <div className="grid grid-cols-7 gap-1 pt-1">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                const isClaimed = playerProfile && day <= playerProfile.dailyClaimedDays;
                const isCurrent = playerProfile && day === playerProfile.dailyClaimedDays + 1;
                return (
                  <div 
                    key={day} 
                    className={`rounded p-1 text-center transition-all ${
                      isClaimed 
                        ? 'bg-purple-900/40 text-purple-300 border border-purple-500/30 opacity-50' 
                        : isCurrent && !isClaimedToday
                        ? 'bg-purple-600/40 text-white border border-purple-500 ring-1 ring-purple-500/30 animate-pulse'
                        : 'glass-thin text-slate-500 border-purple-500/5'
                    }`}
                  >
                    <div className="text-[8px] font-mono leading-none">D {day}</div>
                    <div className="text-[10px] mt-0.5 flex justify-center">
                      <GameIcon name={day === 7 ? 'Crown' : day === 3 ? 'Gem' : 'Gift'} size={10} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4">
            <button
              id="claim-daily-btn"
              disabled={isClaimedToday}
              onClick={() => {
                claimDailyReward();
              }}
              className={`w-full py-2.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                isClaimedToday
                  ? 'bg-[#140e26]/50 text-slate-500 border border-purple-500/10 cursor-not-allowed'
                  : 'bg-indigo-600 text-white accent-glow hover:bg-indigo-500'
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                <GameIcon name="Check" size={14} />
                {isClaimedToday ? 'คุณรับของรางวัลวันนี้ไปแล้ว' : 'รับของรางวัลสำหรับวันนี้'}
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* Announcements and Recent Patch Notes */}
      <div className="glass rounded-2xl p-5 space-y-4 shadow-md">
        <div className="flex items-center justify-between border-b border-purple-500/10 pb-3">
          <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
            <GameIcon name="FileText" className="text-purple-400" />
            ข่าวสาร & อัปเดตรายการแพทช์โน้ตล่าสุด (Latest News & Patchnotes)
          </h3>
          <button 
            id="view-all-community"
            onClick={() => onNavigate('community')}
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            เปิดกระดานข่าวทั้งหมด
            <GameIcon name="ArrowUpRight" size={12} />
          </button>
        </div>

        <div className="space-y-4">
          {PATCH_NOTES.slice(0, 2).map((patch, index) => (
            <div 
              key={index} 
              className="group p-4 glass-thin hover:border-purple-500/30 transition-all rounded-xl space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                    patch.category === 'Update' ? 'bg-purple-500/15 text-purple-300 border border-purple-500/25 font-bold' : 'bg-rose-500/15 text-rose-300 border border-rose-500/25 font-bold'
                  }`}>
                    {patch.category}
                  </span>
                  <h4 className="font-bold text-white group-hover:text-purple-300 transition-colors text-sm md:text-base">
                    {patch.title}
                  </h4>
                </div>
                <span className="text-xs text-slate-500 font-mono">{patch.date}</span>
              </div>
              <ul className="list-disc pl-5 text-xs text-slate-400 space-y-1">
                {patch.highlights.slice(0, 2).map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
