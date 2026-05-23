import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GameIcon } from './GameIcon';
import { SHOP_CASH_ITEMS } from '../mockData';
import { motion } from 'motion/react';

export const ShopView: React.FC = () => {
  const { playerProfile, inventory, marketItems, buyMarketItem, bidMarketItem, listMarketItem, topUpPoints } = useGame();
  
  const [activeSubTab, setActiveSubTab] = useState<'topup' | 'market' | 'cashshop'>('market');
  
  // Top-up amount state
  const [topUpAmount, setTopUpAmount] = useState<number>(150);
  const [showQR, setShowQR] = useState<boolean>(false);
  const [isVerifyingSlip, setIsVerifyingSlip] = useState<boolean>(false);
  const [topUpSuccess, setTopUpSuccess] = useState<string | null>(null);

  // Listing item on market form
  const [listItemName, setListItemName] = useState<string>('');
  const [listQty, setListQty] = useState<number>(1);
  const [listPrice, setListPrice] = useState<number>(100);
  const [listCategory, setListCategory] = useState<string>('Consumable');
  const [listRarity, setListRarity] = useState<string>('rare');
  const [listIsAuction, setListIsAuction] = useState<boolean>(false);
  const [listSuccess, setListSuccess] = useState<boolean>(false);

  // Bidding and buying status
  const [marketActionFeedback, setMarketActionFeedback] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [customBidAmounts, setCustomBidAmounts] = useState<{ [itemId: string]: number }>({});

  const handleSelectAmount = (amt: number) => {
    setTopUpAmount(amt);
    setShowQR(true);
    setTopUpSuccess(null);
  };

  const handleVerifySlip = () => {
    setIsVerifyingSlip(true);
    setTopUpSuccess(null);
    setTimeout(() => {
      setIsVerifyingSlip(false);
      topUpPoints(topUpAmount, 'PromptPay QR');
      setTopUpSuccess(`ระบบยืนยันสลิปผ่าน QR สำเร็จและเติมเงินเข้าไอดี ${topUpAmount} Pts (แต้ม) เรียบร้อยแล้ว!`);
      setShowQR(false);
    }, 1500);
  };

  const handleFormList = (e: React.FormEvent) => {
    e.preventDefault();
    setListSuccess(false);
    if (!listItemName) return;

    const success = listMarketItem(listItemName, listQty, listPrice, listRarity, listCategory, listIsAuction);
    if (success) {
      setListSuccess(true);
      setListItemName('');
      setTimeout(() => setListSuccess(false), 3000);
    } else {
      setMarketActionFeedback({ type: 'error', text: 'จำนวนไอเทมในคลังมีไม่เพียงพอสำหรับนำมาประกาศวางขายในตลาดแผงเสรี' });
      setTimeout(() => setMarketActionFeedback(null), 5000);
    }
  };

  const handleBuyMarketItem = (id: string, name: string) => {
    setMarketActionFeedback(null);
    const ok = buyMarketItem(id);
    if (ok) {
      setMarketActionFeedback({ type: 'success', text: `ซื้ออุปกรณ์ "${name}" จากตลาดสำเร็จแล้ว ตรวจสอบไอเทมของคุณที่คลังสินค้าโปรไฟล์!` });
    } else {
      setMarketActionFeedback({ type: 'error', text: `ทอง Gold ของคุณไม่เพียงพอร่วมทำรายการแลกเปลี่ยนชิ้นนี้` });
    }
    setTimeout(() => setMarketActionFeedback(null), 5000);
  };

  const handleBidMarketItem = (id: string, name: string, minBidNeeded: number) => {
    setMarketActionFeedback(null);
    const bidVal = customBidAmounts[id] || minBidNeeded;

    if (bidVal <= minBidNeeded) {
      setMarketActionFeedback({ type: 'error', text: `กรุณากรอกยอดประมูลมากกว่าอัตรารอประมูลเดิมอย่างน้อย 1 Gold` });
      return;
    }

    const ok = bidMarketItem(id, bidVal);
    if (ok) {
      setMarketActionFeedback({ type: 'success', text: `ส่งยอดบิดประมูลจำนวน ${bidVal} Gold สำหรับ "${name}" เรียบร้อยแล้ว!` });
    } else {
      setMarketActionFeedback({ type: 'error', text: `ยอดทองรวมไม่พอประมูล หรือพารามิเตอร์ของระบบมีการเปลี่ยนกระแสงานแล้ว` });
    }
    setTimeout(() => setMarketActionFeedback(null), 5000);
  };

  const handleBuyCashItem = (item: typeof SHOP_CASH_ITEMS[0]) => {
    setMarketActionFeedback(null);
    if (!playerProfile) return;
    if (playerProfile.points < item.points) {
      setMarketActionFeedback({ type: 'error', text: `จำนวนเหรียญ Points ของคุณไม่เพียงพอ (ต้องการ ${item.points} Pts)` });
      return;
    }

    // Deduct points, add to inventory
    topUpPoints(-item.points, 'Cash Shop Purchase');
    
    // Simulate inject into inventory
    listMarketItem(item.name, 1, 0, 'rare', item.category, false); 
    setMarketActionFeedback({ type: 'success', text: `จัดซื้อและปลดล็อกไอเทม "${item.name}" ลงสู่คลังบัญชีแล้ว!` });
    setTimeout(() => setMarketActionFeedback(null), 5000);
  };

  return (
    <div className="space-y-6">
      
      {/* Sub tabs navigation */}
      <div className="flex border-b border-purple-500/10 gap-2 pb-px overflow-x-auto">
        <button
          id="shop-tab-market"
          onClick={() => setActiveSubTab('market')}
          className={`px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeSubTab === 'market' 
              ? 'border-purple-500 text-white' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <GameIcon name="ShoppingBag" size={13} />
          🏪 ตลาดเสรีผู้เล่น (Player Market)
        </button>

        <button
          id="shop-tab-cash"
          onClick={() => setActiveSubTab('cashshop')}
          className={`px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeSubTab === 'cashshop' 
              ? 'border-purple-500 text-white' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <GameIcon name="Crown" size={13} />
          🆕 แคชช็อปของเล่นใหม่ (Point Store)
        </button>

        <button
          id="shop-tab-topup"
          onClick={() => setActiveSubTab('topup')}
          className={`px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 border-b-2 cursor-pointer ${
            activeSubTab === 'topup' 
              ? 'border-purple-500 text-white' 
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <GameIcon name="Coins" size={13} />
          🔥 เติมเงินไอดี (Top Up Cash)
        </button>
      </div>

      {/* Global feedback alerts */}
      {marketActionFeedback && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            marketActionFeedback.type === 'success' 
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold' 
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold'
          }`}
        >
          <GameIcon name={marketActionFeedback.type === 'success' ? 'Check' : 'AlertTriangle'} size={15} />
          <span>{marketActionFeedback.text}</span>
        </motion.div>
      )}

      {/* RENDER ACTIVE SUBTAB CONTENT */}
      {activeSubTab === 'topup' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Quick choices and explanation */}
          <div className="lg:col-span-3 space-y-4">
            <div className="glass rounded-2xl p-5 space-y-3 shadow-md">
              <h3 className="font-bold text-white text-base">ระบบเติมเงินอัตโนมัติ (Automated Top-Up)</h3>
              <p className="text-xs text-purple-300/80 leading-relaxed">
                การผูกระบบชำระเงินตรงเป็นไปอย่างรวดเร็ว โดยใช้เครือข่าย QR PromptPay สแกนได้ทันทีผ่านแอพพลิเคชั่นธนาคารทุกประเภท อัตราการแปลงค่าเฉลี่ย: <span className="font-mono text-amber-300 font-black">1 บาท (THB) = 1 Cash Point (Points)</span>
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {[50, 150, 300, 500, 1000, 2000].map((amount) => (
                  <button
                    key={amount}
                    id={`topup-amount-${amount}`}
                    onClick={() => handleSelectAmount(amount)}
                    className={`p-3 rounded-xl border font-mono text-center transition-all cursor-pointer ${
                      topUpAmount === amount && showQR
                        ? 'bg-purple-600/20 border-purple-500 text-white font-bold shadow-md shadow-purple-500/15'
                        : 'glass-thin border-purple-500/5 hover:border-purple-500/30 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span className="block text-[9px] uppercase text-purple-300/60 font-sans font-bold tracking-wider">เติมจำนวน</span>
                    <span className="font-black text-sm">{amount} THB</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-5 space-y-2 text-xs shadow-md">
              <h4 className="font-bold text-slate-300 uppercase tracking-wider">ขั้นตอนการยืนยันและการช่วยเหลือ</h4>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-400 leading-relaxed">
                <li>เลือกสิทธิผลลัพธ์ยอดจำนวน THB ที่ต้องการป้อนจากรายการปุ่ม</li>
                <li>สแกนปุ่ม QR คราฟต์สลิปที่ฝังไว้และจำลองโครงทางขวา</li>
                <li>เมื่อแอปพลิเคชันขึ้นตัดเงินสำเร็จแล้ว กดปุ่ม <span className="text-purple-400 font-bold font-mono">"ส่งหลักฐานสลิป / ยืนยันอัตโนมัติ"</span> บัฟเงินจะสตรีมมิ่งลงสู่โปรไฟล์ทันที</li>
              </ol>
            </div>
          </div>

          <div className="lg:col-span-2">
            {topUpSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl p-4 text-xs flex items-start gap-2 mb-4 font-bold">
                <GameIcon name="Check" size={16} className="shrink-0 mt-0.5" />
                <span>{topUpSuccess}</span>
              </div>
            )}

            {showQR ? (
              <div className="glass rounded-2xl p-5 text-center space-y-5 shadow-lg border-purple-500/20 accent-glow">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-purple-400 font-black tracking-wider">ระบบ PromptPay QR Code</span>
                  <p className="text-xs text-slate-300 font-medium">ความปลอดภัยสูงสุดระบบอัตโนมัติ</p>
                </div>

                {/* PromptPay stylized simulation box */}
                <div className="mx-auto bg-white p-4 rounded-2xl w-[200px] h-[200px] flex flex-col items-center justify-between border-4 border-slate-900 shadow-xl gap-2 relative">
                  <div className="w-full text-center text-indigo-950 font-black tracking-tight text-xs flex justify-between items-center px-1 border-b pb-1">
                    <span className="text-[9px] bg-indigo-950 text-white px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">Prompt Pay</span>
                    <span>{topUpAmount}.00 THB</span>
                  </div>
                  
                  {/* Pseudo QR code dynamic lines */}
                  <div className="w-[120px] h-[120px] bg-slate-950 rounded flex flex-wrap p-1 gap-1 border-2 border-indigo-950">
                    {[...Array(36)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-4 h-4 rounded-sm transition-colors ${
                          (i % 3 === 0 || i % 5 === 1 || i % 7 === 0) 
                            ? 'bg-white' 
                            : 'bg-indigo-950'
                        }`}
                      />
                    ))}
                    {/* Add corner positioning blocks of QR */}
                    <div className="absolute top-[48px] left-[52px] bg-slate-950 w-7 h-7 border-4 border-slate-200" />
                  </div>

                  <div className="text-[9px] font-mono font-bold text-slate-500 tracking-wider">
                    SCAN BY BANKING APP
                  </div>
                </div>

                <div className="text-xs text-purple-300 font-mono font-bold">
                  ยอดสั่งซื้อ: <span className="font-black text-white text-base">{topUpAmount} THB</span>
                </div>

                <button
                  id="verify-slip-btn"
                  onClick={handleVerifySlip}
                  disabled={isVerifyingSlip}
                  className={`w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    isVerifyingSlip 
                      ? 'bg-slate-950/40 text-slate-500 border border-slate-900/40 cursor-wait'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow shadow-emerald-600/20'
                  }`}
                >
                  {isVerifyingSlip ? (
                    <>
                      <GameIcon name="Hourglass" className="animate-spin" size={14} />
                      กำลังสแกนหาประวัติรายการและสลิป...
                    </>
                  ) : (
                    <>
                      <GameIcon name="Check" size={14} />
                      ส่งหลักฐานสลิป / ยืนยันอัตโนมัติ
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="glass rounded-2xl p-6 text-center text-slate-500 space-y-3 shadow-md">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 mx-auto flex items-center justify-center text-purple-400">
                  <GameIcon name="Coins" size={24} />
                </div>
                <p className="text-xs">กรุณาเลือกหรือป้อนจำนวนเงินทางด้านซ้าย เพื่อสร้าง QR PromptPay ยื่นยันการคลังจำลอง</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'market' && (
        <div className="space-y-6">
          
          {/* Market Place items */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left form to place item for sale */}
            <div className="glass rounded-2xl p-5 space-y-4 h-fit shadow-md">
              <div className="border-b border-purple-500/10 pb-2.5">
                <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <GameIcon name="Plus" className="text-purple-400" />
                  วางขายไอเทมของคุณ (Post Listing)
                </h3>
                <p className="text-[10px] text-purple-300/60 mt-1 leading-relaxed">นำของแรร์ในกระเป๋าคลังสินค้าแยกมาจำหน่ายเป็นทองใช้จ่ายสะสม</p>
              </div>

              {listSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-lg p-3 text-xs font-bold">
                  นำไอเทมขึ้นตั้งแผงบนตลาดกลางเสรี สำเร็จแล้ว!
                </div>
              )}

              <form onSubmit={handleFormList} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-purple-200 font-bold">เลือกจากคลังสินค้าของคุณ:</label>
                  <select
                    id="list-item-select"
                    value={listItemName}
                    onChange={(e) => {
                      setListItemName(e.target.value);
                      const selected = inventory.find(item => item.name === e.target.value);
                      if (selected) {
                        setListCategory(selected.category);
                        setListRarity(selected.rarity);
                      }
                    }}
                    className="w-full bg-slate-950/70 border border-purple-500/20 text-xs text-white rounded-lg p-2.5 focus:outline-none focus:border-purple-500"
                    required
                  >
                    <option value="">-- เลือกของคลังบัญชีที่มีอยู่ --</option>
                    {inventory.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name} (คุณมี {item.quantity} ชิ้น)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs text-purple-200 font-bold">จำนวนที่จะขาย:</label>
                    <input
                      id="list-qty-input"
                      type="number"
                      min={1}
                      value={listQty}
                      onChange={(e) => setListQty(parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-950/70 border border-purple-500/20 text-xs text-white rounded-lg p-2.5 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-purple-200 font-bold">ราคาขายรวม (Gold):</label>
                    <input
                      id="list-price-input"
                      type="number"
                      min={10}
                      value={listPrice}
                      onChange={(e) => setListPrice(parseInt(e.target.value) || 10)}
                      className="w-full bg-slate-950/70 border border-purple-500/20 text-xs text-white rounded-lg p-2.5 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <label className="text-xs text-purple-200 flex items-center gap-1.5 cursor-pointer font-bold">
                    <input 
                      id="list-auction-checkbox"
                      type="checkbox" 
                      checked={listIsAuction}
                      onChange={(e) => setListIsAuction(e.target.checked)}
                      className="rounded bg-slate-950 border-purple-500/20 text-purple-600 focus:ring-purple-500"
                    />
                    เปิดการประมูล (Auction Mode)
                  </label>
                  <p className="text-[10px] text-slate-500 leading-relaxed">หากเปิดโหมดประมูล ราคาดังกล่าวจะถือเป็นราคาขายเริ่มต้น และเปิดให้ผู้อื่นบิดแย่ง 24 ชั่วโมง</p>
                </div>

                <button
                  id="list-market-item-submit"
                  type="submit"
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 font-bold text-xs text-white rounded-lg transition-all cursor-pointer accent-glow"
                >
                  ลงประกาศวางแผง
                </button>
              </form>
            </div>

            {/* Right List of active Market listings */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">รายการประกาศซื้อขาย & การประมูลสด (Open Listings)</h3>
                <span className="text-[10px] text-purple-300 font-mono font-bold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">จำนวน: {marketItems.length} ชิ้น</span>
              </div>

              <div className="space-y-3">
                {marketItems.map((item) => {
                  const minBidNeeded = item.isAuction ? ((item.currentBid || item.price) + 50) : 0;
                  return (
                    <div 
                      key={item.id}
                      className="glass hover:scale-[1.005] hover:border-purple-500/20 p-4 rounded-2xl space-y-3 transition-all shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex gap-2.5">
                          <div className={`p-2 rounded-lg bg-slate-950 border mt-0.5 ${
                            item.rarity === 'legendary' ? 'border-amber-500 text-amber-400' :
                            item.rarity === 'epic' ? 'border-purple-500 text-purple-400' :
                            item.rarity === 'rare' ? 'border-blue-500 text-blue-400' : 'border-slate-850 text-slate-400'
                          }`}>
                            <GameIcon name={item.iconName} size={18} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-white text-xs md:text-sm">{item.itemName}</h4>
                              <span className={`text-[8px] px-1.5 py-0.2 rounded font-mono uppercase border ${
                                item.rarity === 'legendary' ? 'bg-amber-950/20 border-amber-500/30 text-amber-400' :
                                item.rarity === 'epic' ? 'bg-purple-950/20 border-purple-500/30 text-purple-400' : 'bg-slate-950/20 border-slate-800 text-slate-400'
                              }`}>
                                {item.rarity}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              ผู้ตั้งขาย: <span className="text-purple-400 font-bold">{item.sellerName}</span> | จำนวน: {item.quantity} ชิ้น
                            </div>
                          </div>
                        </div>

                        {/* Top Indicator */}
                        <div className="text-right">
                          <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-black tracking-wider ${
                            item.isAuction ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/20' : 'bg-slate-950 text-slate-400'
                          }`}>
                            {item.isAuction ? 'ประมูล' : 'ขายทันที'}
                          </span>
                        </div>
                      </div>

                      {/* Info / Bid details */}
                      <div className="flex flex-wrap items-center justify-between gap-2 glass-thin p-3 rounded-xl border border-purple-500/5 text-xs font-mono">
                        <div>
                          <span className="text-[10px] text-purple-300/50 block font-bold uppercase tracking-wider">ราคาซื้อทันที / บิดเกณฑ์</span>
                          <span className="text-sm font-black text-amber-300">{item.price} Gold</span>
                        </div>

                        {item.isAuction && (
                          <div className="text-right">
                            <span className="text-[10px] text-purple-300/50 block font-bold uppercase tracking-wider">ยอดประมูลปัจจุบัน</span>
                            <span className="text-sm font-black text-indigo-300">
                              {item.currentBid || item.price} Gold
                              {item.highestBidder && (
                                <span className="text-[8px] text-slate-400 block font-normal font-sans">โดย {item.highestBidder}</span>
                              )}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Interactive Actions */}
                      <div className="flex gap-2 justify-end">
                        {item.isAuction ? (
                          <div className="flex gap-1.5 w-full sm:w-auto items-center">
                            <input
                              type="number"
                              min={minBidNeeded}
                              placeholder={`ขั้นต่ำ ${minBidNeeded}`}
                              value={customBidAmounts[item.id] || ''}
                              onChange={(e) => setCustomBidAmounts({
                                ...customBidAmounts,
                                [item.id]: parseInt(e.target.value) || minBidNeeded
                              })}
                              className="bg-slate-950/70 border border-purple-500/15 text-xs text-white rounded-lg p-1.5 font-mono w-[100px] focus:outline-none"
                            />
                            <button
                              id={`bid-btn-${item.id}`}
                              onClick={() => handleBidMarketItem(item.id, item.itemName, minBidNeeded)}
                              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-all cursor-pointer accent-glow-sm"
                            >
                              ลงประมูล
                            </button>
                          </div>
                        ) : (
                          <button
                            id={`buy-market-btn-${item.id}`}
                            onClick={() => handleBuyMarketItem(item.id, item.itemName)}
                            className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow accent-glow-sm"
                          >
                            <GameIcon name="Check" size={12} />
                            ทำรายการซื้อทันที
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {activeSubTab === 'cashshop' && (
        <div className="space-y-4">
          <div className="border-b border-purple-500/10 pb-2.5">
            <h3 className="font-black text-white text-base">🆕 อัปเดตไอเทมใหม่ในช็อป (Exclusive Point Shop)</h3>
            <p className="text-xs text-purple-300/80 leading-relaxed mt-1">ใช้เหรียญ Points ที่ได้มาจากการเติมเงินซื้อของขวัญ คัมภีร์อำนวยความสะดวก หรือสัตว์พาหนะพกพาระดับหรู</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SHOP_CASH_ITEMS.map((item) => (
              <div 
                key={item.id}
                className="glass rounded-2xl hover:scale-[1.01] hover:border-purple-500/20 p-5 space-y-4 transition-all relative flex flex-col justify-between shadow-md"
              >
                {item.isNew && (
                  <div className="absolute top-2 right-2">
                    <span className="text-[8px] bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30 px-1.5 py-0.2 rounded font-mono tracking-wider uppercase">
                      New Item
                    </span>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-lg bg-slate-950 text-purple-400 border border-purple-500/10 shadow-inner">
                      <GameIcon name={item.category === 'Consumable' ? 'GlassWater' : item.category === 'Material' ? 'Scroll' : 'Sparkles'} size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs md:text-sm">{item.name}</h4>
                      <span className="text-[10px] text-purple-300/40 font-mono italic">{item.category}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed min-h-[36px]">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-purple-500/10 flex items-center justify-between gap-2 mt-2">
                  <div className="font-mono">
                    <span className="text-[9px] text-purple-300/40 block font-bold uppercase tracking-wider">ราคาหักหีบ</span>
                    <span className="text-lg font-black text-purple-300">{item.points} <span className="text-xs font-semibold">Points</span></span>
                  </div>
                  <button
                    id={`buy-cash-btn-${item.id}`}
                    onClick={() => handleBuyCashItem(item)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 font-bold text-xs text-white rounded-lg transition-all cursor-pointer accent-glow-sm"
                  >
                    แลกช็อปชิ้นนี้
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
