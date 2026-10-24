import { useState, useEffect } from 'react';
import axios from 'axios';
import { getImageUrl } from '../utils/imageUtils';
import OptimizedImage from './OptimizedImage';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/config';
import { motion } from 'framer-motion';
import { useGlobalConfig } from '../context/GlobalConfigContext';
import { CheckCircle } from 'lucide-react';
import { useHasPageBackground } from './PageBackground';

import SectionBackground from './SectionBackground';

const PastEvents = () => {
    const hasBgImage = useHasPageBackground();
    const { config } = useGlobalConfig();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Fetch events
    useEffect(() => {
        const fetchPastEvents = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/content/pastEvents`);
                setEvents(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch past events", error);
            }
        };

        fetchPastEvents();
    }, []);

    // Rotate every 4 seconds
    useEffect(() => {
        if (!events.length) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % events.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [events]);

    if (!events.length) return null;

    const highlights = [
        config?.past_highlight_1 || 'Expert Speakers - Learn from the best in the field',
        config?.past_highlight_2 || 'Interactive Workshops - Hands-on sessions to sharpen skills',
        config?.past_highlight_3 || 'Networking Opportunities - Connect with peers & mentors',
        config?.past_highlight_4 || 'Gear Up for Glory – Show your skills, chase the championship'
    ];

    return (
        <section id="highlights" className="w-full max-w-full relative overflow-hidden border-t border-[#D62C76]/25 text-white py-8 sm:py-12">
            {/* Independently Configured Highlights Section Background */}
            <SectionBackground
                bgKey="highlights_bg"
                fallbackKey="about_bg"
                config={config}
                fallbackGradient="bg-gradient-to-b from-[#180517] via-[#240822] to-[#160515]"
                overlayOpacity=""
            />

            {/* Stage Arena Atmosphere Glow */}
            <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-[#D62C76]/18 rounded-full blur-[130px] pointer-events-none z-0" />
            <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-[#F47721]/16 rounded-full blur-[130px] pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

                {/* Heading */}
                <div className="text-center mb-5 sm:mb-6">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight uppercase leading-tight font-heading">
                        <span className="bg-gradient-to-r from-[#F2D10A] via-[#F47721] to-[#D62C76] bg-clip-text text-transparent">
                            KCE KALAM
                        </span>{' '}
                        <span className="text-[#24BCE0]">
                            Events
                        </span>
                    </h2>

                    <p className="text-xs sm:text-sm md:text-base text-[#D8D4F0]/85 max-w-2xl mx-auto leading-relaxed font-body mt-2 sm:mt-2.5">
                        {config?.past_event_desc || "Join us as we bring together vivid minds"}
                    </p>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center bg-[#180715]/75 p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl border border-[#24BCE0]/20 backdrop-blur-xl">

                    {/* LEFT - Card Stack */}
                    <div className="relative w-full flex items-center justify-center h-[260px] sm:h-[300px] md:h-[340px]">
                        {events.map((event, index) => {
                            const isActive = index === currentIndex;

                            return (
                                <motion.div
                                    key={event._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{
                                        opacity: isActive ? 1 : 0,
                                        scale: isActive ? 1 : 0.95,
                                        y: isActive ? 0 : -10,
                                        zIndex: isActive ? 10 : 0
                                    }}
                                    transition={{ duration: 0.4 }}
                                    className="absolute 
                                        w-[220px] sm:w-[280px] md:w-[380px] 
                                        h-[240px] sm:h-[280px] md:h-[320px] 
                                        rounded-xl sm:rounded-2xl 
                                        overflow-hidden 
                                        shadow-2xl 
                                        border border-[#D62C76]/30"
                                >
                                    <OptimizedImage
                                        src={event.image}
                                        alt={event.title}
                                        preset="EVENT_CARD"
                                        fallbackSrc="https://via.placeholder.com/600x400?text=Past+Event"
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* RIGHT - Content */}
                    <div className="space-y-4 sm:space-y-5 text-center lg:text-left">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F2D10A] via-[#F47721] to-[#D62C76] leading-snug font-heading">
                            {config?.past_event_subheading || "Unleash Your Potential at KALAM"}
                        </h3>

                        <p className="text-[#D8D4F0]/80 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto lg:mx-0 font-body">
                            Join us for an immersive experience designed to ignite your passion, expand your knowledge, and connect you with industry leaders.
                        </p>

                        <div className="grid grid-cols-1 gap-2 sm:gap-2.5">
                            {highlights.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 * idx }}
                                    className="flex items-center gap-3 p-2 sm:p-2.5 bg-[#140610]/70 rounded-lg sm:rounded-xl border border-[#D62C76]/20 hover:border-[#24BCE0]/40 transition-all group"
                                >
                                    <div className="flex items-center justify-center text-[#24BCE0] group-hover:scale-110 transition-transform">
                                        <CheckCircle
                                            size={20}
                                            className="sm:w-5 sm:h-5 flex-shrink-0"
                                            strokeWidth={2.2}
                                        />
                                    </div>
                                    <span className="text-[#D8D4F0] text-xs sm:text-sm font-medium font-body">
                                        {item}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* CTA */}
                <div className="flex justify-center mt-6 sm:mt-8">
                    <button
                        onClick={() => navigate('/passes')}
                        className="px-6 sm:px-8 py-2.5 sm:py-3 
                            bg-gradient-to-r from-[#D62C76] via-[#F47721] to-[#F5A623] hover:from-[#c22066] hover:to-[#e09418] 
                            text-white rounded-full 
                            font-bold text-sm sm:text-base 
                            border border-[#F2D10A]/40
                            shadow-[0_0_20px_rgba(214,44,118,0.35)]
                            transition-all hover:-translate-y-0.5 cursor-pointer"
                    >
                        Register Now
                    </button>
                </div>

            </div>
        </section>
    );
};

export default PastEvents;
