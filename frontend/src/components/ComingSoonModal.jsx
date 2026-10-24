import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Timer, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ComingSoonModal = ({ isOpen, onClose, isPreRegistration = false }) => {
    const [isSaved, setIsSaved] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen && isPreRegistration) {
            setIsSaved(true);
        }
    }, [isOpen, isPreRegistration]);

    const handleAction = () => {
        onClose();
        navigate('/');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 overflow-y-auto pt-20 pb-10">

                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-[#14050E]/85 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 40 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="relative w-full max-w-[95%] sm:max-w-xl 
                                   bg-[#180614]/95 
                                   backdrop-blur-2xl 
                                   border border-[#D62C76]/30 
                                   rounded-[2rem] sm:rounded-[3rem] 
                                   p-6 sm:p-10 md:p-14 
                                   overflow-hidden 
                                   shadow-[0_8px_40px_rgba(214,44,118,0.25)]"
                    >

                        {/* Soft Gradient Light Overlay */}
                        <div className="absolute inset-0 rounded-[3rem] pointer-events-none">
                            <div className="absolute top-0 left-0 w-full h-full 
                                            bg-gradient-to-br 
                                            from-[#D62C76]/20 via-transparent to-transparent 
                                            opacity-40" />
                        </div>

                        {/* Ambient Glow Effects */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#24BCE0]/20 rounded-full blur-[120px]" />
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#D62C76]/20 rounded-full blur-[120px]" />

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 sm:top-8 sm:right-8 
                                       p-3 text-gray-300 hover:text-white 
                                       bg-white/10 hover:bg-[#D62C76]/30 
                                       backdrop-blur-lg 
                                       rounded-2xl 
                                       border border-[#D62C76]/30 
                                       transition-all group z-50"
                        >
                            <X size={18} className="group-hover:rotate-90 transition-transform" />
                        </button>

                        <div className="relative z-10 text-center">

                            {/* Icon Animation */}
                            <motion.div
                                animate={isSaved ? { scale: [1, 1.1, 1] } : {
                                    y: [-5, 5, -5],
                                    rotate: [0, 2, -2, 0]
                                }}
                                transition={{
                                    duration: isSaved ? 0.5 : 5,
                                    repeat: isSaved ? 0 : Infinity,
                                    ease: "easeInOut"
                                }}
                                className="inline-flex p-5 sm:p-6 
                                           rounded-2xl sm:rounded-[2rem] 
                                           mb-8 sm:mb-10 
                                           bg-[#14050E]/80 
                                           backdrop-blur-xl 
                                           border border-[#24BCE0]/30 
                                           shadow-inner"
                            >
                                {isSaved ? (
                                    <CheckCircle size={40} className="text-[#24BCE0] sm:w-14 sm:h-14" />
                                ) : (
                                    <Timer size={40} className="text-[#F2D10A] sm:w-14 sm:h-14" />
                                )}
                            </motion.div>

                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 leading-[1.1] tracking-tighter text-white">
                                {isSaved ? (
                                    <span className="bg-gradient-to-r from-[#24BCE0] via-[#F2D10A] to-[#D62C76] bg-clip-text text-transparent">
                                        You're on the List!
                                    </span>
                                ) : (
                                    <span className="bg-gradient-to-r from-[#24BCE0] via-[#F5A623] to-[#D62C76] bg-clip-text text-transparent italic">
                                        Stay Tuned.<br className="hidden sm:block" />Stay Ahead.
                                    </span>
                                )}
                            </h2>

                            <p className="text-white/70 text-base sm:text-lg md:text-xl mb-10 max-w-sm mx-auto leading-relaxed">
                                {isSaved
                                    ? "We've captured your interest! You'll be the first to know the moment registrations go live."
                                    : "Our team is crafting something legendary. Don't miss out on the launch of Kalam 2026."}
                            </p>

                            {/* Glass Button */}
                            <button
                                onClick={handleAction}
                                className="w-full py-5 rounded-[1.5rem] 
                                           font-semibold text-lg text-white
                                           bg-gradient-to-r from-[#D62C76] via-[#F47721] to-[#F5A623] 
                                           backdrop-blur-xl 
                                           border border-[#F2D10A]/30 
                                           hover:opacity-95 
                                           transition-all 
                                           shadow-lg shadow-[#D62C76]/30 
                                           flex items-center justify-center gap-3 
                                           group relative overflow-hidden"
                            >
                                <motion.div
                                    className="absolute inset-0 bg-white/10"
                                    initial={{ x: '-100%' }}
                                    whileHover={{ x: '100%' }}
                                    transition={{ duration: 0.6 }}
                                />

                                {isSaved ? (
                                    "Keep me Updated"
                                ) : (
                                    <>
                                        <Bell size={22} className="group-hover:rotate-12 transition-transform" />
                                        Keep me Updated
                                    </>
                                )}
                            </button>

                            <div className="mt-10 pt-8 border-t border-white/10">
                                <span className="text-[11px] text-white/40 uppercase tracking-[0.4em] font-bold">
                                    Powered by Kalam Team, Karpagam College of Engineering
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ComingSoonModal;