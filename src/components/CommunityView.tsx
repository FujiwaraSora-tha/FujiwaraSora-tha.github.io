import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GameIcon } from './GameIcon';
import { FAQ_DATA, LEADERBOARD, PATCH_NOTES } from '../mockData';
import { motion } from 'motion/react';

export const CommunityView: React.FC = () => {
  const { playerProfile, supportTickets, addSupportTicket } = useGame();
  
  const [activeSubTab, setActiveSubTab] = useState<'news' | 'leaderboard' | 'support'>('leaderboard');
  const [leaderboardType, setLeaderboardType] = useState<'exp' | 'wealth'>('exp');
  
  // FAQs
  const [searchFaq, setSearchFaq] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Tickets support form
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketCategory, setTicketCategory] = useState<'Bug' | 'Payment' | 'Report Player' | 'Appeal Ban' | 'Other'>('Appeal Ban');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle || !ticketDesc) return;

    addSupportTicket(ticketTitle, ticketCategory, ticketDesc);
    setTicketSuccess(true);
    setTicketTitle('');
    setTicketDesc('');
    setTimeout(() => setTicketSuccess(false), 3000);
  };

  // Filter FAQs
  const filteredFaqs = FAQ_DATA.filter(faq => 
    faq.question.toLowerCase().includes(searchFaq.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchFaq.toLowerCase())
  );

  // Sort Leaderboard
  const sortedLeaderboard = [...LEADERBOARD].sort((a, b) => {
    if (leaderboardType === 'exp') {
      return b.level !== a.level ? b.level - a.level : b.exp - a.exp;
    } else {
      return b.gold - a.gold;
    }
  });

  return (
    <div className="space-y-6">
      
      {/* Sub tabs navigation */}
      <div className="flex border-b border-purple-500/10 gap-2 pb-px overflow-x-auto">
        <button
          id="com-tab-leaderboard"
          onClick={() => setActiveSubTab('leaderboard')}
          className={`px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeSubTab === 'leaderboard' 
              ? 'border-purple-500 text-white' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <GameIcon name="Award" size={13} />
          📊 ตารางผู้นำท็อปเซิร์ฟ (Leaderboard)
        </button>

        <button
          id="com-tab-news"
          onClick={() => setActiveSubTab('news')}
          className={`px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeSubTab === 'news' 
              ? 'border-purple-500 text-white' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <GameIcon name="FileText" size={13} />
          📰 ข่าวสารสารานุกรม (News & Patches)
        </button>

        <button
          id="com-tab-support"
          onClick={() => setActiveSubTab('support')}
          className={`px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeSubTab === 'support' 
              ? 'border-purple-500 text-white' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <GameIcon name="HelpCircle" size={13} />
          🛠 บอร์ดซัพพอร์ต & อุทธรณ์ (FAQ & Support)
        </button>
      </div>

      {/* RENDER COMMUNITY SUBTAB CONTENT */}
      {activeSubTab === 'leaderboard' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-purple-500/10 pb-3">
            <div>
              <h3 className="font-bold text-white text-base">การจัดอันดับเกียรติยศเซิร์ฟเวอร์ (Global Leaderboard)</h3>
              <p className="text-xs text-purple-300/80">ระบบคัดสรรรายงานผลงานความพากเพียรและระดับความมั่งคั่งเรียลไทม์</p>
            </div>

            {/* Sub-filtering */}
            <div className="flex bg-slate-950/60 p-1 border border-purple-500/10 rounded-xl">
              <button
                id="sorting-exp-btn"
                onClick={() => setLeaderboardType('exp')}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all font-bold cursor-pointer ${
                  leaderboardType === 'exp' 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-purple-300'
                }`}
              >
                อันดับระดับ / EXP
              </button>
              <button
                id="sorting-wealth-btn"
                onClick={() => setLeaderboardType('wealth')}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all font-bold cursor-pointer ${
                  leaderboardType === 'wealth' 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-purple-300'
                }`}
              >
                อันดับความมั่งคั่ง (Gold)
              </button>
            </div>
          </div>

          {/* Leaderboard Table with styled items */}
          <div className="glass rounded-2xl overflow-hidden shadow-md border-purple-500/15">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#140e26]/60 border-b border-purple-500/15 text-purple-300 font-mono text-[10px] uppercase tracking-wider">
                    <th className="py-3 px-4 text-center">อันดับ</th>
                    <th className="py-3 px-4">ชื่อนักรบ (Username)</th>
                    <th className="py-3 px-4">สายอาชีพ</th>
                    <th className="py-3 px-4">สมาคมกิลด์ (Guild)</th>
                    <th className="py-3 px-4 text-center">เลเวลตัวละคร</th>
                    <th className="py-3 px-4 text-right">ทองสำรอง (Gold)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-500/5 text-slate-300 font-mono">
                  {sortedLeaderboard.map((user, idx) => {
                    const rank = idx + 1;
                    const isSelf = playerProfile && user.name === playerProfile.name;
                    return (
                      <tr 
                        key={user.name} 
                        className={`hover:bg-purple-950/20 transition-colors ${
                          isSelf ? 'bg-purple-500/15 text-white border-l-2 border-l-purple-500 font-bold' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 text-center">
                          {rank === 1 ? (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] shadow-sm shadow-amber-500/20">1</span>
                          ) : rank === 2 ? (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 text-slate-950 font-bold text-[10px]">2</span>
                          ) : rank === 3 ? (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-800 text-white font-bold text-[10px]">3</span>
                          ) : (
                            <span className="text-slate-500">{rank}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-bold font-sans">
                          <span className="flex items-center gap-1.5">
                            {user.name}
                            {isSelf && <span className="bg-purple-500 text-slate-950 text-[8px] font-sans px-1.5 py-0.2 rounded font-black uppercase">YOU</span>}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-sans text-purple-300">{user.class}</td>
                        <td className="py-3.5 px-4">
                          {user.guild ? (
                            <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-purple-500/10 text-purple-400 font-sans text-[11px] font-bold">🛡️ {user.guild}</span>
                          ) : (
                            <span className="text-slate-600">-</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-white">Lv.{user.level}</td>
                        <td className="py-3.5 px-4 text-right text-amber-400 font-bold">{user.gold.toLocaleString()} G</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'news' && (
        <div className="space-y-4">
          <div className="border-b border-purple-500/10 pb-2">
            <h3 className="font-bold text-white text-base">📰 บล็อกข่าวสารแห่งอาณาจักร & แพทช์โน้ต (News & Patchnotes)</h3>
            <p className="text-xs text-purple-300/80">อภิปรายความเปลี่ยนแปลงและระเบียบวินัยการอัปเดตระบบเกมอย่างมีคุณภาพ</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PATCH_NOTES.map((patch, idx) => (
              <div 
                key={idx}
                className="glass hover:scale-[1.005] transition-all duration-150 rounded-2xl p-5 space-y-4 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    patch.category === 'Update' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold'
                  }`}>
                    {patch.category}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">{patch.date}</span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm md:text-base">{patch.title}</h4>
                  <p className="text-[10px] text-purple-300/40 font-mono">CODE_VERSION: {patch.version}</p>
                </div>

                <div className="space-y-2 pt-1.5 border-t border-purple-500/10">
                  <span className="text-xs font-black text-purple-300 block uppercase tracking-wider">ไฮไลต์สำคัญประจำอัปเดต:</span>
                  <ul className="space-y-2 text-xs text-slate-300 font-medium">
                    {patch.highlights.map((h, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <span className="text-purple-500 font-black mt-0.5">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'support' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* FAQ search and accordion */}
          <div className="lg:col-span-3 space-y-4">
            <div className="space-y-2">
              <h3 className="font-bold text-white text-sm">สารบัญคำถามพบบ่อย (Frequently Asked Questions)</h3>
              <div className="relative">
                <input
                  id="faq-search-input"
                  type="text"
                  placeholder="พิมพ์ค้นหาคีย์เวิร์ดคำถาม เช่น VIP, อุทธรณ์ (Query FAQ...)"
                  value={searchFaq}
                  onChange={(e) => setSearchFaq(e.target.value)}
                  className="w-full bg-slate-950/60 border border-purple-500/20 text-xs text-white rounded-xl p-3.5 pr-10 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40"
                />
                <span className="absolute right-3.5 top-3.5 text-slate-500">
                  <GameIcon name="Search" size={15} />
                </span>
              </div>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {filteredFaqs.map((faq, idx) => {
                const isExpanded = expandedFaq === idx;
                return (
                  <div 
                    key={idx}
                    className="glass hover:border-purple-500/20 rounded-xl overflow-hidden transition-all shadow"
                  >
                    <button
                      id={`faq-expand-btn-${idx}`}
                      onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                      className="w-full text-left p-4 flex items-center justify-between text-xs font-bold text-white hover:text-purple-300 transition-colors gap-2 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-purple-400 font-mono font-black">Q:</span>
                        {faq.question}
                      </span>
                      <GameIcon 
                        name="ChevronDown" 
                        className={`text-slate-500 transition-transform duration-150 ${isExpanded ? 'rotate-180 text-purple-400' : ''}`} 
                        size={14} 
                      />
                    </button>

                    {isExpanded && (
                      <div className="p-4 bg-slate-950/60 border-t border-purple-500/5 text-xs text-slate-300 leading-relaxed font-sans border-l-2 border-l-purple-500">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredFaqs.length === 0 && (
                <div className="text-center p-6 text-xs text-slate-500 glass rounded-xl">ไม่พบคลังคำพึ่งหาความช่วยเหลือตามคีย์เวิร์ดนี้</div>
              )}
            </div>
          </div>

          {/* Ticket System form & submitted status */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Ticket Submission form */}
            <div className="glass rounded-2xl p-5 space-y-4 shadow-md">
              <div className="border-b border-purple-500/10 pb-2">
                <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <GameIcon name="Ticket" className="text-purple-400" />
                  เปิดตั๋วร้องเรียน / อุทธรณ์โทษ (Open Support Ticket)
                </h3>
                <p className="text-[10px] text-purple-300/60 mt-1 leading-relaxed">แจ้งปัญหาการตัดเงินพอยท์ บั๊กไอเทมหล่น หรือส่งรายงานขอปลดแบนไอดี</p>
              </div>

              {ticketSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-lg p-3 text-xs font-bold">
                  ส่งตั๋วเรียกร้องเรื่องไปยังทีมงานจีเอ็มเรียบร้อยแล้ว! แอดมินสภาสูงสุดจะมาให้คำตอบในระยะเวลาอันสั้น
                </div>
              )}

              <form onSubmit={handleTicketSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-purple-200 font-bold">หัวข้อเรื่องเดือดร้อน:</label>
                  <input
                    id="ticket-title-input"
                    type="text"
                    placeholder="เช่น ขอทบทวนการแบนกรณีสับยุ่งเหตุด่วน"
                    value={ticketTitle}
                    onChange={(e) => setTicketTitle(e.target.value)}
                    className="w-full bg-slate-950/70 border border-purple-500/20 text-xs text-white rounded-lg p-2.5 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-purple-200 font-bold">หมวดหมู่รายการ:</label>
                  <select
                    id="ticket-category-select"
                    value={ticketCategory}
                    onChange={(e: any) => setTicketCategory(e.target.value)}
                    className="w-full bg-slate-950/70 border border-purple-500/20 text-xs text-white rounded-lg p-2.5 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Appeal Ban">ยื่นอุทธรณ์ปลดแบนไอดี (Appeal Ban)</option>
                    <option value="Bug">รายงานตัวแจ้งพบบั๊กระบบเกม (Bug)</option>
                    <option value="Payment">ยอดแต้มเติมไม่เข้า (Payment Issue)</option>
                    <option value="Report Player">รายงานการพพบทุจริตบอตบอส (Report Player)</option>
                    <option value="Other">เคสข้อสอบถามพึ่งพิงอื่นๆ (Other)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-purple-200 font-bold">รายละเอียดเพิ่มเติม (เตรียมหลักฐาน):</label>
                  <textarea
                    id="ticket-desc-input"
                    rows={3}
                    placeholder="ป้อนรายละเอียด LOG หรือลำดับเหตุการณ์อย่างละเอียด เพื่อความรวดเร็วในการพิจารณาเคส"
                    value={ticketDesc}
                    onChange={(e) => setTicketDesc(e.target.value)}
                    className="w-full bg-slate-950/70 border border-purple-500/20 text-xs text-white rounded-lg p-2.5 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <button
                  id="ticket-submit-btn"
                  type="submit"
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 font-bold text-xs text-white rounded-lg transition-all cursor-pointer accent-glow"
                >
                  ส่งเรื่องตรงถึงผู้พัฒนาระบบ
                </button>
              </form>
            </div>

            {/* Submitted tickets logs */}
            <div className="space-y-3">
              <span className="text-[10px] font-black text-white uppercase tracking-wider block">ตั๋วคำร้องของกระตระกูลของคุณ:</span>
              
              {supportTickets.map((ticket) => (
                <div 
                  key={ticket.id}
                  className="glass p-4 rounded-xl space-y-2.5 shadow border-purple-500/10"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-1.5 py-0.5 rounded bg-slate-950/60 font-mono text-[9px] text-slate-500 border border-purple-500/5">TKT_ID: {ticket.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black font-mono tracking-wider uppercase ${
                      ticket.status === 'Resolved' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25' : 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
                    }`}>
                      {ticket.status === 'Resolved' ? 'ตรวจสอบเสร็จแล้ว' : 'กำลังรอตรวจ'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h5 className="font-bold text-white text-xs">{ticket.title}</h5>
                    <p className="text-[11px] text-slate-300 leading-normal">{ticket.description}</p>
                  </div>

                  {ticket.reply && (
                    <div className="p-3 bg-purple-950/20 border border-purple-500/10 rounded text-[11px] text-purple-200/90 leading-relaxed">
                      <span className="font-black text-purple-400 block mb-1 uppercase text-[9px] tracking-wider">💬 ทางการเวทีผู้เล่นตอบกลับ:</span>
                      {ticket.reply}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
