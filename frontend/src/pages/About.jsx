import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { useGlobalConfig } from '../context/GlobalConfigContext';
import { getImageUrl } from '../utils/imageUtils';
import OptimizedImage from '../components/OptimizedImage';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Doodles from '../components/Doodles';
import { Award, Compass, Sparkles, ArrowRight } from 'lucide-react';
import { useHasPageBackground } from '../components/PageBackground';

import SectionBackground from '../components/SectionBackground';

const About = ({ embed = false }) => {
    const { config, loading } = useGlobalConfig();
    const hasBgImage = useHasPageBackground();
    const navigate = useNavigate();

    if (loading) {
        if (embed) return null;
        return <Loader text="Loading..." />;
    }

    const logoUrl = config.about_logo || null;

    return (
        <div className="w-full relative min-h-screen flex flex-col justify-between">
            {!embed && <Navbar />}
            <section id="about" className={`w-full max-w-full text-white font-body overflow-hidden relative border-t border-[#24BCE0]/25 ${!embed ? 'flex-1 pt-20 pb-12 sm:pb-16' : 'py-6 sm:py-8'}`}>
                {/* Independently Configured Section Background */}
                <SectionBackground
                    bgKey="about_bg"
                    fallbackKey="about_hero_bg"
                    config={config}
                    fallbackGradient="bg-gradient-to-b from-[#081321] via-[#0d1d31] to-[#091524]"
                    overlayOpacity=""
                />


                <Doodles />

            {/* Ambient Campus Lighting */}
            <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#24BCE0]/15 rounded-full blur-[140px] pointer-events-none z-0" />
            <div className="absolute bottom-1/4 left-0 w-[450px] h-[450px] bg-[#D62C76]/14 rounded-full blur-[130px] pointer-events-none z-0" />
            <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-[#F2D10A]/10 rounded-full blur-[130px] pointer-events-none z-0" />

            {/* Section 1: KCE Campus (Institution Backbone) */}
            <section className="relative z-10 py-3 sm:py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Mobile Title: Displayed above image and content on mobile */}
                    <div className="lg:hidden space-y-2 mb-4 text-left">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#24BCE0]/20 border border-[#24BCE0]/40 text-[#24BCE0] text-[11px] font-body font-semibold tracking-wider uppercase">
                            <Sparkles size={12} />
                            <span>Academic Excellence</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-semibold font-heading tracking-tight text-white leading-tight">
                            About Karpagam College of <br />
                            <span className="bg-gradient-to-r from-[#24BCE0] via-[#F2D10A] to-[#D62C76] bg-clip-text text-transparent">
                                Engineering (Autonomous)
                            </span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                        {/* KCE Media Card (5 cols) */}
                        <div className="lg:col-span-5 flex justify-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7 }}
                                className="relative w-full max-w-sm aspect-[16/10] rounded-2xl overflow-hidden glass-panel border border-[#24BCE0]/20 shadow-xl group"
                            >
                                {config.about_kce_video ? (
                                    <video
                                        src={getImageUrl(config.about_kce_video)}
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                    />
                                ) : config.about_kce_image ? (
                                    <OptimizedImage
                                        src={config.about_kce_image}
                                        alt="KCE Campus"
                                        preset="EVENT_CARD"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[#160611] flex flex-col items-center justify-center p-6 text-center">
                                        <div className="w-12 h-12 rounded-xl bg-[#24BCE0]/20 border border-[#24BCE0]/40 flex items-center justify-center mb-3 text-[#24BCE0]">
                                            <Award size={26} />
                                        </div>
                                        <h3 className="text-lg font-semibold font-heading text-white">Karpagam College of Engineering</h3>
                                        <p className="text-xs text-[#D8D4F0] mt-0.5 font-body">Autonomous Institution • Anna University Affiliated</p>
                                    </div>
                                )}
                                {(!config.about_kce_video && !config.about_kce_image) && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#160611]/90 via-transparent to-transparent pointer-events-none" />
                                )}
                                <div className="absolute bottom-3 left-3 right-3 text-xs font-medium text-white/90">
                                    <span className="px-2 py-0.5 rounded-full bg-[#24BCE0]/80 backdrop-blur-md border border-[#24BCE0]/60 text-white text-[10px] font-body font-semibold">
                                        Host Institution
                                    </span>
                                </div>
                            </motion.div>
                        </div>

                        {/* KCE Text (7 cols) */}
                        <div className="lg:col-span-7 space-y-4 text-left">
                            <div className="hidden lg:block space-y-2">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#24BCE0]/20 border border-[#24BCE0]/40 text-[#24BCE0] text-[11px] font-body font-semibold tracking-wider uppercase">
                                    <Sparkles size={12} />
                                    <span>Academic Excellence</span>
                                </div>

                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold font-heading tracking-tight text-white leading-tight">
                                    About Karpagam College of <br />
                                    <span className="bg-gradient-to-r from-[#24BCE0] via-[#F2D10A] to-[#D62C76] bg-clip-text text-transparent">
                                        Engineering (Autonomous)
                                    </span>
                                </h2>
                            </div>

                            <div className="glass-card p-4 sm:p-5 rounded-2xl border border-[#D62C76]/20 relative">
                                <p className="text-[#D8D4F0] text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-body font-normal">
                                    {config.about_kce_content ||
                                        'Karpagam College of Engineering is an autonomous institution approved by AICTE and affiliated to Anna University, Chennai. Offering cutting-edge undergraduate, postgraduate, and doctoral programmes, KCE stands at the forefront of technological education, industry collaborations, and research.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: About KALAM Science Fest */}
            <section className="relative z-10 py-4 sm:py-5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Mobile Title: Displayed above image and content on mobile */}
                    <div className="lg:hidden space-y-2 mb-4 text-left">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D62C76]/20 border border-[#D62C76]/40 text-[#24BCE0] text-[11px] font-body font-semibold tracking-wider uppercase">
                            <Compass size={12} />
                            <span>Festival Identity</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-semibold font-heading tracking-tight text-white leading-tight">
                            About <span className="text-[#F5A623]">KALAM</span> <br />
                            <span className="bg-gradient-to-r from-[#F2D10A] via-[#F47721] to-[#D62C76] bg-clip-text text-transparent">
                                Inter-College Science Fest
                            </span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                        {/* Fest Logo Showcase (5 cols) */}
                        <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7 }}
                                className="relative w-full max-w-sm aspect-[16/10] rounded-2xl overflow-hidden glass-panel border border-[#D62C76]/40 flex items-center justify-center p-5 glow-magenta group bg-[#160611]/90"
                            >
                                {config.about_video ? (
                                    <video
                                        src={getImageUrl(config.about_video)}
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                    />
                                ) : logoUrl ? (
                                    <div className="relative w-full h-full flex items-center justify-center p-2">
                                        <div className="absolute inset-0 bg-radial from-[#D62C76]/25 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
                                        <OptimizedImage
                                            src={logoUrl}
                                            alt="KALAM Science Fest Logo"
                                            preset="NAVBAR_LOGO"
                                            priority={true}
                                            className="max-h-full max-w-full object-contain filter drop-shadow-[0_0_20px_rgba(214,44,118,0.5)] group-hover:scale-105 transition-transform duration-500"
                                            style={{
                                                width: config.about_logo_width || '100%'
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center">
                                        <div className="text-3xl sm:text-4xl font-heading font-extrabold bg-gradient-to-r from-[#24BCE0] via-[#D62C76] to-[#F5A623] bg-clip-text text-transparent">
                                            {config.website_name || 'KALAM'} {config.event_year || '2026'}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        {/* Fest Description (7 cols) */}
                        <div className="lg:col-span-7 space-y-4 text-left order-2 lg:order-1">
                            <div className="hidden lg:block space-y-2">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D62C76]/20 border border-[#D62C76]/40 text-[#24BCE0] text-[11px] font-body font-semibold tracking-wider uppercase">
                                    <Compass size={12} />
                                    <span>Festival Identity</span>
                                </div>

                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold font-heading tracking-tight text-white leading-tight">
                                    About <span className="text-[#F5A623]">KALAM</span> <br />
                                    <span className="bg-gradient-to-r from-[#F2D10A] via-[#F47721] to-[#D62C76] bg-clip-text text-transparent">
                                        Inter-College Science Fest
                                    </span>
                                </h2>
                            </div>

                            <div className="glass-panel-magenta p-4 sm:p-5 rounded-2xl border border-[#D62C76]/40 relative glow-magenta">
                                <p className="text-[#D8D4F0] text-xs sm:text-sm leading-relaxed mb-3 whitespace-pre-wrap font-body font-normal">
                                    {config.about_content ||
                                        'KALAM is an inter-college science festival created in search of talent. Inspired by the vision of transformative scientific inquiry, it brings together students, innovators, coders, and creators from colleges across the nation to celebrate curiosity, discovery, and creative competition.'}
                                </p>

                                {/* Academic Editorial Quote — Dr. APJ Abdul Kalam */}
                                <blockquote className="my-3 border-l-2 border-[#F5A623]/70 pl-3 py-0.5">
                                    <p className="font-editorial italic text-xs sm:text-sm text-[#D8D4F0]/95 leading-relaxed">
                                        “Science is a beautiful gift to humanity; we should not distort it.”
                                    </p>
                                    <footer className="font-body text-[11px] font-medium text-[#F5A623] mt-0.5 uppercase tracking-wider">
                                        — Dr. A.P.J. Abdul Kalam
                                    </footer>
                                </blockquote>

                                <div className="flex flex-wrap items-center gap-3 pt-1">
                                    <button
                                        onClick={() => {
                                            const elem = document.getElementById('passes');
                                            if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-heading font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-[#D62C76] via-[#F47721] to-[#F5A623] hover:from-[#c22066] hover:to-[#e09418] shadow-[0_0_25px_rgba(214,44,118,0.5)] border border-[#F2D10A]/40 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                                    >
                                        <span>Register for Events</span>
                                        <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision / Pillars Section */}
            <section className="relative z-10 py-4 sm:py-5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                        {[
                            {
                                title: 'Discover',
                                tag: 'Curiosity & Research',
                                desc: 'Ignite young minds to explore untouched scientific questions and develop novel hypotheses.',
                                accent: 'border-[#24BCE0]/35 hover:border-[#24BCE0]',
                                badge: 'text-[#24BCE0] bg-[#24BCE0]/15',
                                glow: 'hover:shadow-[0_12px_30px_-10px_rgba(36,188,224,0.4)]',
                            },
                            {
                                title: 'Innovate',
                                tag: 'Applied Science & Tech',
                                desc: 'Transform theoretical ideas into tangible engineering solutions, software prototypes, and exhibits.',
                                accent: 'border-[#F47721]/35 hover:border-[#F5A623]',
                                badge: 'text-[#F5A623] bg-[#F47721]/15',
                                glow: 'hover:shadow-[0_12px_30px_-10px_rgba(244,119,33,0.4)]',
                            },
                            {
                                title: 'Excel',
                                tag: 'Competition & Leadership',
                                desc: 'Compete on a national collegiate stage, receive expert critique, and earn prestigious accolades.',
                                accent: 'border-[#D62C76]/35 hover:border-[#D62C76]',
                                badge: 'text-[#D62C76] bg-[#D62C76]/15',
                                glow: 'hover:shadow-[0_12px_30px_-10px_rgba(214,44,118,0.45)]',
                            },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15 }}
                                className={`glass-card p-4 sm:p-5 rounded-2xl border ${item.accent} ${item.glow} transition-all duration-300 group`}
                            >
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-body font-semibold uppercase tracking-wider mb-2.5 ${item.badge}`}>
                                    {item.tag}
                                </span>
                                <h3 className="text-lg sm:text-xl font-semibold font-heading tracking-tight text-white mb-1.5 group-hover:text-white transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-[#D8D4F0] text-xs sm:text-sm leading-relaxed font-body font-normal">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </section>

        {!embed && <Footer />}
        </div>
    );
};

export default About;
