import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../state/authSlice';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ChevronRight, ShieldCheck, Sparkles, Globe } from 'lucide-react';
import { toast } from 'react-hot-toast';

const LoginPage = ({ onSwitch, prefilledEmail }) => {
    const [credentials, setCredentials] = useState({ 
        email: prefilledEmail || '', 
        password: '' 
    });
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.auth);

    useEffect(() => {
        if (prefilledEmail) {
            setCredentials(prev => ({ ...prev, email: prefilledEmail }));
        }
    }, [prefilledEmail]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await dispatch(loginUser(credentials));
        if (res.meta.requestStatus === 'fulfilled') {
            toast.success('ACCESS GRANTED: WELCOME BACK', { 
                icon: '🔑',
                style: { borderRadius: '12px', background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
            });
        } else if (res.meta.requestStatus === 'rejected') {
            toast.error(res.payload?.message || 'ACCESS DENIED');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[#020617]"></div>
            <motion.div 
                animate={{ 
                    scale: [1.2, 1, 1.2],
                    opacity: [0.1, 0.15, 0.1],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] pointer-events-none"
            ></motion.div>
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.05, 0.1, 0.05],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-emerald/10 rounded-full blur-[100px] pointer-events-none"
            ></motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card w-full max-w-md p-8 md:p-10 relative z-10 border-white/5"
            >
                <div className="text-center mb-10">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto mb-6 border border-primary/20"
                    >
                        <Globe size={24}/>
                    </motion.div>
                    <h1 className="title-font text-3xl md:text-4xl text-white mb-2 leading-tight uppercase font-black">ELITE <span className="text-primary italic">ACCESS</span></h1>
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-[0.2em]">Secure Terminal Login</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 tracking-wider">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18}/>
                            <input 
                                className="input-field pl-12"
                                type="email"
                                placeholder="name@negotiator.ai"
                                value={credentials.email}
                                onChange={(e) => {
                                    setCredentials({...credentials, email: e.target.value});
                                    if (error) dispatch(clearError());
                                }}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-slate-500 ml-1 tracking-wider">Security Key</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18}/>
                            <input 
                                className="input-field pl-12"
                                type="password"
                                placeholder="••••••••"
                                value={credentials.password}
                                onChange={(e) => {
                                    setCredentials({...credentials, password: e.target.value});
                                    if (error) dispatch(clearError());
                                }}
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
                                Decrypting...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                Initialize Access <LogIn size={18}/>
                            </span>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
                    <button 
                        onClick={onSwitch}
                        className="text-slate-400 hover:text-primary text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:translate-x-[2px]"
                    >
                        New Negotiator? Create Identity <ChevronRight size={16}/>
                    </button>
                    <div className="flex items-center gap-2 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                        <ShieldCheck size={12} className="text-primary/50"/> Protected by Sentinel AI
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
