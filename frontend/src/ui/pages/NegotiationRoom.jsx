import React, { useState, useEffect, useRef } from 'react';
import useNegotiation from '../../hooks/useNegotiation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { logout, topUpCredits } from '../../state/authSlice';
import { Send, TrendingDown, Award, RefreshCw, ShoppingCart, Info, User as UserIcon, CheckCircle2, LogOut, ChevronLeft, Bot, MessageSquare, Cpu, Brain, Zap, CreditCard, RotateCw, Target, Shield, Clock, Sparkles } from 'lucide-react';
import { startMission, submitOffer, fetchLeaderboard, resetGame, finalisePurchase } from '../../state/negotiationSlice';
import { toast } from 'react-hot-toast';

const SuccessModal = ({ price, onNew, onBack }) => {
    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="fixed inset-0 z-[200] flex items-start justify-center pt-32 bg-black/80 backdrop-blur-xl p-6"
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ x: Math.random() * 100 + "%", y: "100%", opacity: 0.5 }}
                        animate={{ y: "-10%", opacity: 0 }}
                        transition={{ duration: Math.random() * 2 + 1, repeat: Infinity, delay: Math.random() * 2 }}
                        className="absolute w-1 h-1 bg-primary rounded-full"
                    />
                ))}
            </div>

            <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="glass-card w-full max-w-md p-0 border-emerald-500/20 bg-slate-900/90 overflow-hidden shadow-2xl relative"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/50 via-emerald-500 to-emerald-500/50"></div>
                
                <div className="p-8 text-center space-y-6">
                    <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 12 }}
                        className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500 mx-auto border-2 border-emerald-500/20 shadow-xl shadow-emerald-500/10"
                    >
                        <Shield size={40} className="animate-pulse" />
                    </motion.div>

                    <div className="space-y-2">
                         <h2 className="text-3xl font-black text-white uppercase tracking-tight">Success Secured</h2>
                         <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] italic">Acquisition Protocols Finalized</p>
                    </div>

                    <div className="py-6 px-4 bg-black/40 rounded-2xl border border-white/5 space-y-1">
                         <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Final Asset Valuation</span>
                         <span className="text-4xl font-black text-white font-mono tracking-tighter">${price.toLocaleString()}</span>
                    </div>

                    <div className="space-y-3 pt-4">
                        <button 
                            onClick={onNew} 
                            className="btn-primary w-full py-4 text-xs font-bold uppercase tracking-[0.2em] shadow-xl shadow-primary/20"
                        >
                            New Mission
                        </button>
                        <button 
                            onClick={onBack} 
                            className="w-full py-4 rounded-xl border border-white/5 text-slate-500 font-bold uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all"
                        >
                            Return to Marketplace
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const NegotiationRoom = ({ itemId, onBack }) => {
    const { game, history: reduxHistory, leaderboard, start, offer, leaderboardFetch, reset, status } = useNegotiation();
    const { user } = useSelector(state => state.auth);
    const userId = user?.username || 'Guest';
    
    const [message, setMessage] = useState('');
    const [userOffer, setUserOffer] = useState(1500);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    
    const [localHistory, setLocalHistory] = useState([]);
    const chatEndRef = useRef(null);
    const dispatch = useDispatch();
    const [isPaying, setIsPaying] = useState(false);
    const [hasPaid, setHasPaid] = useState(false);

    useEffect(() => {
        if (!isGameStarted && userId !== 'Guest' && itemId) {
            console.log("%cAI Subsystem: Connected to Merchant AI", "color: #6366f1; font-weight: bold; font-size: 12px;");
            start(userId, itemId);
            setIsGameStarted(true);
            leaderboardFetch();
        }
    }, [userId, itemId]);

    useEffect(() => {
        if (reduxHistory.length > 0) {
            setLocalHistory(reduxHistory);
            if (reduxHistory[reduxHistory.length - 1].sender === 'ai') {
                setIsThinking(false);
            }
        }
    }, [reduxHistory]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [localHistory, isThinking]);

    const handleOffer = (e) => {
        e.preventDefault();
        if (message && userOffer && !isThinking) {
            const newUserMessage = {
                sender: 'user',
                message: message,
                offer: Number(userOffer),
                timestamp: new Date()
            };
            setLocalHistory(prev => [...prev, newUserMessage]);
            setIsThinking(true);
            offer({ userId, message, offer: Number(userOffer) });
            setMessage('');
        }
    };

    if (!isGameStarted) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#020617]">
                <div className="relative">
                    <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} 
                        className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full"
                    />
                    <div className="absolute inset-x-0 -bottom-8 flex justify-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] animate-pulse">Initializing Terminal...</span>
                    </div>
                </div>
            </div>
        );
    }

    const currentItem = {
        'watch-01': { name: 'Precision Chronograph', img: 'https://images.pexels.com/photos/280250/pexels-photo-280250.jpeg?auto=compress&cs=tinysrgb&w=800' },
        'drone-02': { name: 'Phantom Recon X', img: 'https://images.pexels.com/photos/595804/pexels-photo-595804.jpeg?auto=compress&cs=tinysrgb&w=800' },
        'suit-03': { name: 'Exo-Armor Mesh', img: 'https://images.pexels.com/photos/1721516/pexels-photo-1721516.jpeg?auto=compress&cs=tinysrgb&w=800' },
        'jetpack-04': { name: 'Aero-Thruster V3', img: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=800' },
        'rig-05': { name: 'Neural Core', img: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800' }
    }[itemId] || { name: itemId?.replace(/-/g, ' '), img: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800' };

    return (
        <div className="h-screen flex flex-col lg:flex-row bg-[#020617] text-slate-200 selection:bg-primary/30 overflow-hidden font-inter">
            {/* Asset Sidebar */}
            <aside className="w-full lg:w-80 p-6 lg:p-8 border-b lg:border-r border-white/5 bg-[#020817] flex flex-col gap-6 relative z-10 shrink-0 overflow-y-auto custom-scrollbar">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider group w-fit"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Close Session
                </button>

                <div className="space-y-4">
                    <div className="relative group rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                        <img src={currentItem.img} alt={currentItem.name} className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                            <h2 className="font-bold text-white leading-tight">{currentItem.name}</h2>
                        </div>
                    </div>

                    <div className="p-5 glass-card bg-primary/5 border-primary/20">
                         <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Target Valuation</span>
                         <span className="text-2xl font-bold text-white font-mono">${game?.currentPrice?.toLocaleString() || '2,000'}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                         <div className="glass-card p-4 bg-white/5">
                             <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Session</span>
                             <span className="text-sm font-bold text-white">Round 0{Math.ceil(localHistory.length/2)}</span>
                         </div>
                         <div className="glass-card p-4 bg-white/5">
                             <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Credit Limit</span>
                             <span className="text-sm font-bold text-primary">${user?.credits?.toLocaleString() || '0'}</span>
                         </div>
                    </div>

                    <div className="glass-card p-4 bg-white/5 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Merchant Trust</span>
                            <span className="text-[10px] font-bold text-primary">{Math.min(100, 20 + (localHistory.length * 5))}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: `${Math.min(100, 20 + (localHistory.length * 5))}%` }} 
                                className="h-full bg-primary" 
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
                     <div className="flex items-center gap-3 p-3 glass-card bg-slate-800/50">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                              <Shield size={16}/>
                          </div>
                          <div>
                              <p className="text-[10px] font-bold text-white uppercase tracking-wider leading-none mb-1">Secure Protocol</p>
                              <p className="text-[9px] text-slate-500 font-medium">End-to-end encrypted</p>
                          </div>
                     </div>
                </div>
            </aside>

            {/* Chat Area */}
            <main className="flex-grow flex flex-col relative h-full">
                {/* Chat Header (Mobile only) */}
                <div className="lg:hidden h-16 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl flex items-center px-6 sticky top-0 z-20">
                    <button onClick={onBack} className="p-2 -ml-2 text-slate-400">
                        <ChevronLeft size={20}/>
                    </button>
                    <span className="ml-2 text-sm font-bold text-white truncate">{currentItem.name}</span>
                </div>

                {/* Messages */}
                <div className="flex-grow overflow-y-auto p-6 lg:p-10 space-y-8 custom-scrollbar">
                    {localHistory.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-4">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 mb-2">
                                <MessageSquare size={32}/>
                            </div>
                            <h3 className="text-xl font-bold text-white">System Ready</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">Agent has initialized the session. Make an initial offer to begin the negotiation.</p>
                        </div>
                    )}

                    <AnimatePresence initial={false}>
                        {localHistory.map((h, i) => (
                            <motion.div 
                                key={i} 
                                initial={{ opacity: 0, y: 15 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                className={`flex ${h.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
                            >
                                <div className={`flex flex-col gap-2 max-w-[85%] md:max-w-[70%]`}>
                                    <div className={`flex items-center gap-2 mb-1 ${h.sender === 'ai' ? 'flex-row' : 'flex-row-reverse'}`}>
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shadow-sm ${h.sender === 'ai' ? 'bg-slate-800 border-white/10 text-primary' : 'bg-primary border-primary/20 text-white'}`}>
                                            {h.sender === 'ai' ? <Brain size={16}/> : <UserIcon size={16}/>}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{h.sender === 'ai' ? 'Merchant AI' : 'You'}</span>
                                        <span className="text-[9px] text-slate-700 font-medium uppercase font-mono">{new Date(h.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className={`p-4 md:p-6 shadow-xl ${h.sender === 'ai' ? 'bg-slate-900 border border-white/5 text-slate-200 rounded-2xl rounded-tl-none' : 'bg-primary text-white rounded-2xl rounded-tr-none'}`}>
                                         <p className="text-sm md:text-base leading-relaxed whitespace-pre-line font-medium">{h.message}</p>
                                         <div className={`mt-5 pt-4 border-t ${h.sender === 'ai' ? 'border-white/5' : 'border-white/10'} flex items-center justify-between`}>
                                             <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${h.sender === 'ai' ? 'text-slate-500' : 'text-white/60'}`}>Proposed Price</span>
                                             <span className="text-xl font-bold font-mono tracking-tight">${h.offer.toLocaleString()}</span>
                                         </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isThinking && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                             <div className="bg-slate-900 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                                 <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full" />
                                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Agent is analyzing proposal...</span>
                             </div>
                        </motion.div>
                    )}
                    <div ref={chatEndRef} className="h-4" />
                </div>

                {/* Input Controls */}
                <div className="p-6 lg:p-8 bg-[#020817]/95 backdrop-blur-xl border-t border-white/5 relative z-10">
                    <AnimatePresence mode="wait">
                        {game?.status === 'accepted' ? (
                            <motion.div key="accepted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 text-center">
                            {!hasPaid ? (
                                <div className="max-w-xl mx-auto glass-card p-8 border-emerald-500/20 bg-emerald-500/5">
                                    <div className="space-y-6">
                                        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mx-auto border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                                            <CheckCircle2 size={32}/>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white mb-2">Deal Finalized</h2>
                                            <p className="text-slate-400 text-sm font-medium">The merchant has accepted your offer of <span className="text-white font-bold font-mono">${game.currentPrice.toLocaleString()}</span>.</p>
                                        </div>
                                        <div className="flex flex-col gap-4">
                                             <button 
                                                 disabled={isPaying}
                                                 onClick={async () => {
                                                     setIsPaying(true);
                                                     await dispatch(finalisePurchase({ userId, productId: itemId, amount: game.currentPrice }));
                                                     setHasPaid(true);
                                                     setIsPaying(false);
                                                 }}
                                                 className="btn-primary w-full py-5 text-lg shadow-2xl active:scale-95 group flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-indigo-600 border-none"
                                             >
                                                 {isPaying ? <RotateCw className="animate-spin" size={24}/> : <><CreditCard size={24} className="group-hover:rotate-12 transition-transform"/> SECURE CHECKOUT</>}
                                             </button>
                                             <div className="flex items-center justify-center gap-6 text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] opacity-60">
                                                 <span className="flex items-center gap-1.5"><Shield size={12}/> RSA Encryption</span>
                                                 <span className="flex items-center gap-1.5"><CreditCard size={12}/> PCI Compliant</span>
                                             </div>
                                         </div>
                                    </div>
                                </div>
                            ) : (
                                <SuccessModal 
                                    price={game.currentPrice} 
                                    onNew={() => location.reload()} 
                                    onBack={onBack} 
                                />
                            )}
                        </motion.div>
                        ) : game?.status === 'rejected' ? (
                            <motion.div key="rejected" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto glass-card p-8 border-rose-500/20 bg-rose-500/5 text-center space-y-6">
                                <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 mx-auto border border-rose-500/20 shadow-lg shadow-rose-500/10">
                                    <LogOut size={32}/>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Session Terminated</h2>
                                    <p className="text-slate-400 text-sm font-medium">The negotiation was unsuccessful. The merchant has withdrawn from the deal.</p>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => location.reload()} className="btn-secondary flex-grow py-3 text-rose-400 border-rose-500/10 hover:bg-rose-500/5">Attempt Re-entry</button>
                                    <button onClick={onBack} className="btn-primary bg-slate-800 hover:bg-slate-700 flex-grow py-3 shadow-none">Back to Market</button>
                                </div>
                            </motion.div>
                        ) : ( 
                            <form key="negotiating" onSubmit={handleOffer} className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 items-stretch">
                                <div className="flex-grow space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Strategy & Message</label>
                                    <div className="relative glass-card bg-slate-900 border-white/10 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/5 transition-all p-2 pr-14 min-h-[60px] flex items-center">
                                        <textarea 
                                            className="bg-transparent w-full p-2 outline-none resize-none text-sm text-slate-100 font-medium custom-scrollbar h-[44px]" 
                                            placeholder={isThinking ? "System is busy..." : "Formulate your negotiation argument here..."} 
                                            value={message} 
                                            onChange={(e) => setMessage(e.target.value)} 
                                            disabled={isThinking}
                                        />
                                        <button 
                                            type="submit" 
                                            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all shadow-lg ${!message || isThinking ? 'bg-slate-800 text-slate-500' : 'bg-primary text-white hover:scale-105 active:scale-95'}`} 
                                            disabled={!message || isThinking}
                                        >
                                            <Send size={20}/>
                                        </button>
                                    </div>
                                </div>
                                <div className="md:w-56 shrink-0 space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Your Offer Bid</label>
                                    <div className="relative glass-card bg-slate-900 border-white/10 focus-within:border-primary/40 p-2 flex items-center gap-3">
                                        <div className="pl-3 text-slate-500 font-bold">$</div>
                                        <input 
                                            type="number" 
                                            className="bg-transparent w-full text-xl font-bold font-mono outline-none text-white py-1.5" 
                                            value={userOffer} 
                                            onChange={(e) => setUserOffer(e.target.value)} 
                                            disabled={isThinking}
                                        />
                                    </div>
                                </div>
                            </form>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default NegotiationRoom;
