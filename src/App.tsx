import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { GameIcon } from './components/GameIcon';
import { HomeView } from './components/HomeView';
import { PackagesView } from './components/PackagesView';
import { ShopView } from './components/ShopView';
import { CommunityView } from './components/CommunityView';
import { WikiView } from './components/WikiView';
import { ProfileView } from './components/ProfileView';
import { AuthView } from './components/AuthView';
import { motion, AnimatePresence } from 'motion/react';

function AppContent() {
  const { isLoggedIn, isBlocked, playerProfile, logout } = useGame();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const navigationItems = [
    { id: 'home', label: '🏠 หน้าแรก (Home)', icon: 'Home' },
    { id: 'auth', label: '📋 ลงทะเบียน / บล็อก', icon: 'User' },
    { id: 'packages', label: '💎 แพ็กเกจ VIP', icon: 'Crown' },
    { id: 'shop', label: '🛒 ร้านค้า & ตลาดผู้เล่น', icon: 'ShoppingBag' },
    { id: 'community', label: '🌐 ชุมชน & ซัพพอร์ต', icon: 'MessageSquare' },
    { id: 'wiki', label: '📖 วิกิ / Guide คราฟต์', icon: 'BookOpen' },
    { id: 'profile', label: '👤 โปรไฟล์ & สถิติ MMO', icon: 'Settings' },
  ];

  const handleNavigate = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0d091a] text-[#e2e8f0] flex flex-col md:flex-row md:p-4 gap-4 antialiased select-none scrollbar-none selection:bg-purple-600/30 leading-normal font-sans relative">
      
      {/* Dynamic Background subtle grid and glowing radial overlays */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0c051d] via-[#0d091a] to-[#251249]/15 pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.1),transparent_50%)] pointer-events-none z-0"></div>

      {/* MOBILE HEADER */}
      <header className="md:hidden w-full bg-[#140e26]/90 border-b border-purple-500/20 p-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div onClick={() => handleNavigate('home')} className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 purple-gradient rounded-lg flex items-center justify-center text-white font-black text-sm accent-glow">
            A
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-white tracking-tight">ASTRAEA PORTAL</h1>
            <span className="text-[9px] text-purple-400 font-bold tracking-widest block uppercase leading-none font-mono">S5: GILDED DRAGON</span>
          </div>
        </div>

        <button 
          id="mobile-nav-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white transition"
        >
          <GameIcon name={mobileMenuOpen ? 'Plus' : 'ChevronDown'} className={mobileMenuOpen ? 'rotate-45 transition-transform duration-150' : 'transition-transform duration-150'} size={20} />
        </button>
      </header>

      {/* MOBILE SIDEDRAWER WRAP */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-[65px] left-0 right-0 bg-slate-950/95 border-b border-purple-500/15 p-4 z-30 flex flex-col gap-2 shadow-2xl backdrop-blur-lg"
          >
            {navigationItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`m-nav-${item.id}`}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full py-2.5 px-4 rounded-lg text-left text-xs font-semibold flex items-center gap-3 transition-colors ${
                    isActive
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-900/50 hover:bg-slate-900 text-slate-300'
                  }`}
                >
                  <GameIcon name={item.icon} size={15} />
                  {item.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR NAVIGATION PANEL */}
      <aside className="hidden md:flex flex-col w-64 glass rounded-2xl h-[calc(100vh-2rem)] sticky top-4 p-5 z-20 justify-between shrink-0 font-sans shadow-xl">
        <div className="space-y-6">
          
          {/* Brand header */}
          <div onClick={() => handleNavigate('home')} className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 purple-gradient rounded-lg flex items-center justify-center text-white font-black text-lg accent-glow group-hover:scale-105 transition-all">
              A
            </div>
            <div>
              <h1 className="font-sans font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-200 text-sm tracking-tight leading-none group-hover:text-purple-300 transition-colors">ASTRAEA PORTAL</h1>
              <span className="text-[9px] text-purple-400 font-mono font-bold tracking-widest block uppercase mt-1 leading-none">S5: GILDED DRAGON</span>
            </div>
          </div>

          {/* Nav Items List */}
          <nav className="space-y-1 pt-4">
            <div className="text-[10px] uppercase tracking-widest text-purple-400 font-semibold px-2 mb-2">Navigation</div>
            {navigationItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`d-nav-${item.id}`}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full py-2 px-3 rounded-lg text-left text-xs font-semibold flex items-center gap-3 transition-all relative cursor-pointer ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <GameIcon name={item.icon} className={isActive ? 'text-purple-400' : 'text-slate-400'} size={15} />
                  {item.label}
                  {isActive && (
                    <span className="absolute right-3 w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Desktop Quick User status or Logout button */}
        <div className="pt-4 border-t border-purple-500/10 space-y-3">
          {isLoggedIn && playerProfile ? (
            <div className="flex items-center justify-between p-2.5 bg-purple-950/20 rounded-xl border border-purple-500/10">
              <div id="nav-profile-link" onClick={() => handleNavigate('profile')} className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition">
                <span className="text-2xl">{playerProfile.avatar || '🛡️'}</span>
                <div>
                  <h4 className="font-bold text-xs text-white truncate max-w-[120px]">{playerProfile.name}</h4>
                  <span className="text-[8px] uppercase font-bold text-purple-300 font-mono">Lv.{playerProfile.level} {playerProfile.class.split(' (')[0]}</span>
                </div>
              </div>
              <button 
                id="d-quick-logout"
                onClick={logout}
                className="text-slate-400 hover:text-rose-400 transition cursor-pointer"
              >
                <GameIcon name="LogOut" size={13} />
              </button>
            </div>
          ) : (
            <button
              id="d-quick-login-btn"
              onClick={() => handleNavigate('auth')}
              className="w-full py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs font-bold text-white transition duration-150 accent-glow cursor-pointer"
            >
              ลงชื่อเข้าใช้พอร์ทัล
            </button>
          )}

          <div className="text-[10px] text-purple-400/65 font-mono text-center">
            NEXUS PORTAL © 2026
          </div>
        </div>

      </aside>

      {/* CENTRAL MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col gap-4 z-10 w-full overflow-hidden">
        
        {/* DESKTOP HEADER BAR STATUS ROW */}
        <header className="hidden md:flex h-16 glass rounded-2xl items-center justify-between px-6 shrink-0 shadow-lg">
          <div className="flex gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs font-medium text-slate-200">เซิร์ฟเวอร์หลัก: ออนไลน์ (Online)</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 tracking-tight font-mono">
              <span className="text-emerald-400">TPS: 20.0</span>
              <span className="opacity-40">|</span>
              <span>ประชากร: 1,420 คน</span>
              {isBlocked && (
                <>
                  <span className="opacity-40">|</span>
                  <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[9px] font-bold">SHUTDOWN</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn && playerProfile ? (
              <div className="flex items-center gap-3 flex-wrap">
                <button 
                  onClick={() => handleNavigate('packages')}
                  className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs font-bold text-white transition accent-glow cursor-pointer"
                >
                  💎 เติมเงิน VIP แพ็กเกจ
                </button>
                <div onClick={() => handleNavigate('shop')} className="flex items-center gap-1.5 glass-thin px-3 py-1.5 rounded-lg border-white/5 cursor-pointer hover:border-purple-500/30 transition-all font-mono text-xs">
                  <span className="text-purple-400">🪙</span>
                  <span className="font-bold text-white">{playerProfile.points} Pts</span>
                </div>
                <div onClick={() => handleNavigate('profile')} className="flex items-center gap-1.5 glass-thin px-3 py-1.5 rounded-lg border-white/5 cursor-pointer hover:border-purple-500/30 transition-all font-mono text-xs">
                  <span className="text-amber-400">👑</span>
                  <span className="font-bold text-amber-300">{playerProfile.gold.toLocaleString()} G</span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleNavigate('auth')}
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs font-bold text-white transition accent-glow cursor-pointer"
              >
                เข้าสู่ระบบสมาชิก
              </button>
            )}
          </div>
        </header>

        {/* PRIMARY SWITCH OVER ROUTED COMPONENTS */}
        <div className="relative z-10 pb-12 overflow-y-auto pr-1 flex-1">
          {activeTab === 'home' && <HomeView onNavigate={handleNavigate} />}
          {activeTab === 'auth' && <AuthView />}
          {activeTab === 'packages' && <PackagesView onNavigate={handleNavigate} />}
          {activeTab === 'shop' && <ShopView />}
          {activeTab === 'community' && <CommunityView />}
          {activeTab === 'wiki' && <WikiView />}
          {activeTab === 'profile' && <ProfileView />}
        </div>

      </main>

    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
