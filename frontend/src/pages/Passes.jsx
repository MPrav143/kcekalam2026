import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import PassCard from '../components/PassCard';
import Doodles from '../components/Doodles';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { API_URL } from '../utils/config';
import { useGlobalConfig } from '../context/GlobalConfigContext';
import { useHasPageBackground } from '../components/PageBackground';
import SectionBackground from '../components/SectionBackground';

export default function Passes({ embed = false }) {
    const navigate = useNavigate();
    const { config } = useGlobalConfig();
    const hasBgImage = useHasPageBackground();
    const [passes, setPasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                const { data } = await axios.get(`${API_URL}/passes`);
                if (active) {
                    setPasses(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error('Error fetching passes:', error);
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => { active = false; };
    }, []);

    return (
        <div className={`w-full relative ${embed ? '' : 'min-h-screen flex flex-col justify-between'}`}>
            {!embed && <Navbar />}
            <section
                id="passes"
                className={`w-full max-w-full relative ${embed ? 'isolate' : ''} overflow-hidden text-white font-body border-t border-[#F5A623]/25 ${
                    !embed ? 'flex-1 pt-20 pb-12 sm:pb-16' : 'py-8 sm:py-10'
                }`}
            >
                {/* Independently Configured Passes Section Background */}
                <SectionBackground
                    bgKey="passes_bg"
                    config={config}
                    fallbackGradient="bg-gradient-to-b from-[#180902] via-[#210e05] to-[#13050c]"
                    overlayOpacity=""
                />

                <div className="pointer-events-none absolute -z-10 inset-0 overflow-hidden">
                    <div className="absolute -top-20 left-1/2 h-[34rem] w-[48rem] -translate-x-1/2 rounded-full bg-[#F5A623]/15 blur-[140px]" />
                    <div className="absolute right-0 top-1/2 h-[30rem] w-[30rem] rounded-full bg-[#F47721]/14 blur-[130px]" />
                    <div className="absolute bottom-0 left-0 h-[28rem] w-[28rem] rounded-full bg-[#D62C76]/14 blur-[130px]" />
                </div>
                <main className={`relative z-10 mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8 ${!embed ? 'pt-2 sm:pt-4' : 'pt-1'}`}>
                {!embed && (
                    <div className="mb-4 flex items-center justify-start">
                        <button
                            type="button"
                            onClick={() => {
                                if (window.history.length > 1) {
                                    navigate(-1);
                                } else {
                                    navigate('/');
                                }
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#180614]/85 hover:bg-[#F5A623]/20 text-white font-medium text-xs transition-all border border-[#F5A623]/30 hover:border-[#F5A623]/60 backdrop-blur-md cursor-pointer group shadow-lg active:scale-95"
                        >
                            <ArrowLeft size={14} className="text-[#F5A623] group-hover:-translate-x-1 transition-transform" />
                            <span>Back</span>
                        </button>
                    </div>
                )}
                <header className="mb-5 text-center sm:mb-7">
                    <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#D62C76]/35 bg-[#D62C76]/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[.18em] text-[#FFE6A0]">
                        <Sparkles size={13} className="text-[#F2D10A]" /> Festival Access Passes
                    </div>
                    <h1 className="mb-2 text-2xl font-black tracking-tight sm:text-3xl md:text-4xl">
                        Get Your <span className="bg-gradient-to-r from-[#F2D10A] via-[#F47721] to-[#D62C76] bg-clip-text text-transparent">Official Pass</span>
                    </h1>
                    <p className="mx-auto max-w-xl text-xs sm:text-sm leading-relaxed text-[#D8D4F0]/80">
                        Choose your admission tier for technical sessions, keynotes, hands-on workshops, and official festival privileges.
                    </p>
                </header>

                {loading ? (
                    <div className="flex justify-center py-24"><Loader inline text="Loading festival admission passes..." /></div>
                ) : passes.length === 0 ? (
                    <div className="mx-auto max-w-lg rounded-3xl border border-[#D62C76]/30 bg-[#180614]/80 p-8 text-center shadow-2xl backdrop-blur-xl">
                        <ShieldCheck className="mx-auto mb-4 text-[#F5A623]" size={34} />
                        <h2 className="mb-2 text-xl font-bold">Passes are coming soon</h2>
                        <p className="text-sm text-[#D8D4F0]/70">There are no active admission passes available right now.</p>
                    </div>
                ) : (
                    <div className="mx-auto grid grid-cols-2 gap-2.5 sm:gap-6 lg:gap-8 max-w-5xl items-stretch justify-center">
                        {passes.map((pass, index) => (
                            <div
                                key={pass._id || pass.id || index}
                                className="flex w-full items-stretch justify-center min-w-0"
                            >
                                <PassCard pass={pass} variantIndex={index} actionLabel="GET MY PASS" className="w-full" />
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </section>
        {!embed && <Footer />}
        </div>
    );
}
