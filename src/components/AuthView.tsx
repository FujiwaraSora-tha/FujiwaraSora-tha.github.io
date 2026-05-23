import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GameIcon } from './GameIcon';
import { motion } from 'motion/react';
import { GAME_CONFIG } from '../config';

export const AuthView: React.FC = () => {
  const { isLoggedIn, isBlocked, setIsBlocked, login, register, logout, playerProfile, resetGameData } = useGame();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (isSignUp) {
      const result = register(name, email, password);
      if (typeof result === 'string') {
        setErrorMessage(result);
      } else {
        setSuccessMessage('สร้างบัญชีเกมและเข้าสู่ระบบสำเร็จแล้ว!');
        // Clear forms
        setName('');
        setEmail('');
        setPassword('');
      }
    } else {
      const result = login(email, password);
      if (typeof result === 'string') {
        setErrorMessage(result);
      } else {
        setSuccessMessage('เข้าสู่ระบบสำเร็จ!');
        setEmail('');
        setPassword('');
      }
    }
  };

  const handleBanSimulation = () => {
    // Toggles blocked status
    setIsBlocked(!isBlocked);
    setErrorMessage(isBlocked ? '' : 'บัญชีถูกระงับชั่วคราวขณะทดสอบระบบบล็อก');
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      
      {/* Account Control Center Panel */}
      <div className="glass rounded-2xl p-5 space-y-4 shadow-md border-purple-500/15">
        <h3 className="font-bold text-white flex items-center gap-2 text-sm border-b border-purple-500/10 pb-3">
          <GameIcon name="Settings" className="text-purple-400" />
          ผู้ทดสอบระบบ: แผงควบคุมสัญญลักษณ์ (Account Simulation Center)
        </h3>
        <p className="text-xs text-purple-300/80 leading-relaxed font-medium">
          คุณสามารถจำลองกรณีล็อกอินด้วยบัญชีที่ถูกแบน (Block) เพื่อตรวจสอบการแสดงผลการเข้าสู่ระบบแบบที่มีการบล็อกได้ โดยกดปุ่มด้านล่างนี้:
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <button 
            id="toggle-ban-btn"
            onClick={handleBanSimulation}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isBlocked 
                ? 'bg-emerald-950/65 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900 shadow' 
                : 'bg-rose-950/65 text-rose-300 border border-rose-500/30 hover:bg-rose-900 shadow'
            }`}
          >
            <GameIcon name="AlertTriangle" size={13} />
            {isBlocked ? 'ปลดบล็อกบัญชีนี้ (Unblock Profile)' : 'จำลองสถานะแบนผู้ใช้ (Simulate Ban)'}
          </button>
          
          <button 
            id="ban-preset-btn"
            onClick={() => {
              setEmail('banned@mmo.com');
              setPassword('123456');
              setIsSignUp(false);
              setErrorMessage('ป้อนพรีเซ็ตแบนสำเร็จแล้ว กรุณากดปุ่มเพื่อสลับเข้าระบบบัญชีแบน');
            }}
            className="bg-[#140e26]/60 border border-purple-500/15 text-[10px] text-purple-300 px-3 py-1.5 rounded-xl hover:bg-slate-850 transition cursor-pointer font-bold"
          >
            ใช้พรีเซ็ตอีเมลโดนแบน
          </button>

          <button 
            id="reset-factory-btn"
            onClick={() => {
              resetGameData();
              setSuccessMessage('รีเซ็ตรองรับผู้สมัครเล่นใหม่สำเร็จ ลบประวัติสเตตัสทั้งหมดเรียบร้อยแล้ว!');
              setErrorMessage('');
              setTimeout(() => setSuccessMessage(''), 4500);
            }}
            className="px-3.5 py-2 bg-gradient-to-r from-red-650 to-red-500 hover:from-red-500 hover:to-red-400 border border-red-500/30 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <GameIcon name="RotateCcw" size={13} />
            รีเซ็ตสตรีมและข้อมูลใหม่ (Reset Server System)
          </button>
        </div>
      </div>

      {isBlocked ? (
        /* Red Premium Banned Display Frame */
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass border border-rose-500/40 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl text-center relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 -mr-16 -mt-16 h-36 w-36 rounded-full bg-rose-500/5 blur-2xl"></div>
          <div className="mx-auto w-16 h-16 rounded-full bg-rose-500/5 border border-rose-500/20 flex items-center justify-center text-rose-450 text-rose-500">
            <GameIcon name="Lock" size={32} />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-rose-400">บัญชีผู้เล่นนี้ถูกระงับการเข้าใช้งาน</h2>
            <p className="text-xs text-rose-300/40 font-mono font-bold">ACCOUNT_ID: {playerProfile?.email || 'N/A'}</p>
          </div>

          <div className="bg-rose-950/15 border border-rose-500/25 text-rose-250/90 rounded-xl p-4 text-left space-y-3 text-xs leading-relaxed text-rose-200">
            <div>
              <span className="font-bold text-rose-400">สาเหตุที่โดนแบน:</span> เผยแพร่ชุดข้อมูลหรือใช้จุดรั่วไหลของระบบดึงข้อมูลในกระดานตลาดกลางบ่อยครั้ง (Market glitch exploitation)
            </div>
            <div>
              <span className="font-bold text-rose-400">วันที่ถูกแบน:</span> 23 พฤษภาคม 2026
            </div>
            <div>
              <span className="font-bold text-rose-450 text-rose-400">ระยะเวลา:</span> ถาวร (Permanent Permanent)
            </div>
          </div>

          <div className="space-y-3 pt-2 text-left">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">แนวทางแก้ไข & การยื่นอุทธรณ์ (Ban Appeal Guide)</h4>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              ผู้เล่นสามารถยื่นเรื่องอุทธรณ์เพื่อขอรับการตรวจสอบย้อนหลัง หากเชื่อว่าเหตุดังกล่าวเกิดขึ้นจากข้อผิดพลาด โดยจำต้องเตรียมหลักฐาน LOG และเปิดตั๋วในหมวดซัพพอร์ตระบบ <span className="text-purple-400 underline cursor-pointer font-bold">"แจ้งปัญหา / Appeal"</span>
            </p>
          </div>

          <div className="pt-2 border-t border-rose-500/10">
            <button 
              id="back-active-ban"
              onClick={() => {
                setIsBlocked(false);
                setErrorMessage('');
              }}
              className="px-4 py-2 bg-black/30 text-xs text-rose-400 hover:text-white border border-rose-500/25 hover:border-rose-500 rounded-lg transition-all cursor-pointer"
            >
              ทดลองเชื่อมต่อผู้ใช้อื่นใหม่
            </button>
          </div>
        </motion.div>
      ) : isLoggedIn && playerProfile ? (
        /* Logged In Status */
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass border border-purple-500/15 rounded-2xl p-6 text-center space-y-6 shadow-lg"
        >
          <div className="mx-auto w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-4xl">
            {playerProfile.avatar || '🛡️'}
          </div>

          <div className="space-y-1">
            <div className="text-[10px] text-purple-450 text-purple-300 font-mono font-black uppercase tracking-wider">{playerProfile.class}</div>
            <h2 className="text-2xl font-black text-white">{playerProfile.name}</h2>
            <p className="text-xs text-purple-300/40 font-mono italic">{playerProfile.email}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            <div className="glass-thin p-3 rounded-xl border border-purple-500/10">
              <span className="block text-[10px] text-purple-300/40 uppercase font-bold tracking-wider">Cash Points</span>
              <span className="text-lg font-black text-white font-mono block mt-0.5">{playerProfile.points} Pts</span>
            </div>
            <div className="glass-thin p-3 rounded-xl border border-purple-500/10">
              <span className="block text-[10px] text-purple-300/40 uppercase font-bold tracking-wider">Gold Balance</span>
              <span className="text-lg font-black text-amber-400 font-mono block mt-0.5">{playerProfile.gold} Gold</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 font-serif italic">
            "{playerProfile.bio || 'ไม่มีคำคมประดับโปรไฟล์'}"
          </p>

          <div className="pt-4 border-t border-purple-500/10">
            <button
              id="logout-btn"
              onClick={logout}
              className="w-full bg-black/25 hover:bg-black/45 text-rose-400 hover:text-white py-2.5 rounded-xl font-bold text-xs transition border border-purple-500/10 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <GameIcon name="LogOut" size={14} />
              สลับบัญชีใหม่ / ออกจากระบบ
            </button>
          </div>
        </motion.div>
      ) : (
        /* Sign In & Sign Up Form Section */
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass border border-purple-500/20 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl"
        >
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-white">
              {isSignUp ? 'สร้างบัญชีเข้าเล่นเกมใหม่' : 'เข้าสู่ระบบหอคอยบัญชาการ'}
            </h2>
            <p className="text-xs text-purple-300/80 leading-relaxed font-semibold">
              {isSignUp ? 'ร่วมเป็นผู้พิทักษ์ท็อปเซิร์ฟเกียร์เวอร์ชั่น 5 ได้ทันที' : 'เข้าถึงข้อมูล ประวัติช็อป และระบบสมาคมเซิร์ฟเวอร์'}
            </p>
          </div>

          {errorMessage && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl p-3 text-xs flex items-center gap-2 font-bold">
              <GameIcon name="AlertTriangle" size={14} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-3 text-xs flex items-center gap-2 font-bold">
              <GameIcon name="Check" size={14} className="shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-purple-200">ชื่อนักรบ (Username)</label>
                <input 
                  id="signup-username"
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น Gilded_Phoenix"
                  className="w-full bg-slate-950/75 border border-purple-500/20 focus:border-purple-500 text-xs text-white rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-purple-200">ที่อยู่อีเมล (Email Address)</label>
              <input 
                id="signup-email"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={`เช่น ${GAME_CONFIG.DEFAULT_PLAYER_EMAIL}`}
                className="w-full bg-slate-950/75 border border-purple-500/20 focus:border-purple-500 text-xs text-white rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-purple-200">รหัสผ่านลับ (Secret Password)</label>
              <input 
                id="signup-password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ป้อนรหัสแผงคีย์เวิร์ดอย่างน้อย 6 ตัวอักษร"
                className="w-full bg-slate-950/75 border border-purple-500/20 focus:border-purple-500 text-xs text-white rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-purple-500/30"
                required
              />
            </div>

            <button 
              id="submit-auth-btn"
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-xl py-3 transition shadow-lg shadow-purple-500/15 cursor-pointer accent-glow uppercase tracking-wider block"
            >
              {isSignUp ? 'ยอมรับเงื่อนไขและสมัครบัญชีทันที' : 'ลงชื่อเข้าใช้ระบบ'}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              id="toggle-auth-state-btn"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className="text-xs text-purple-400 hover:text-purple-300 transition-colors cursor-pointer font-bold"
            >
              {isSignUp ? 'มีสิทธิ์ไอดีพอร์ทัลอยู่แล้ว? ลงชื่อเข้าใช้ที่นี่' : 'ยังไม่มีบัญชีตัวละคร? สร้างบัญชีผู้ใช้ใหม่ได้ง่ายๆ'}
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
};
