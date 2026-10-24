import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { X, Calendar, MapPin, User, Mail, Phone, Info, Clock, Tag, Building2, ExternalLink, ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { API_URL, BASE_URL } from '../utils/config';
import Doodles from '../components/Doodles';
import OptimizedImage from '../components/OptimizedImage';
import { useHasPageBackground } from '../components/PageBackground';

const EventDetail = () => {
    const hasBgImage = useHasPageBackground();
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [participants, setParticipants] = useState([]);
    const [loadingParticipants, setLoadingParticipants] = useState(false);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/events/${id}`);
                setEvent(data);

                // If accessed via ID but has a slug, redirect to slug-based URL
                if (id.match(/^[0-9a-fA-F]{24}$/) && data?.slug) {
                    navigate(`/event/${data.slug}`, { replace: true });
                }

                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch event details", error);
                setLoading(false);
            }
        };

        // We could check user role, but for the "participants page" (Home/Public), 
        // we strictly hide this data as requested.
        setUserRole('');

        fetchEvent();
    }, [id]);

    useEffect(() => {
        if (event && (userRole === 'admin' || userRole === 'hod' || userRole === 'principal' || userRole === 'dean')) {
            fetchParticipants();
        }
    }, [event, userRole]);

    const fetchParticipants = async () => {
        setLoadingParticipants(true);
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`${API_URL}/registrations/events/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setParticipants(data);
        } catch (error) {
            console.error("Failed to fetch participants", error);
        } finally {
            setLoadingParticipants(false);
        }
    };

    const handleDownloadCSV = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`${API_URL}/registrations/events/${id}/export`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${event.title}_participants.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Failed to download CSV", error);
            alert("Failed to download CSV");
        }
    };

    if (loading) return <div className={`min-h-screen flex items-center justify-center ${hasBgImage ? 'bg-transparent' : 'bg-[#14050E]'}`}><Loader text="Loading event details..." /></div>;
    if (!event) return <div className={`min-h-screen flex flex-col items-center justify-center ${hasBgImage ? 'bg-transparent' : 'bg-[#14050E]'} text-[#D8D4F0]`}>
        <h2 className="text-2xl font-bold mb-4 font-display">Event not found</h2>
        <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-gradient-to-r from-[#D62C76] to-[#F47721] text-white font-bold rounded-xl shadow-lg shadow-[#D62C76]/40">Go back</button>
    </div>;

    const isWorkshop = event.category === 'Workshop' || event.eventType === 'Workshop';

    // Validation Helpers
    const isNotEmpty = (str) => {
        if (!str || typeof str !== 'string') return false;
        const s = str.trim().toLowerCase();
        // Check for empty, tba, undefined, null, or "no specific..." phrases
        return s !== '' &&
            !['tba', 'tbd', 'undefined', 'null'].includes(s) &&
            !s.startsWith('no specific');
    };

    const hasRounds = event.rounds && Array.isArray(event.rounds) && event.rounds.some(r => isNotEmpty(r.name) || isNotEmpty(r.description));

    // Check for rules array or string, ensuring it's not just a placeholder
    const hasRules = event.rules && (
        Array.isArray(event.rules)
            ? event.rules.some(r => isNotEmpty(r))
            : isNotEmpty(event.rules)
    );

    // Prize Validation
    const isValidPrize = (p) => isNotEmpty(p);
    const hasGeneralPrize = event.generalPrize && Array.isArray(event.generalPrize) && event.generalPrize.some(p => isNotEmpty(p));
    const showPrizes = isValidPrize(event.winnerPrize) || isValidPrize(event.runnerPrize) || isValidPrize(event.prize) || hasGeneralPrize;

    return (
        <div className={`min-h-screen flex flex-col justify-between bg-transparent ${hasBgImage ? '' : 'bg-cosmic-grid'} text-white relative overflow-hidden selection:bg-[#D62C76] selection:text-white`}>
            <Doodles />
            <Navbar />

            <main className="flex-1 pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto w-full">
                {/* Back Button */}
                <button
                    onClick={() => {
                        if (window.history.length > 1) {
                            navigate(-1);
                        } else {
                            navigate('/');
                        }
                    }}
                    className="flex items-center gap-2 text-[#D8D4F0] hover:text-[#24BCE0] mb-8 transition-colors group px-4 py-2 rounded-full bg-[#180614]/80 border border-[#24BCE0]/30 hover:border-[#24BCE0]/60 backdrop-blur-md cursor-pointer active:scale-95"
                >
                    <ArrowLeft size={18} className="text-[#24BCE0] group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                </button>

                <div className="bg-[#180614]/85 border border-[#D62C76]/25 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row backdrop-blur-xl">
                    {/* Left Side: Image & Tags */}
                    <div className={`lg:w-2/5 h-[400px] lg:h-auto relative shrink-0 ${event.image ? 'bg-transparent' : 'bg-[#14050E]'}`}>
                        <OptimizedImage
                            src={event.image}
                            alt={event.title}
                            preset="EVENT_DETAIL"
                            priority={true}
                            fallbackSrc="https://via.placeholder.com/800x600?text=Event+Poster"
                            className="w-full h-full object-cover"
                        />
                        {event.theme && (Array.isArray(event.theme) ? event.theme.filter(t => isNotEmpty(t)).length > 0 : isNotEmpty(event.theme)) && (
                            <div className="absolute top-4 left-4 z-10">
                                <div className="bg-[#14050E]/90 backdrop-blur-md border border-[#24BCE0]/40 px-4 py-2 rounded-xl flex flex-col gap-2 shadow-lg">
                                    <p className="text-[#24BCE0] text-xs font-bold uppercase tracking-widest mb-0.5">Themes / Topics</p>
                                    <div className="flex flex-wrap gap-2">
                                        {Array.isArray(event.theme) ? (
                                             event.theme.filter(t => isNotEmpty(t)).map((topic, i) => (
                                                 <span key={i} className="text-[#F2D10A] text-sm font-bold bg-[#24BCE0]/20 px-2 py-0.5 rounded-lg border border-[#24BCE0]/30">{topic}</span>
                                             ))
                                         ) : (
                                             <p className="text-[#F2D10A] font-bold">{event.theme}</p>
                                         )}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#14050E] via-transparent to-transparent" />
                        <div className="absolute bottom-10 left-10 right-10">
                            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-body font-semibold mb-4 uppercase tracking-[0.15em] bg-gradient-to-r from-[#D62C76] via-[#F04438] to-[#F5A623] text-white border border-[#F2D10A]/30 shadow-md">
                                {event.category} {event.eventType && event.eventType !== 'Normal' && `• ${event.eventType}`}
                            </span>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-2xl mb-2 font-heading tracking-tight">
                                {event.title}
                            </h1>
                            {event.artistName && (
                                <p className="text-lg text-[#F2D10A] font-body font-semibold mb-2 flex items-center gap-2">
                                    <User size={18} className="text-[#24BCE0]" /> Featuring: {event.artistName}
                                </p>
                            )}
                            <p className="text-[#D8D4F0] text-sm sm:text-base flex items-center gap-2.5 font-body font-normal">
                                <Building2 size={18} className="text-[#24BCE0]" />
                                {event.department || event.club || 'General Event'}
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Content */}
                    <div className="flex-1 p-8 lg:p-12">
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex-1">
                                {(userRole === 'admin' || userRole === 'hod' || userRole === 'principal' || userRole === 'dean') && (
                                    <button
                                        onClick={handleDownloadCSV}
                                        className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-green-900/20"
                                    >
                                        <Tag size={16} /> Download CSV Report
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-12">                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-[#180614]/80 p-6 rounded-2xl border border-[#24BCE0]/30 flex items-center gap-5 backdrop-blur-md">
                                    <div className="w-12 h-12 rounded-xl bg-[#24BCE0]/20 border border-[#24BCE0]/30 flex items-center justify-center text-[#24BCE0]">
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#D8D4F0]/70 uppercase font-bold tracking-wider mb-1">Date</p>
                                        <p className="font-semibold text-lg text-white">{event.date ? new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'long' }) : ''}</p>
                                    </div>
                                </div>
                                <div className="bg-[#180614]/80 p-6 rounded-2xl border border-[#D62C76]/30 flex items-center gap-5 backdrop-blur-md">
                                    <div className="w-12 h-12 rounded-xl bg-[#D62C76]/20 border border-[#D62C76]/30 flex items-center justify-center text-[#D62C76]">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#D8D4F0]/70 uppercase font-bold tracking-wider mb-1">Time</p>
                                        <p className="font-semibold text-lg text-white">
                                            {(event.fromTime && event.toTime)
                                                ? `${event.fromTime} - ${event.toTime}`
                                                : (event.timings || event.time)}
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-[#180614]/80 p-6 rounded-2xl border border-[#F47721]/30 flex items-center gap-5 backdrop-blur-md">
                                    <div className="w-12 h-12 rounded-xl bg-[#F47721]/20 border border-[#F47721]/30 flex items-center justify-center text-[#F47721]">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#D8D4F0]/70 uppercase font-bold tracking-wider mb-1">Venue</p>
                                        <p className="font-semibold text-lg text-white">{event.venue}</p>
                                    </div>
                                </div>
                                {showPrizes && (
                                    <div className="bg-[#180614]/80 p-6 rounded-2xl border border-[#F5A623]/35 flex items-center gap-5 backdrop-blur-md">
                                        <div className="w-12 h-12 rounded-xl bg-[#F5A623]/20 border border-[#F5A623]/30 flex items-center justify-center text-[#F2D10A]">
                                            <Tag size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-[#D8D4F0]/70 uppercase font-bold tracking-wider mb-1">Prize Details</p>
                                            <div className="space-y-1">
                                                {isValidPrize(event.winnerPrize) && (
                                                    <p className="font-bold text-lg text-[#F2D10A] flex items-center justify-between">
                                                        <span>Winner:</span>
                                                        <span>{event.winnerPrize}</span>
                                                    </p>
                                                )}
                                                {isValidPrize(event.runnerPrize) && (
                                                    <p className="font-semibold text-[#D8D4F0] flex items-center justify-between text-sm">
                                                        <span>Runner:</span>
                                                        <span>{event.runnerPrize}</span>
                                                    </p>
                                                )}
                                                {!isValidPrize(event.winnerPrize) && !isValidPrize(event.runnerPrize) && isValidPrize(event.prize) && (
                                                    <p className="font-bold text-lg text-[#F2D10A]">{event.prize}</p>
                                                )}
                                                {hasGeneralPrize && (
                                                    <div className="pt-2 flex flex-wrap gap-2 mt-2 border-t border-[#D62C76]/20">
                                                        {event.generalPrize.filter(p => isNotEmpty(p)).map((p, idx) => (
                                                            <span key={idx} className="bg-[#24BCE0]/20 text-[#24BCE0] text-[10px] px-2 py-0.5 rounded border border-[#24BCE0]/30 font-bold">{p}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Info Sections */}
                            <div className="grid grid-cols-1 gap-10 font-body">
                                <section>
                                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-3 text-[#24BCE0] font-heading tracking-tight">
                                        <Info size={20} />
                                        About the {isWorkshop ? 'Workshop' : 'Event'}
                                    </h3>
                                    <div className="text-[#D8D4F0] leading-relaxed bg-[#180614]/75 p-6 rounded-2xl border border-[#24BCE0]/20 text-sm sm:text-base font-normal backdrop-blur-md">
                                        {event.eventDescription || event.description || 'Join us for an unforgettable experience! Details for this event are coming soon.'}
                                    </div>
                                </section>

                                {/* Rounds and Rules Grid */}
                                <div className={`grid grid-cols-1 ${hasRounds && hasRules ? 'xl:grid-cols-2' : ''} gap-10`}>
                                    {hasRounds && (
                                        <section className="h-full">
                                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3 text-[#D62C76] font-heading tracking-tight">
                                                <Calendar size={20} />
                                                Rounds & Structure
                                            </h3>
                                            <div className="space-y-4 h-full">
                                                {Array.isArray(event.rounds) ? event.rounds.filter(r => r.name && r.name.trim() !== '').map((round, index) => (
                                                    <div key={index} className="bg-[#180614]/85 p-6 rounded-2xl border border-[#D62C76]/25 h-full">
                                                        <h4 className="text-base sm:text-lg font-semibold text-white mb-2 font-heading">{round.name}</h4>
                                                        <p className="text-[#D8D4F0] font-normal text-sm leading-relaxed whitespace-pre-wrap">{round.description}</p>
                                                    </div>
                                                )) : (
                                                    <div className="text-[#D8D4F0] leading-relaxed bg-[#180614]/85 p-6 rounded-2xl border border-[#D62C76]/25 whitespace-pre-wrap font-normal text-sm theme-rounds h-full">
                                                        {event.rounds}
                                                    </div>
                                                )}
                                            </div>
                                        </section>
                                    )}

                                    {hasRules && (
                                        <section className="h-full">
                                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3 text-[#F5A623] font-heading tracking-tight">
                                                <Tag size={20} />
                                                Rules & Guidelines
                                            </h3>
                                            <div className="text-[#D8D4F0] leading-relaxed bg-[#180614]/75 p-6 rounded-2xl border border-[#F5A623]/30 text-sm sm:text-base h-full backdrop-blur-md">
                                                {Array.isArray(event.rules) ? (
                                                    <ul className="list-disc leading-relaxed pl-4 space-y-2 marker:text-[#F5A623]">
                                                        {event.rules.map((rule, index) => (
                                                            <li key={index}>{rule}</li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <div className="whitespace-pre-wrap">{event.rules}</div>
                                                )}
                                            </div>
                                        </section>
                                    )}
                                </div>

                                {event.pptTemplateUrl && (
                                    <div className="bg-gradient-to-r from-[#180614]/90 to-[#24BCE0]/15 border border-[#24BCE0]/40 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl backdrop-blur-md">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-full bg-[#24BCE0]/20 border border-[#24BCE0]/30 flex items-center justify-center text-[#24BCE0] shadow-inner">
                                                <ExternalLink size={28} />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold text-white mb-1 font-display">Presentation Template</h4>
                                                <p className="text-sm text-[#D8D4F0] tracking-wide">Mandatory for all technical presentation rounds</p>
                                            </div>
                                        </div>
                                        <a
                                            href={event.pptTemplateUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full md:w-auto px-10 py-3.5 bg-gradient-to-r from-[#D62C76] via-[#F47721] to-[#F5A623] hover:opacity-95 text-white font-bold rounded-xl transition-all shadow-lg shadow-[#D62C76]/40 transform hover:scale-105 active:scale-95 text-center border border-[#F2D10A]/30"
                                        >
                                            Download Template
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Coordinators */}
                            <section>
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-[#24BCE0] font-display">
                                    <User size={24} />
                                    Event Coordinators
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {(event.facultyCoordinators || []).concat(event.studentCoordinators || []).map((c, idx) => (
                                        <div key={idx} className="bg-[#180614]/85 p-5 rounded-2xl flex items-center gap-4 border border-[#24BCE0]/20 hover:border-[#D62C76]/40 hover:bg-[#D62C76]/10 transition-all group backdrop-blur-md">
                                            <div className="w-14 h-14 rounded-full bg-[#D62C76]/25 border border-[#D62C76]/40 flex items-center justify-center font-bold text-xl text-[#D62C76] group-hover:bg-[#D62C76] group-hover:text-white transition-colors">
                                                {c.name?.charAt(0) || 'C'}
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-white mb-1">{c.name}</p>
                                                <a href={`tel:${c.phone}`} className="text-sm text-[#D8D4F0]/70 hover:text-[#24BCE0] flex items-center gap-2 transition-colors">
                                                    <Phone size={14} className="text-[#24BCE0]" /> {c.phone}
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Participant List (Protected) */}
                            {(userRole === 'admin' || userRole === 'hod' || userRole === 'principal' || userRole === 'dean') && (
                                <section className="border-t border-[#D62C76]/20 pt-12">
                                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-[#24BCE0] font-display">
                                        <User size={28} />
                                        Participant Manifest ({participants.length})
                                    </h3>

                                    {loadingParticipants ? (
                                        <div className="flex items-center gap-3 text-[#D8D4F0] animate-pulse">
                                            <div className="w-2 h-2 rounded-full bg-[#24BCE0]"></div>
                                            Synchronizing participant data...
                                        </div>
                                    ) : participants.length === 0 ? (
                                        <div className="bg-[#180614]/70 p-8 rounded-2xl text-center border border-[#D62C76]/20">
                                            <p className="text-[#D8D4F0]/70 italic">No registrations have been recorded for this event yet.</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto bg-[#180614]/90 rounded-2xl border border-[#24BCE0]/30">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="bg-[#24BCE0]/15 text-[#24BCE0] uppercase text-xs tracking-[0.2em] border-b border-[#24BCE0]/20">
                                                        <th className="px-6 py-4">Name</th>
                                                        <th className="px-6 py-4">Dept & Year</th>
                                                        <th className="px-6 py-4">Roll Number</th>
                                                        <th className="px-6 py-4">Contact</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[#D62C76]/15">
                                                    {participants.map((p, i) => (
                                                        <tr key={i} className="hover:bg-[#D62C76]/10 transition-colors group">
                                                            <td className="px-6 py-4 font-bold text-white group-hover:text-[#24BCE0] transition-colors">{p.studentName}</td>
                                                            <td className="px-6 py-4 text-[#D8D4F0]">{p.department} <span className="mx-2 text-[#D62C76]/40">|</span> Year {p.year}</td>
                                                            <td className="px-6 py-4 font-mono text-[#D8D4F0]/80 text-sm tracking-widest">{p.rollNumber}</td>
                                                            <td className="px-6 py-4">
                                                                <a href={`tel:${p.phone}`} className="text-[#D8D4F0] hover:text-[#24BCE0] flex items-center gap-2 transition-colors">
                                                                    <Phone size={14} className="text-[#24BCE0]" /> {p.phone}
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </section>
                            )}

                            {/* Register Button */}
                            <div className="pt-10 flex flex-col items-center">
                                <button
                                    onClick={() => window.location.assign(`/register/${event.slug}`)}
                                    className="w-full md:w-auto min-w-[280px] py-4.5 px-10 bg-gradient-to-r from-[#D62C76] via-[#F47721] to-[#F5A623] hover:opacity-95 text-white text-base sm:text-lg font-accent font-semibold rounded-2xl transition-all shadow-2xl shadow-[#D62C76]/40 transform hover:scale-[1.02] active:scale-98 tracking-wide border border-[#F2D10A]/40 flex items-center justify-center gap-2.5"
                                >
                                    <Sparkles size={18} className="text-[#F2D10A]" />
                                    <span>Register Now</span>
                                </button>
                                <p className="mt-4 text-[#D8D4F0]/70 text-xs sm:text-sm font-body font-normal">Limited slots available. Secure your spot today.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default EventDetail;
