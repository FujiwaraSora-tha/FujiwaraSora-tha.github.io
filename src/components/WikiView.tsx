import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GameIcon } from './GameIcon';
import { GAME_CLASSES, CRAFTING_RECIPES, QUESTS_LIST } from '../mockData';
import { motion, AnimatePresence } from 'motion/react';

export const WikiView: React.FC = () => {
  const { playerProfile, updateProfile } = useGame();
  
  const [activeSubTab, setActiveSubTab] = useState<'classes' | 'craft' | 'quests'>('classes');
  
  // Custom class selected
  const [selectedClassIdx, setSelectedClassIdx] = useState(0);

  // Crafting simulator state
  const [activeRecipeIdx, setActiveRecipeIdx] = useState(0);
  const [craftAnimation, setCraftAnimation] = useState<'idle' | 'crafting' | 'success' | 'fail'>('idle');
  const [craftLogs, setCraftLogs] = useState<string[]>([]);

  // Simulation state for complete quests
  const [quests, setQuests] = useState(QUESTS_LIST);

  const curClass = GAME_CLASSES[selectedClassIdx];

  const handleCraftSim = () => {
    const targetRecipe = CRAFTING_RECIPES[activeRecipeIdx];
    setCraftAnimation('crafting');

    setTimeout(() => {
      // Roll random 1-100
      const dice = Math.floor(Math.random() * 100) + 1;
      const success = dice <= targetRecipe.successRate;

      if (success) {
        setCraftAnimation('success');
        setCraftLogs(prev => [`🎉 [${new Date().toLocaleTimeString('th-TH')}] คราฟต์สำเร็จ! คุณได้รับ: "${targetRecipe.name}"`, ...prev.slice(0, 4)]);
        
        // Reward player in profile
        if (playerProfile) {
          const goldBonus = 500; // pocket change reward
          updateProfile({
            gold: playerProfile.gold + goldBonus,
            exp: playerProfile.exp + 100
          });
        }
      } else {
        setCraftAnimation('fail');
        setCraftLogs(prev => [`❌ [${new Date().toLocaleTimeString('th-TH')}] คราฟต์ล้มเหลว! วัตถุดิบสลายไป 50% หรือได้รับแร่ฝึกสลายพื้นฐาน`, ...prev.slice(0, 4)]);
      }
    }, 1200);
  };

  const handleTriggerQuest = (id: string, actionType: 'accept' | 'complete') => {
    setQuests(prev => prev.map(q => {
      if (q.id === id) {
        if (actionType === 'accept') {
          return { ...q, status: 'In Progress' };
        } else {
          // Grant reward simulation
          if (playerProfile) {
            const gainedGold = q.reward.includes('200 Gold') ? 200 : q.reward.includes('120 Gold') ? 120 : 50;
            const gainedExp = q.reward.includes('5,000 EXP') ? 1000 : q.reward.includes('2,800 EXP') ? 450 : 200;
            
            let tempExp = playerProfile.exp + gainedExp;
            let tempLvl = playerProfile.level;
            while (tempExp >= playerProfile.expNeeded) {
              tempExp -= playerProfile.expNeeded;
              tempLvl += 1;
            }

            updateProfile({
              gold: playerProfile.gold + gainedGold,
              exp: tempExp,
              level: tempLvl
            });
          }
          return { ...q, status: 'Completed' };
        }
      }
      return q;
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Sub tabs navigation */}
      <div className="flex border-b border-purple-500/10 gap-2 pb-px overflow-x-auto">
        <button
          id="wiki-tab-classes"
          onClick={() => setActiveSubTab('classes')}
          className={`px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeSubTab === 'classes' 
              ? 'border-purple-500 text-white' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <GameIcon name="Swords" size={13} />
          ⚔ ดินแดนสายอาชีพ (Classes & Races)
        </button>

        <button
          id="wiki-tab-craft"
          onClick={() => setActiveSubTab('craft')}
          className={`px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeSubTab === 'craft' 
              ? 'border-purple-500 text-white' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <GameIcon name="Settings" size={13} />
          ⚙ แท่นคราฟต์สูตรวัตถุดิบ (Crafting Simulator)
        </button>

        <button
          id="wiki-tab-quests"
          onClick={() => setActiveSubTab('quests')}
          className={`px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeSubTab === 'quests' 
              ? 'border-purple-500 text-white' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <GameIcon name="FileText" size={13} />
          📜 กระดานภารกิจราชการ (Quest Board)
        </button>
      </div>

      {/* SUBTAB CONTENT RENDERING */}
      {activeSubTab === 'classes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* List of classes to select */}
          <div className="lg:col-span-4 space-y-2 h-fit">
            <span className="text-[10px] font-black text-white uppercase tracking-wider block mb-2">เลือกเพื่อเปิดสารานุกรม:</span>
            {GAME_CLASSES.map((g, idx) => (
              <button
                key={g.name}
                id={`wiki-class-select-${idx}`}
                onClick={() => setSelectedClassIdx(idx)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center gap-3 cursor-pointer ${
                  selectedClassIdx === idx
                    ? 'glass-thin border-purple-500 text-white shadow-md'
                    : 'glass border-purple-500/5 hover:border-purple-500/15 text-slate-400 hover:text-white hover:scale-[1.005]'
                }`}
              >
                <div className={`p-2.5 rounded-lg ${
                  selectedClassIdx === idx ? 'bg-purple-600 text-white' : 'bg-slate-950 text-purple-400'
                }`}>
                  <GameIcon name={g.icon} size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-xs md:text-sm">{g.name}</h4>
                  <span className="text-[9px] text-purple-300/40 leading-none">ความยากระดับ: {g.difficulty}/5</span>
                </div>
              </button>
            ))}
          </div>

          {/* Details visual representer */}
          <div className="lg:col-span-8 glass border border-purple-500/10 rounded-2xl p-6 space-y-6 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-500/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl">
                  {curClass.name.includes('Warrior') ? '⚔️' :
                   curClass.name.includes('Ranger') ? '🏹' :
                   curClass.name.includes('Mage') ? '🧙' :
                   curClass.name.includes('Healer') ? '✨' : '🗡️'}
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{curClass.name}</h3>
                  <p className="text-xs text-purple-400 font-bold">ความยากในการควบคุม: {'★'.repeat(curClass.difficulty)}{'☆'.repeat(5 - curClass.difficulty)}</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-305 border-l-2 border-l-purple-500 pl-3.5 py-1 font-serif italic leading-relaxed text-slate-300">
              "{curClass.description}"
            </p>

            {/* Stats visualization percentages */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-white uppercase tracking-wider">ดัชนีค่าสเตตัสเริ่มต้น (Base Attributes):</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(curClass.stats).map(([stat, val]) => (
                  <div key={stat} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[11px] uppercase text-slate-400 font-mono">
                      <span>{stat === 'attack' ? '💥 พลังโจมตี (Atk)' :
                            stat === 'defense' ? '🛡️ พลังป้องกัน (Def)' :
                            stat === 'magic' ? '🔮 พลังเวทมนตร์ (Mag)' : '⚡ ความเร็วว่องไว (Spd)'}</span>
                      <span className="font-bold text-purple-300">{val * 10}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-950/60 rounded-full overflow-hidden border border-purple-500/5">
                      <div className="h-full bg-purple-600 rounded-full" style={{ width: `${val * 10}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Skills panel */}
            <div className="space-y-3 pt-2">
              <h4 className="text-[10px] font-black text-white uppercase tracking-wider">ทักษะสเปเชียลตี้ประจำอาชีพ (Unique Skills):</h4>
              <div className="space-y-2.5">
                {curClass.skills.map((skill) => (
                  <div key={skill.name} className="p-3.5 glass-thin rounded-xl border border-purple-500/10 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-purple-400">
                      <span>⚡ {skill.name}</span>
                      <span className="text-[9px] text-purple-400/50 uppercase font-mono tracking-wider font-bold">Active Skill</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans font-medium">{skill.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {activeSubTab === 'craft' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Recipes options on left */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-[10px] font-black text-white uppercase tracking-wider block mb-1">เลือกสูตรคราฟต์ที่ต้องการเทสต์:</span>
            {CRAFTING_RECIPES.map((recipe, idx) => (
              <button
                key={recipe.name}
                id={`wiki-recipe-select-${idx}`}
                onClick={() => {
                  setActiveRecipeIdx(idx);
                  setCraftAnimation('idle');
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all space-y-2 cursor-pointer ${
                  activeRecipeIdx === idx
                    ? 'glass-thin border-purple-500 text-white'
                    : 'glass border-purple-500/5 hover:border-purple-500/15 text-slate-400 hover:text-white hover:scale-[1.005]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs md:text-sm">{recipe.name}</h4>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    recipe.successRate >= 80 ? 'bg-emerald-500/10 text-emerald-350 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-350 border border-rose-500/20'
                  }`}>
                    เรต {recipe.successRate}%
                  </span>
                </div>
                <div className="text-[10px] text-purple-300/40 font-mono font-bold">ระดับคราฟต์: {recipe.difficulty}</div>
              </button>
            ))}
          </div>

          {/* Dynamic interactive crafting board */}
          <div className="lg:col-span-7 glass border border-purple-500/15 rounded-2xl p-5 space-y-5 shadow-md">
            <div className="border-b border-purple-500/10 pb-3 flex justify-between items-center">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <GameIcon name="Settings" className="text-purple-400" />
                แท่นคราฟต์ระบบฟิวชั่น (Crafting Simulator)
              </h3>
            </div>

            {/* Simulator central view with animation triggers */}
            <div className="glass-thin p-6 rounded-2xl border border-purple-500/20 bg-black/35 flex flex-col items-center justify-center text-center space-y-4 min-h-[220px] relative overflow-hidden shadow-inner">
              
              <AnimatePresence mode="wait">
                {craftAnimation === 'idle' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                    <div className="w-12 h-12 rounded-full border border-purple-500/20 bg-purple-500/5 flex items-center justify-center text-purple-400 mx-auto text-lg shadow-sm">
                      ⚖️
                    </div>
                    <h4 className="text-white font-bold text-xs">พร้อมประกอบสูตรคราฟต์ไอเทมจำลอง</h4>
                    <p className="text-[10px] text-purple-350/50">กรุณากดปุ่มด้านล่างเพื่อทำการเริ่มตีบวกตามเรตโอกาสสำเร็จ</p>
                  </motion.div>
                )}

                {craftAnimation === 'crafting' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                    <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <h5 className="text-purple-400 font-bold font-mono animate-pulse text-xs">กำลังสตรีมมิ่งพลังงานเพื่อทำการหลอมรวมไอเทม...</h5>
                  </motion.div>
                )}

                {craftAnimation === 'success' && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-2_custom">
                    <div className="w-12 h-12 bg-emerald-500/10 border-2 border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl shadow mb-2 animate-bounce">
                      🎉
                    </div>
                    <h4 className="text-emerald-400 font-black text-sm">การฟิวชั่นประกอบสูตรวัตถุดิบสำเร็จ!</h4>
                    <p className="text-xs text-white mt-1 font-bold">{CRAFTING_RECIPES[activeRecipeIdx].result}</p>
                    <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-2.5 py-0.5 rounded font-black uppercase tracking-wider border border-emerald-500/20 inline-block mt-2">RECEIVED EPICAL DEVICE</span>
                  </motion.div>
                )}

                {craftAnimation === 'fail' && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                    <div className="w-12 h-12 bg-rose-500/10 border-2 border-rose-500 text-rose-400 rounded-full flex items-center justify-center mx-auto text-xl shadow mb-2">
                      ❌
                    </div>
                    <h4 className="text-rose-400 font-black text-sm">การฟิวชั่นคราฟต์วัตถุดิบล้มเหลว!</h4>
                    <p className="text-xs text-slate-400 mt-1 font-medium">สูญสลายวัตถุดิบไปร้อยละ 50 แต่ไม่ส่งผลเสียงใดๆ ต่ออุปกรณ์ตัวละครถาวร</p>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Ingredients overview */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-black text-purple-300 block uppercase tracking-wider">วัตถุดิบระดับพื้นฐานที่ใช้ (Materials Box):</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {CRAFTING_RECIPES[activeRecipeIdx].ingredients.map((ing, i) => (
                  <div key={i} className="p-3 glass-thin rounded-xl text-xs flex justify-between items-center border border-purple-500/5">
                    <span className="text-slate-300 font-medium">{ing.name}</span>
                    <span className="font-bold text-purple-300 font-mono">x{ing.qty}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                id="do-craft-sim-btn"
                onClick={handleCraftSim}
                disabled={craftAnimation === 'crafting'}
                className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 font-bold text-xs text-white rounded-lg transition-all cursor-pointer accent-glow shadow"
              >
                เริ่มทำการคราฟต์อุปกรณ์
              </button>
              <button
                id="reset-craft-sim-btn"
                onClick={() => setCraftAnimation('idle')}
                className="py-2.5 px-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-xs font-bold text-white transition-all cursor-pointer"
              >
                รีเซ็ตแผง
              </button>
            </div>

            {/* Live micro-logs console */}
            <div className="bg-black/45 p-3 rounded-xl border border-purple-500/15 h-[100px] overflow-y-auto space-y-1 text-[11px] font-mono scrollbar-thin">
              <span className="text-[9px] text-purple-350 font-black uppercase tracking-wider block border-b border-purple-500/15 pb-1 mb-1">LOGS CONSOLE:</span>
              {craftLogs.map((log, i) => (
                <div key={i} className={log.includes('สำเร็จ') ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                  {log}
                </div>
              ))}
              {craftLogs.length === 0 && (
                <div className="text-slate-600">ไม่มีประวัติการหลอมตีบวกในรอบบิลนี้</div>
              )}
            </div>

          </div>

        </div>
      )}

      {activeSubTab === 'quests' && (
        <div className="space-y-4">
          <div className="border-b border-purple-500/10 pb-2">
            <h3 className="font-bold text-white text-base">📜 บอร์ดรับงานสำนักอาคาร์เทล (Quest Board & Rewards)</h3>
            <p className="text-xs text-purple-300/80">ตะลุยสับฆ่ามอนสเตอร์ ยึดครองชัยชนะส่งมอบเคสเพื่อรับระดับ EXP และเงินทองใช้สอย</p>
          </div>

          <div className="space-y-3">
            {quests.map((q) => (
              <div 
                key={q.id}
                className="glass hover:scale-[1.002] p-5 rounded-2xl space-y-3 transition-all border border-purple-500/10 shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1 text-slate-300">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-xs md:text-sm">{q.title}</h4>
                      <span className="text-[9px] bg-slate-950/70 text-purple-300 font-bold border border-purple-500/15 px-2 py-0.5 rounded font-mono">
                        {q.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans mt-2">
                      {q.desc}
                    </p>
                  </div>

                  <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-black font-mono border ${
                    q.status === 'Completed' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25' :
                    q.status === 'In Progress' ? 'bg-amber-500/15 text-amber-300 border-amber-500/25' : 'bg-slate-950/40 text-slate-500 border-purple-500/5'
                  }`}>
                    {q.status === 'Completed' ? 'เสร็จเรียบร้อย' : q.status === 'In Progress' ? 'กำลังสับงาน' : 'พร้อมทำ'}
                  </span>
                </div>

                <div className="pt-3 border-t border-purple-500/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs font-mono">
                    <span className="text-[10px] text-purple-300/40 uppercase block font-sans font-bold">รางวัลความทุ่มเท:</span>
                    <span className="text-purple-300 font-bold">{q.reward}</span>
                  </div>

                  <div className="flex gap-1.5">
                    {q.status === 'Available' ? (
                      <button
                        id={`accept-quest-btn-${q.id}`}
                        onClick={() => handleTriggerQuest(q.id, 'accept')}
                        className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition-all cursor-pointer accent-glow-sm"
                      >
                        รับภารกิจสำรวจ
                      </button>
                    ) : q.status === 'In Progress' ? (
                      <button
                        id={`complete-quest-btn-${q.id}`}
                        onClick={() => handleTriggerQuest(q.id, 'complete')}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition bg-emerald-600 shadow-sm cursor-pointer"
                      >
                        ส่งงานเพื่อแลกเปลี่ยนรางวัล
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        ✔ ได้รับรางวัลเรียบร้อย
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
