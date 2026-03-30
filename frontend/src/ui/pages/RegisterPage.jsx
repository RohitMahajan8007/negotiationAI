import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../state/authSlice';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ChevronLeft, UserPlus, ShieldCheck, Sparkles, Globe } from 'lucide-react';
import { toast } from 'react-hot-toast';

const RegisterPage = ({ onSwitch }) => {
    const [registered, setRegistered] = useState(false);
    const [userData, setUserData] = useState({ username: '', email: '', password: '' });
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await dispatch(registerUser(userData));
        if (res.meta.requestStatus === 'fulfilled') {
            toast.success('REGISTRATION COMPLETE: WELCOME TO THE ELITE', { 
                icon: '🚀',
                style: { borderRadius: '12px', background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
            });
            setRegistered(true);
            setTimeout(() => onSwitch(userData.email), 3000); 
        } else if (res.meta.requestStatus === 'rejected') {
            toast.error(res.payload?.message || 'REGISTRATION FAILED');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[#020617]"></div>
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.15, 0.1],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] pointer-events-none"
            ></motion.div>
            <motion.div 
                animate={{ 
                    scale: [1.2, 1, 1.2],
                    opacity: [0.05, 0.1, 0.05],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-emerald/10 rounded-full blur-[100px] pointer-events-none"
            ></motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card w-full max-w-md p-8 md:p-10 relative z-10 border-white/5"
            >
                {registered ? (
                    <div className="text-center space-y-8 py-4">
                        <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto border border-primary/20 shadow-lg shadow-primary/10">
                            <ShieldCheck size={40}/>
                        </div>
                        <div className="space-y-2">
                            <h2 className="title-font text-3xl font-extrabold text-white">ACCESS GRANTED</h2>
                            <p className="text-slate-400 text-sm font-medium">Your negotiator profile has been initialized. Redirecting to the secure terminal...</p>
                        </div>
                        <button onClick={() => onSwitch(userData.email)} className="btn-primary w-full group">
                            Continue to Terminal <ChevronLeft size={18} className="rotate-180 group-hover:translate-x-1 transition-transform"/>
                        </button>
                    </div>
                ) : (
                <>
                <div className="text-center mb-10">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto mb-6 border border-primary/20"
                    >
                        <Globe size={24}/>
                    </motion.div>
                    <h1 className="title-font text-3xl md:text-4xl text-white mb-2 leading-tight">JOIN THE <span className="text-primary italic">ELITE</span></h1>
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-[0.2em]">Start Your Negotiation Journey</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 tracking-wider">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18}/>
                            <input 
                                className="input-field pl-12"
                                type="text"
                                placeholder="E.g. Rohit Mahajan"
                                value={userData.fullName}
                                onChange={(e) => setUserData({...userData, fullName: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 tracking-wider">Username</label>
                        <div className="relative group">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18}/>
                            <input 
                                className="input-field pl-12"
                                type="text"
                                placeholder="elitetrader_01"
                                value={userData.username}
                                onChange={(e) => setUserData({...userData, username: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 tracking-wider">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18}/>
                            <input 
                                className="input-field pl-12"
                                type="email"
                                placeholder="name@negotiator.ai"
                                value={userData.email}
                                onChange={(e) => setUserData({...userData, email: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 tracking-wider">Security Key</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18}/>
                            <input 
                                className="input-field pl-12"
                                type="password"
                                placeholder="••••••••"
                                value={userData.password}
                                onChange={(e) => setUserData({...userData, password: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs font-bold text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-primary w-full py-3.5 mt-4 group"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                                Processing...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                Create Account <UserPlus size={18}/>
                            </span>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
                    <button 
                        onClick={() => onSwitch()}
                        className="text-slate-400 hover:text-primary text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:translate-x-[-2px]"
                    >
                        <ChevronLeft size={16}/> Already have an account? Sign In
                    </button>
                    <div className="flex items-center gap-2 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                        <Sparkles size={12} className="text-primary/50"/> AI-POWERED PLATFORM
                    </div>
                </div>
                </>
                )}
            </motion.div>
        </div>
    );
};

export default RegisterPage;
