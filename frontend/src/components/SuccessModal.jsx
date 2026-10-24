import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, Download, Share2 } from 'lucide-react';

const SuccessModal = ({ isOpen, onClose, title, message, ticketId }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center px-4 overflow-y-auto py-10">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-[#14050E]/85 backdrop-blur-xl"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg bg-gradient-to-b from-[#180614] via-[#10040C] to-[#14050E] border border-[#24BCE0]/30 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl overflow-hidden"
                    >
                        {/* Success Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#24BCE0]/20 rounded-full blur-[100px] pointer-events-none" />

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 text-white/40 hover:text-white bg-white/5 rounded-full border border-white/10 transition-all z-20"
                        >
                            <X size={20} />
                        </button>

                        <div className="relative z-10 text-center">
                            {/* Animated Check Icon */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                                className="w-24 h-24 bg-[#24BCE0]/20 border border-[#24BCE0]/40 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_-10px_rgba(36,188,224,0.5)]"
                            >
                                <CheckCircle size={48} className="text-[#24BCE0]" />
                            </motion.div>

                            <h2 className="text-3xl sm:text-4xl font-black mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                                {title || "Successful!"}
                            </h2>
                            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                                {message || "Your registration is confirmed. We've sent the details to your email."}
                            </p>

                            {ticketId && (
                                <div className="mb-8 p-6 bg-[#14050E]/80 border border-[#D62C76]/25 rounded-2xl">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Registration Ticket ID</span>
                                    <span className="text-3xl font-black text-white tracking-widest">{ticketId}</span>
                                </div>
                            )}

                            <div className="space-y-4">
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 bg-gradient-to-r from-[#D62C76] via-[#F47721] to-[#F5A623] hover:opacity-95 text-white font-bold rounded-xl transition-all shadow-lg shadow-[#D62C76]/30 flex items-center justify-center gap-2 border border-[#F2D10A]/30"
                                >
                                    Home Page
                                </button>

                                <button
                                    className="w-full py-4 bg-[#24BCE0]/15 hover:bg-[#24BCE0]/25 text-[#24BCE0] font-bold rounded-xl border border-[#24BCE0]/30 transition-all flex items-center justify-center gap-2"
                                >
                                    <Download size={20} />
                                    Download Ticket
                                </button>
                            </div>

                            <p className="mt-8 text-gray-400 text-sm font-medium">
                                Check your email for formal invitation card.
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SuccessModal;
