import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { getImageUrl } from '../utils/imageUtils';
import OptimizedImage from '../components/OptimizedImage';
import { Calendar, MapPin, User, Phone, BookOpen, Clock, ExternalLink, IndianRupee, Users, ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_URL } from '../utils/config';
import Doodles from '../components/Doodles';
import { useHasPageBackground } from '../components/PageBackground';

const RegisterEvent = () => {
    const hasBgImage = useHasPageBackground();
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data: resolvedEvent } = await axios.get(`${API_URL}/events/${eventId}`);
                if (resolvedEvent) {
                    setEvent(resolvedEvent);

                    // If accessed via ID but has a slug, redirect to slug-based URL
                    if (eventId.match(/^[0-9a-fA-F]{24}$/) && resolvedEvent.slug) {
                        navigate(`/register/${resolvedEvent.slug}`, { replace: true });
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error("Failed to resolve event for registration:", error);
                setLoading(false);
            }
        };
        if (eventId) fetchEvent();
    }, [eventId, navigate]);

    if (loading) return <Loader text="Loading event details..." />;
    if (!event) return <div className={`min-h-screen ${hasBgImage ? 'bg-transparent' : 'bg-[#14050E]'} text-[#D8D4F0] flex items-center justify-center`}>Event not found</div>;

    // Validation Helpers
    const isNotEmpty = (str) => {
        if (str === null || str === undefined) return false;
        if (typeof str !== 'string') return true;
        const s = str.trim();
        return s !== '' && s.toLowerCase() !== 'undefined' && s.toLowerCase() !== 'null';
    };

    const hasRounds = event.rounds && Array.isArray(event.rounds) && event.rounds.some(r => isNotEmpty(r.name) || isNotEmpty(r.description));
    const hasRules = event.rules && (
        Array.isArray(event.rules)
            ? event.rules.some(r => isNotEmpty(r))
            : isNotEmpty(event.rules)
    );

    const isValidPrize = (p) => isNotEmpty(p);
    const hasGeneralPrize = event.generalPrize && Array.isArray(event.generalPrize) && event.generalPrize.some(p => isNotEmpty(p));

    return (
        <div className={`min-h-screen bg-transparent ${hasBgImage ? '' : 'bg-cosmic-grid'} text-white font-body flex flex-col relative overflow-x-hidden selection:bg-[#D62C76] selection:text-white`}>
            <Doodles />
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 pt-24 pb-10 md:pt-32 md:pb-20 font-body">
                {/* Back Button */}
                <div className="mb-8">
                    <button
                        onClick={() => {
                            if (window.history.length > 1) {
                                navigate(-1);
                            } else {
                                navigate('/');
                            }
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-[#180614]/80 hover:bg-[#24BCE0]/20 text-white rounded-full transition-all border border-[#24BCE0]/30 hover:border-[#24BCE0]/60 group backdrop-blur-sm shadow-md cursor-pointer active:scale-95"
                    >
                        <ArrowLeft size={20} className="text-[#24BCE0] group-hover:-translate-x-1 transition-transform" />
                        <span className="font-body font-medium">Back</span>
                    </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 items-start">
                    {/* Left: Event Image without div tag */}
                    <OptimizedImage
                        src={event.image}
                        alt={event.title}
                        preset="EVENT_DETAIL"
                        priority={true}
                        fallbackSrc="https://via.placeholder.com/800x400?text=Event+Poster"
                        className="w-full h-auto max-h-[500px] object-cover rounded-3xl border border-[#D62C76]/30 shadow-2xl"
                    />

                    {/* Right: Glassmorphism Registration Box */}
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="bg-[#180614]/85 backdrop-blur-xl border border-[#D62C76]/35 rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden group hover:border-[#D62C76]/60 transition-colors h-fit self-center shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 w-36 h-36 bg-[#D62C76]/25 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#24BCE0]/20 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

                        <span className="self-start px-4 py-1.5 bg-gradient-to-r from-[#D62C76] via-[#F04438] to-[#F5A623] text-white text-xs font-body font-semibold uppercase tracking-wider rounded-full mb-4 shadow-lg border border-[#F2D10A]/30">
                            {event.category}
                        </span>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight leading-tight font-heading">
                            {event.title}
                        </h1>

                        <h2 className="text-2xl sm:text-3xl font-semibold mb-3 text-white relative z-10 font-heading">
                            Secure Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#24BCE0] via-[#F2D10A] to-[#D62C76]">Spot</span>
                        </h2>
                        <p className="text-[#D8D4F0] mb-6 leading-relaxed relative z-10 text-sm sm:text-base font-body font-normal">
                            Join us for an unforgettable experience. Participate, compete, and win big. Get your fest pass now!
                        </p>
                        <button
                            onClick={() => navigate('/passes')}
                            className="w-full bg-gradient-to-r from-[#D62C76] via-[#F47721] to-[#F5A623] hover:opacity-95 text-white font-accent font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-[#D62C76]/40 transform hover:-translate-y-0.5 relative z-10 text-base sm:text-lg flex items-center justify-center gap-2 border border-[#F2D10A]/30 cursor-pointer"
                        >
                            <Sparkles size={18} className="text-[#F2D10A]" />
                            <span>Get Fest Entry Pass</span>
                        </button>
                    </motion.div>
                </div>

                {/* Main Content Grid */}
                <div className="space-y-8">

                    {/* Row 1: Description & Rules */}
                    <div className={`grid grid-cols-1 ${hasRules ? 'lg:grid-cols-2' : ''} bg-[#180614]/75 backdrop-blur-md border border-[#D62C76]/25 rounded-3xl p-6 md:p-8 hover:border-[#D62C76]/40 transition-colors shadow-lg gap-8`}>
                        {/* Description */}
                        <motion.div
                            initial={{ opacity: 0, y: -30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="bg-[#14050E]/80 backdrop-blur-md border border-[#24BCE0]/30 rounded-3xl p-6 md:p-8"
                        >
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 font-display">
                                <div className="p-2 bg-[#24BCE0]/20 rounded-lg text-[#24BCE0] shadow-inner border border-[#24BCE0]/30">
                                    <BookOpen size={24} />
                                </div>
                                About Event
                            </h3>
                            <p className="text-[#D8D4F0] text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                                {event.description}
                            </p>
                        </motion.div>

                        {/* Rules */}
                        {hasRules && (
                            <motion.div
                                initial={{ opacity: 0, y: -30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                                className="bg-[#14050E]/80 backdrop-blur-md border border-[#D62C76]/30 rounded-3xl p-6 md:p-8 hover:border-[#D62C76]/50 transition-colors shadow-lg"
                            >
                                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 font-display">
                                    <div className="p-2 bg-[#D62C76]/20 rounded-lg text-[#F2D10A] shadow-inner border border-[#F2D10A]/30">
                                        <BookOpen size={24} />
                                    </div>
                                    Rules & Regulations
                                </h3>
                                <div className="text-[#D8D4F0] text-base leading-relaxed pl-4">
                                    {Array.isArray(event.rules) ? (
                                        <ul className="list-disc space-y-3 marker:text-[#F2D10A]">
                                            {event.rules.filter(r => isNotEmpty(r)).map((rule, idx) => (
                                                <li key={idx}>{rule}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="whitespace-pre-wrap">{event.rules}</p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Row 2: Rounds & Details Grid */}
                    <div className={`grid grid-cols-1 ${hasRounds ? 'lg:grid-cols-2' : ''} gap-8`}>
                        {/* Rounds */}
                        {hasRounds && (
                            <motion.div
                                initial={{ opacity: 0, y: -30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="bg-[#180614]/75 backdrop-blur-md border border-[#F47721]/30 rounded-3xl p-6 md:p-8 h-full hover:border-[#F47721]/50 transition-colors shadow-lg"
                            >
                                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 font-display">
                                    <div className="p-2 bg-[#F47721]/20 rounded-lg text-[#F47721] shadow-inner border border-[#F47721]/30">
                                        <Calendar size={24} />
                                    </div>
                                    Rounds Structure
                                </h3>
                                <div className="space-y-4">
                                    {Array.isArray(event.rounds) ? event.rounds.filter(r => isNotEmpty(r.name) || isNotEmpty(r.description)).map((round, index) => (
                                        <div key={index} className="bg-[#14050E]/80 p-5 rounded-2xl border border-[#F47721]/20 hover:border-[#24BCE0]/40 transition-colors">
                                            <h5 className="font-bold text-white text-lg mb-2">{round.name}</h5>
                                            <p className="text-[#D8D4F0] text-base">{round.description}</p>
                                        </div>
                                    )) : <p className="text-[#D8D4F0] whitespace-pre-wrap">{event.rounds}</p>}
                                </div>
                            </motion.div>
                        )}

                        {/* Details Grid (Nested) */}
                        <motion.div
                            initial={{ opacity: 0, y: -30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full"
                        >
                            {/* Venue */}
                            <div className="bg-[#180614]/80 backdrop-blur-sm border border-[#24BCE0]/30 rounded-2xl p-5 md:p-6 flex flex-col justify-center hover:border-[#24BCE0]/60 transition-all group">
                                <span className="text-[#24BCE0] text-lg md:text-xl font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <MapPin size={24} className="text-[#24BCE0]" /> Venue
                                </span>
                                <span className="text-lg md:text-xl font-bold text-white group-hover:text-[#24BCE0] transition-colors">{event.venue}</span>
                            </div>

                            {/* Date */}
                            <div className="bg-[#180614]/80 backdrop-blur-sm border border-[#F5A623]/30 rounded-2xl p-5 md:p-6 flex flex-col justify-center hover:border-[#F5A623]/60 transition-all group">
                                <span className="text-[#F5A623] text-lg md:text-xl font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Calendar size={24} className="text-[#F5A623]" /> Date
                                </span>
                                <span className="text-lg md:text-xl font-bold text-white group-hover:text-[#F5A623] transition-colors">{new Date(event.date).toLocaleDateString()}</span>
                            </div>

                            {/* Time */}
                            <div className="bg-[#180614]/80 backdrop-blur-sm border border-[#D62C76]/30 rounded-2xl p-5 md:p-6 flex flex-col justify-center hover:border-[#D62C76]/60 transition-all group">
                                <span className="text-[#D62C76] text-lg md:text-xl font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Clock size={24} className="text-[#D62C76]" /> Time
                                </span>
                                <span className="text-lg md:text-xl font-bold text-white group-hover:text-[#D62C76] transition-colors">
                                    {event.fromTime ? (event.toTime ? `${event.fromTime} - ${event.toTime}` : event.fromTime) : (event.timings || 'TBA')}
                                </span>
                            </div>

                            {/* Category */}
                            <div className="bg-[#180614]/80 backdrop-blur-sm border border-[#F47721]/30 rounded-2xl p-5 md:p-6 flex flex-col justify-center hover:border-[#F47721]/60 transition-all group">
                                <span className="text-[#D8D4F0] text-lg md:text-xl font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <BookOpen size={24} className="text-[#24BCE0]" /> Category
                                </span>
                                <span className="text-lg md:text-xl font-bold text-white group-hover:text-[#24BCE0] transition-colors">{(event.category === 'Technical' && event.eventType && event.eventType !== 'Normal') ? event.eventType : (event.subCategory || event.eventType || event.department || 'General')}</span>
                            </div>

                            {event.pptTemplateUrl && (
                                <div className="col-span-1 sm:col-span-2">
                                    <a href={event.pptTemplateUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-[#24BCE0]/15 hover:bg-[#24BCE0]/25 text-[#24BCE0] border border-[#24BCE0]/30 transition-all font-semibold">
                                        <ExternalLink size={18} /> Download PPT Template
                                    </a>
                                </div>
                            )}
                        </motion.div>
                    </div>



                    {/* Resource Person Section (Workshop specific) */}
                    {(event.resourcePerson || event.resourcePersonPosition || event.resourcePersonCompany) && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-[#180614] via-[#10040C] to-[#24BCE0]/15 border border-[#24BCE0]/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md"
                        >
                            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 font-display">
                                <div className="p-2 bg-[#24BCE0]/20 rounded-lg text-[#24BCE0] shadow-inner border border-[#24BCE0]/30">
                                    <User size={24} />
                                </div>
                                Resource Person
                            </h3>

                            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center bg-[#14050E]/90 p-6 md:p-8 rounded-2xl border border-[#24BCE0]/30">
                                <div className="text-center md:text-left flex-1">
                                    <h4 className="text-2xl md:text-3xl font-black text-white mb-2">{event.resourcePerson}</h4>
                                    <p className="text-lg md:text-xl text-[#24BCE0] font-bold mb-1">{event.resourcePersonPosition}</p>
                                    <p className="text-base md:text-lg text-[#D8D4F0]">{event.resourcePersonCompany}</p>
                                </div>
                                <div className="hidden md:block w-px h-24 bg-[#D62C76]/30" />
                                <div className="flex-1 text-[#D8D4F0] italic text-lg text-center md:text-left">
                                    "Learn directly from industry experts and enhance your practical knowledge through hands-on experience."
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Prize Section (Prominent) */}
                    {(isValidPrize(event.prize) || isValidPrize(event.winnerPrize) || isValidPrize(event.runnerPrize) || hasGeneralPrize) && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-[#180614] via-[#14050E] to-[#F5A623]/15 border border-[#F5A623]/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5A623]/10 rounded-full blur-3xl -mr-32 -mt-32" />
                            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 font-display">
                                <div className="p-2 bg-[#F5A623]/20 rounded-lg text-[#F2D10A] shadow-inner border border-[#F2D10A]/30">
                                    <IndianRupee size={24} />
                                </div>
                                Prizes & Rewards
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {isValidPrize(event.winnerPrize) && (
                                    <div className="bg-[#14050E]/85 p-6 rounded-2xl border border-[#24BCE0]/40 text-center shadow-lg">
                                        <p className="text-[#24BCE0] text-sm font-bold uppercase tracking-widest mb-2">Winner</p>
                                        <p className="text-2xl md:text-3xl font-black text-white">{event.winnerPrize}</p>
                                    </div>
                                )}
                                {isValidPrize(event.runnerPrize) && (
                                    <div className="bg-[#14050E]/85 p-6 rounded-2xl border border-[#D62C76]/40 text-center shadow-lg">
                                        <p className="text-[#D8D4F0] text-sm font-bold uppercase tracking-widest mb-2">Runner</p>
                                        <p className="text-2xl md:text-3xl font-black text-white">{event.runnerPrize}</p>
                                    </div>
                                )}
                                {isValidPrize(event.prize) && (
                                    <div className="bg-[#14050E]/85 p-6 rounded-2xl border border-[#F5A623]/40 text-center lg:col-span-1 shadow-lg">
                                        <p className="text-[#F2D10A] text-sm font-bold uppercase tracking-widest mb-2">Prize Pool / Info</p>
                                        <p className="text-xl font-bold text-white">{event.prize}</p>
                                    </div>
                                )}
                                {hasGeneralPrize && (
                                    <div className="bg-[#14050E]/85 p-6 rounded-2xl border border-[#F47721]/30 md:col-span-2 lg:col-span-3">
                                        <p className="text-[#F5A623] text-sm font-bold uppercase tracking-widest mb-4">Other General Prizes</p>
                                        <div className="flex flex-wrap gap-3">
                                            {event.generalPrize.filter(p => isNotEmpty(p)).map((p, i) => (
                                                <span key={i} className="px-4 py-2 bg-[#24BCE0]/20 text-[#24BCE0] rounded-xl border border-[#24BCE0]/30 font-bold text-lg shadow-sm">
                                                    {p}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Theme / Topics */}
                    {event.theme && (Array.isArray(event.theme) ? event.theme.filter(t => isNotEmpty(t)).length > 0 : isNotEmpty(event.theme)) && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-[#180614]/75 backdrop-blur-sm border border-[#24BCE0]/30 rounded-3xl p-6 md:p-8"
                        >
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 font-display">
                                <div className="p-2 bg-[#24BCE0]/20 rounded-lg text-[#24BCE0] shadow-inner">
                                    <BookOpen size={24} />
                                </div>
                                Themes / Topics
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {Array.isArray(event.theme) ? (
                                    event.theme.filter(t => isNotEmpty(t)).map((topic, i) => (
                                        <span key={i} className="px-5 py-2.5 bg-[#24BCE0]/20 text-[#F2D10A] rounded-2xl border border-[#24BCE0]/30 text-lg font-bold shadow-lg shadow-[#24BCE0]/15">
                                            {topic}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xl font-bold text-white">{event.theme}</span>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Row 3: Faculty Coordinators */}
                    {(event.facultyCoordinators?.length > 0) && (
                        <motion.div
                            initial={{ opacity: 0, y: -30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-[#180614]/75 backdrop-blur-md border border-[#D62C76]/25 rounded-3xl p-6 md:p-8 text-center shadow-lg"
                        >
                            <h4 className="text-xl font-bold text-[#D62C76] mb-8 inline-block border-b-2 border-[#D62C76]/30 pb-2 font-display">Faculty Coordinators</h4>
                            <div className="flex flex-wrap justify-center gap-6">
                                {event.facultyCoordinators.map((coordinator, index) => (
                                    <div key={index} className="bg-[#14050E]/80 px-4 md:px-8 py-6 rounded-2xl border border-[#D62C76]/20 hover:border-[#D62C76]/50 hover:bg-[#D62C76]/10 transition-all duration-300 group min-w-0 w-full sm:w-auto sm:min-w-[200px]">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="p-3 bg-[#D62C76]/25 rounded-full text-[#D62C76] mb-2 group-hover:scale-110 transition-transform">
                                                <User size={20} />
                                            </div>
                                            <span className="font-bold text-white text-lg break-words max-w-full">{coordinator.name}</span>
                                            {coordinator.phone && (
                                                <a href={`tel:${coordinator.phone}`} className="flex items-center gap-1 text-sm text-[#D8D4F0] hover:text-[#24BCE0] transition-colors">
                                                    <Phone size={14} />
                                                    <span>{coordinator.phone}</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Row 4: Student Coordinators */}
                    {(event.studentCoordinators?.length > 0) && (
                        <motion.div
                            initial={{ opacity: 0, y: -30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                            className="bg-[#180614]/75 backdrop-blur-md border border-[#24BCE0]/25 rounded-3xl p-6 md:p-8 text-center shadow-lg"
                        >
                            <h4 className="text-xl font-bold text-[#24BCE0] mb-8 inline-block border-b-2 border-[#24BCE0]/30 pb-2 font-display">Student Coordinators</h4>
                            <div className="flex flex-wrap justify-center gap-6">
                                {event.studentCoordinators.map((coordinator, index) => (
                                    <div key={index} className="bg-[#14050E]/80 px-4 md:px-8 py-6 rounded-2xl border border-[#24BCE0]/25 hover:border-[#24BCE0]/50 hover:bg-[#24BCE0]/15 transition-all duration-300 group min-w-0 w-full sm:w-auto sm:min-w-[200px]">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="p-3 bg-[#24BCE0]/20 rounded-full text-[#24BCE0] mb-2 group-hover:scale-110 transition-transform">
                                                <User size={20} />
                                            </div>
                                            <span className="font-bold text-white text-lg break-words max-w-full">{coordinator.name}</span>
                                            {coordinator.phone && (
                                                <a href={`tel:${coordinator.phone}`} className="flex items-center gap-1 text-sm text-[#D8D4F0] hover:text-[#24BCE0] transition-colors">
                                                    <Phone size={14} />
                                                    <span>{coordinator.phone}</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default RegisterEvent;
