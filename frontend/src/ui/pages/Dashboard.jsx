import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, TrendingUp, Award, Clock, ArrowRight, LogOut, LayoutGrid, ShoppingCart, User as UserIcon, CheckCircle, Shield, CreditCard, Sparkles, Zap, Target, Trophy, Trash2, RotateCw, Menu, X, ChevronRight, Globe, Layers, BarChart3, Settings } from 'lucide-react';
import { logout, fetchMe, topUpCredits, updateProfile } from '../../state/authSlice';
import { fetchLeaderboard, fetchHistory, wipeNegotiation } from '../../state/negotiationSlice';
import { toast } from 'react-hot-toast';

const SettingsModal = ({ user, onClose, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.fullName || '');
    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('********');

    useEffect(() => {
        if (user) {
            setName(user.fullName || '');
            setUsername(user.username || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleSave = () => {
        onSave({ 
            fullName: name, 
            username, 
            email, 
            password: password === '********' ? '' : password 
        });
        setIsEditing(false);
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-6"
        >
            <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="glass-card w-full max-w-md p-8 border-primary/20 bg-slate-900/90 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>
                <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors">
                    <X size={20}/>
                </button>

                {!isEditing ? (
                    <div className="text-center space-y-8 py-4">
                        <div className="relative inline-block">
                             <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto border-2 border-primary/20 shadow-2xl shadow-primary/10">
                                 <UserIcon size={44} />
                             </div>
                             <button 
                                onClick={() => setIsEditing(true)}
                                className="absolute -bottom-2 -right-2 p-2.5 bg-primary text-black rounded-xl hover:scale-110 transition-transform shadow-xl shadow-primary/20"
                             >
                                 <Settings size={18}/>
                             </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-black text-white tracking-tight">{user?.fullName || user?.username || 'Negotiator'}</h2>
                                <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">Verified Merchant Hub</p>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-2 pt-2">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-primary/20 transition-all">
                                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Login ID:</span>
                                     <span className="text-xs font-bold text-white uppercase tracking-wider">@{user?.username}</span>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-primary/20 transition-all">
                                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Encrypted Mail:</span>
                                     <span className="text-xs font-bold text-slate-300 italic">{user?.email || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                             <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 inline-flex items-center gap-2 text-emerald-500">
                                  <Shield size={14}/>
                                  <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Security Active</span>
                             </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center space-y-6">
                        <div className="space-y-2 mb-8">
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Modify Identity</h2>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] italic">Accessing core account data...</p>
                        </div>

                        <div className="space-y-4 text-left">
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase font-bold text-slate-600 ml-1">Full Name</label>
                                    <input className="input-field bg-black/40" type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] uppercase font-bold text-slate-600 ml-1">Username</label>
                                    <input className="input-field bg-black/40" type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                                </div>
                             </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-slate-600 ml-1">Email Terminal</label>
                                <input className="input-field bg-black/40" type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-slate-600 ml-1">Access Cipher (Password)</label>
                                <input className="input-field bg-black/40" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}/>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setIsEditing(false)} className="px-6 py-4 rounded-xl border border-white/5 text-slate-500 font-bold uppercase text-xs tracking-widest hover:bg-white/5 transition-all">Cancel</button>
                                <button onClick={handleSave} className="btn-primary flex-1 py-4 text-xs font-bold uppercase tracking-widest shadow-xl shadow-primary/20">Commit Changes</button>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

const WalletModal = ({ user, history, onClose }) => {
    const finalizedDeals = history
        .filter(h => h.status?.toLowerCase() === 'accepted')
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));

    return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-6"
        >
            <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="glass-card w-full max-w-md p-0 border-primary/20 bg-slate-900/90 overflow-hidden shadow-2xl"
            >
                {/* Modal Header */}
                <div className="p-6 pb-4 border-b border-white/5 relative">
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors">
                        <X size={18}/>
                    </button>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2.5 bg-primary/10 rounded-xl text-primary border border-primary/20">
                            <CreditCard size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Elite Wallet</h2>
                            <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wider">Asset Management Terminal</p>
                        </div>
                    </div>
                </div>

                {/* Balance Section */}
                <div className="p-6 bg-black/20 border-b border-white/5 flex justify-between items-center">
                    <div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Available Credits</span>
                        <span className="text-3xl font-black text-white font-mono tracking-tighter">${user?.credits?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center justify-end gap-1.5 text-[9px] font-bold text-emerald-500 uppercase tracking-widest mb-1">
                             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                             Active
                        </div>
                        <span className="text-[9px] text-slate-600 font-medium">RSA-4096 Secured</span>
                    </div>
                </div>

                {/* Recent Transactions List */}
                <div className="p-6 space-y-4 max-h-[280px] overflow-y-auto custom-scrollbar">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Acquisition Log</span>
                    {finalizedDeals.length > 0 ? (
                        finalizedDeals.map((h, i) => (
                            <div key={i} className="flex justify-between items-center p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all">
                                <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-primary">
                                         <Package size={16}/>
                                     </div>
                                     <div>
                                         <p className="text-xs font-bold text-white capitalize">{h.productId.replace(/-/g, ' ')}</p>
                                         <p className="text-[9px] text-slate-500 font-medium uppercase font-mono">{new Date(h.updatedAt || h.createdAt).toLocaleDateString()}</p>
                                     </div>
                                </div>
                                <div className="text-right">
                                     <p className="text-xs font-bold text-white font-mono">-${h.currentPrice?.toLocaleString() || h.offer?.toLocaleString()}</p>
                                     <div className="text-[8px] font-bold text-emerald-500 uppercase tracking-tighter py-0.5 px-1.5 bg-emerald-500/10 rounded w-fit ml-auto">Confirmed</div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 opacity-40">
                             <Clock size={24} className="mx-auto mb-3 text-slate-500"/>
                             <p className="text-[10px] font-bold uppercase tracking-widest leading-none">Terminal Silent</p>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-5 bg-slate-900 border-t border-white/5 flex gap-3">
                     <button onClick={onClose} className="btn-primary w-full py-3 text-xs font-bold shadow-xl shadow-primary/10 tracking-widest uppercase">Dismiss</button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const Dashboard = ({ onSelectItem }) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { leaderboard, sessionHistory } = useSelector(state => state.negotiation);
    const [activeTab, setActiveTab] = useState('marketplace');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isWalletOpen, setIsWalletOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchLeaderboard());
        if (user) {
            dispatch(fetchHistory(user.username));
            dispatch(fetchMe(user.username));
        }
    }, [user?.username, dispatch]);

    const handleUpdateProfile = async (data) => {
        dispatch(updateProfile({ 
            currentUsername: user.username, 
            username: data.username, 
            fullName: data.fullName, 
            email: data.email, 
            password: data.password 
        }));
        toast.success("Identity updated successfully!");
        setIsSettingsOpen(false);
    };

    const items = [
        { id: 'watch-01', name: 'Precision Chronograph', price: 2000, img: 'https://images.pexels.com/photos/280250/pexels-photo-280250.jpeg?auto=compress&cs=tinysrgb&w=800', difficulty: 'Advanced', active: true, tag: 'Limited' },
        { id: 'drone-02', name: 'Phantom Recon X', price: 4500, img: 'https://images.pexels.com/photos/595804/pexels-photo-595804.jpeg?auto=compress&cs=tinysrgb&w=800', difficulty: 'Medium', active: true, tag: 'Popular' },
        { id: 'suit-03', name: 'Exo-Armor Mesh', price: 12000, img: 'https://images.pexels.com/photos/1721516/pexels-photo-1721516.jpeg?auto=compress&cs=tinysrgb&w=800', difficulty: 'Elite', active: true, tag: 'Tactical' },
        { id: 'jetpack-04', name: 'Aero-Thruster V3', price: 25000, img: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=800', difficulty: 'Legendary', active: true, tag: 'Exclusive' },
        { id: 'rig-05', name: 'Neural Processing Core', price: 8000, img: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800', difficulty: 'High', active: true, tag: 'Pro' },
        { id: 'eye-06', name: 'Optic Enhancement', price: 1500, img: 'https://images.pexels.com/photos/7060699/pexels-photo-7060699.jpeg?auto=compress&cs=tinysrgb&w=400', difficulty: 'Basic', active: true, tag: 'Utility' },
        { id: 'hand-07', name: 'Bionic Foundation', price: 3200, img: 'https://images.pexels.com/photos/4145447/pexels-photo-4145447.jpeg?auto=compress&cs=tinysrgb&w=400', difficulty: 'Medium', active: true, tag: 'Industrial' },
        { id: 'chip-08', name: 'Sync Nexus-X', price: 5000, img: 'https://images.pexels.com/photos/357273/pexels-photo-357273.jpeg?auto=compress&cs=tinysrgb&w=400', difficulty: 'Advanced', active: true, tag: 'Neural' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'history':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="flex flex-col">
                            <h2 className="text-3xl font-bold text-white mb-1">Negotiation Logs</h2>
                            <p className="text-slate-500 text-sm">A complete record of your finalized market interactions.</p>
                        </div>
                        <div className="space-y-3">
                            {(() => {
                                const finalizedMissions = sessionHistory
                                    .filter(h => h.status?.toLowerCase() === 'accepted' || h.status?.toLowerCase() === 'rejected')
                                    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));

                                return finalizedMissions.length > 0 ? 
                                 finalizedMissions.map((h, i) => (
                                        <div key={i} className="glass-card p-5 flex justify-between items-center group/item hover:border-primary/30">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-xl ${h.status?.toLowerCase() === 'accepted' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                    <Package size={20}/>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-white mb-0.5 capitalize">{h.productId.replace(/-/g, ' ')}</h4>
                                                    <p className="text-[11px] font-medium text-slate-500 flex items-center gap-2">
                                                        {h.status?.toLowerCase() === 'accepted' ? (
                                                            <span className="flex items-center gap-1 text-emerald-400"><CheckCircle size={10}/> Success</span>
                                                        ) : (
                                                            <span className="flex items-center gap-1 text-rose-400"><X size={10}/> Terminated</span>
                                                        )}
                                                        <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                                                        {new Date(h.updatedAt || h.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <span className="text-lg font-bold text-white">${h.currentPrice.toLocaleString()}</span>
                                                    <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Final Value</span>
                                                </div>
                                                <button 
                                                    onClick={() => {
                                                        if(window.confirm('Delete this record permanently?')) {
                                                            dispatch(wipeNegotiation({ userId: user.username, productId: h.productId }));
                                                        }
                                                    }}
                                                    className="p-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg transition-all"
                                                >
                                                    <Trash2 size={16}/>
                                                </button>
                                            </div>
                                        </div>
                                 )) : (
                                    <div className="text-center py-24 glass-card border-dashed">
                                        <Clock className="mx-auto text-slate-700 mb-4 w-12 h-12" />
                                        <p className="text-slate-500 text-sm font-medium">No finalized sessions found.</p>
                                    </div>
                                );
                            })()}
                        </div>
                    </motion.div>
                );
            case 'leaderboard':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="flex flex-col">
                            <h2 className="text-3xl font-bold text-white mb-1">Global Rankings</h2>
                            <p className="text-slate-500 text-sm">The world's top negotiators based on deal performance.</p>
                        </div>
                        <div className="glass-card overflow-hidden">
                             <div className="p-2">
                                {leaderboard.map((l, i) => (
                                    <div key={i} className={`p-4 rounded-xl flex justify-between items-center transition-all ${l.username === user?.username ? 'bg-primary/10 border border-primary/20' : 'hover:bg-white/5'}`}>
                                        <div className="flex items-center gap-5">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-amber-400 text-black' : i === 1 ? 'bg-slate-300 text-black' : i === 2 ? 'bg-orange-500 text-black' : 'bg-slate-800 text-slate-400'}`}>
                                                {i + 1}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/5">
                                                    <UserIcon size={18} className="text-slate-400"/>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-white leading-tight">{l.fullName || l.username}</h4>
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">@{l.username}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-bold text-primary block">
                                                {l.totalDeals || 0} Successful Deals
                                            </span>
                                            <span className="text-[10px] text-slate-500 font-medium">
                                                Avg. Rounds: {l.avgRounds || '0.0'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                );
            case 'marketplace':
            default:
                return (
                    <div className="space-y-10">
                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div 
                                whileHover={{ y: -4 }}
                                onClick={() => setIsWalletOpen(true)}
                                className="glass-card p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20 cursor-pointer group transition-all"
                            >
                                <div className="flex justify-between items-start mb-4">
                                     <div className="p-2.5 bg-primary/20 rounded-xl text-primary group-hover:scale-110 transition-transform">
                                         <CreditCard size={20}/>
                                     </div>
                                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Balance</span>
                                </div>
                                <h3 className="text-3xl font-bold text-white font-mono">${user?.credits?.toLocaleString() || '50,000'}</h3>
                                <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-tighter italic">Global Negotiator Credits</p>
                            </motion.div>
                            
                            <motion.div 
                                whileHover={{ y: -4 }}
                                onClick={() => setActiveTab('leaderboard')}
                                className="glass-card p-6 cursor-pointer group hover:border-primary/40 transition-all"
                            >
                                <div className="flex justify-between items-start mb-4">
                                     <div className="p-2.5 bg-accent-emerald/20 rounded-xl text-emerald-500 group-hover:scale-110 transition-transform">
                                         <TrendingUp size={20}/>
                                     </div>
                                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Rank</span>
                                </div>
                                <h3 className="text-3xl font-bold text-white">
                                    {(() => {
                                        const rankIndex = leaderboard.findIndex(l => l.username?.toLowerCase() === user?.username?.toLowerCase());
                                        return rankIndex === -1 ? 'None' : `#${rankIndex + 1}`;
                                    })()}
                                </h3>
                                <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-tighter">Based on success rate</p>
                            </motion.div>
                        </div>

                        {/* Inventory Section */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Open Market</h2>
                                    <p className="text-slate-500 text-sm">Select an asset to begin a negotiation with the AI seller.</p>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg border border-white/5">
                                    <Globe size={14} className="text-slate-400"/>
                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Live Updates</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {items.map((item, i) => (
                                    <motion.div 
                                        key={i} 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="glass-card glass-card-hover p-4 group flex flex-col h-full"
                                    >
                                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4">
                                            <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute top-3 right-3 shrink-0">
                                                <span className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[9px] font-bold text-white uppercase tracking-wider border border-white/10">{item.tag}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col flex-grow gap-4">
                                            <div>
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors pr-2">{item.name}</h3>
                                                    <span className="text-primary font-mono font-bold whitespace-nowrap">${item.price.toLocaleString()}</span>
                                                </div>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1.5">
                                                    <Target size={10} className="text-primary"/> Level: {item.difficulty}
                                                </p>
                                            </div>
                                            <button onClick={() => onSelectItem(item.id)} className="btn-primary w-full mt-auto text-sm group/btn">
                                                Negotiate <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 flex selection:bg-primary selection:text-white overflow-hidden">
            {/* Sidebar */}
            <aside className={`fixed lg:sticky top-0 left-0 h-screen z-50 border-r border-white/5 bg-[#020817] flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0 lg:w-72 overflow-hidden'}`}>
                <div className="p-8 pt-12 pb-10 flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-primary/20">ED</div>
                    <div className="flex flex-col">
                        <span className="text-lg font-black text-white leading-none tracking-tight">EliteDeal</span>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Negotiator AI</span>
                    </div>
                </div>

                <nav className="flex-grow px-4 space-y-1.5">
                    {[
                        { id: 'marketplace', icon: LayoutGrid, label: 'Market' },
                        { id: 'history', icon: Clock, label: 'Logs' },
                        { id: 'leaderboard', icon: BarChart3, label: 'Rankings' },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button 
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }} 
                                className={`flex items-center gap-4 w-full px-5 py-3.5 rounded-xl transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                <Icon size={18}/> 
                                <span className="text-sm font-semibold">{tab.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="px-4 py-6 mt-auto border-t border-white/5 space-y-6">
                    <div 
                        onClick={() => setIsSettingsOpen(true)}
                        className="flex items-center justify-between px-2 cursor-pointer hover:bg-white/5 rounded-xl py-2 transition-all group"
                    >
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform shrink-0">
                                <UserIcon size={20} className="text-primary"/>
                            </div>
                            <div className="flex flex-col min-w-0">
                                <p className="text-sm font-bold text-white truncate">{user?.fullName || user?.username || 'Negotiator'}</p>
                            </div>
                        </div>
                        <div className="p-2 text-slate-600 hover:text-primary transition-colors hover:bg-primary/10 rounded-lg group-hover:translate-x-0.5 transition-all">
                             <Settings size={16}/>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <button onClick={() => dispatch(logout())} className="flex items-center gap-4 w-full px-5 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all font-bold">
                            <LogOut size={18}/> <span className="text-sm uppercase tracking-widest">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        onClick={() => setIsSidebarOpen(false)} 
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" 
                    />
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-grow flex flex-col h-screen relative">
                {/* Header shifted down slightly */}
                <header className="h-24 border-b border-white/5 flex items-center justify-between px-6 lg:px-12 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-40 pt-4">
                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-400 hover:text-white">
                        <Menu size={24}/>
                    </button>
                    
                    <div className="hidden lg:flex items-center gap-4">
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Dashboard</h2>
                        <ChevronRight size={14} className="text-slate-600"/>
                        <span className="text-sm font-bold text-white uppercase tracking-[0.2em]">{activeTab}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <motion.div whileHover={{ scale: 1.05 }} className="bg-slate-800/80 px-4 py-2 rounded-xl flex items-center gap-2 border border-white/5">
                            <CreditCard size={14} className="text-primary"/>
                            <span className="text-sm font-mono font-bold text-white">${user?.credits?.toLocaleString() || '0'}</span>
                        </motion.div>
                    </div>
                </header>

                <div className="flex-grow overflow-y-auto p-6 lg:p-12">
                    <div className="max-w-7xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={activeTab} 
                                initial={{ opacity: 0, scale: 0.98 }} 
                                animate={{ opacity: 1, scale: 1 }} 
                                exit={{ opacity: 0, scale: 0.98 }} 
                                transition={{ duration: 0.2 }}
                            >
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {isSettingsOpen && (
                    <SettingsModal 
                        user={user} 
                        onClose={() => setIsSettingsOpen(false)} 
                        onSave={handleUpdateProfile} 
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isWalletOpen && (
                    <WalletModal 
                        user={user} 
                        history={sessionHistory}
                        onClose={() => setIsWalletOpen(false)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
