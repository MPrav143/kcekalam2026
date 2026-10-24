import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { X, Calendar, MapPin, User, Mail, Phone, Info, Clock, Tag, Building2, ExternalLink, Users, Award, ShieldAlert, Sparkles, CheckCircle2, ArrowRight, Ticket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { API_URL, BASE_URL } from '../utils/config';
import { getImageUrl } from '../utils/imageUtils';

const EventDetailsModal = ({ event, onClose, showRegister = true, isAdminView = false }) => {
    const navigate = useNavigate();
    const [participants, setParticipants] = useState([]);
    const [loadingParticipants, setLoadingParticipants] = useState(false);
    const [userRole, setUserRole] = useState('');

    // Escape key listener to close modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose?.();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Prevent background scrolling while modal is open, restore cleanly
    useEffect(() => {
        if (event) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [event]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
        setUserRole(user.role);

        if (event && isAdminView && (user.role === 'admin' || user.role === 'hod' || user.role === 'principal' || user.role === 'dean')) {
            fetchParticipants();
        }
    }, [event, isAdminView]);

    const fetchParticipants = async () => {
        if (!event?._id) return;
        setLoadingParticipants(true);
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`${API_URL}/registrations/events/${event._id}`, {
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
        if (!event?._id) return;
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`${API_URL}/registrations/events/${event._id}/export`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${event.title || 'event'}_participants.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Failed to download CSV", error);
            alert("Failed to download CSV");
        }
    };

    if (!event) return null;

    const isWorkshop = event.category === 'Workshop' || event.eventType === 'Workshop';
    const formattedDate = event.date ? new Date(event.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }) : null;

    const formattedTime = event.timings || (event.fromTime && event.toTime ? `${event.fromTime} - ${event.toTime}` : event.fromTime) || event.time || null;
    const hasPrize = Boolean(event.winnerPrize || event.runnerPrize || event.prize);
    const coordinators = (event.facultyCoordinators || []).concat(event.studentCoordinators || []);

    const teamSizeText = event.teamSize || (event.minTeamSize && event.maxTeamSize
        ? `${event.minTeamSize} - ${event.maxTeamSize} Members`
        : event.minTeamSize
            ? `${event.minTeamSize} Member(s)`
            : event.participationType || null);

    const feeText = event.registrationFee || event.fee || (event.isFree ? 'Free Admission' : null);
    const deadlineText = (event.registrationDeadline || event.deadline)
        ? new Date(event.registrationDeadline || event.deadline).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
        : null;

    const eventImageUrl = event.image
        ? getImageUrl(event.image)
        : 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80';

    const handleActionRegister = () => {
        onClose?.();
        if (event.registrationUrl || event.registrationLink) {
            window.open(event.registrationUrl || event.registrationLink, '_blank', 'noopener,noreferrer');
        } else {
            navigate('/passes');
        }
    };

    return (
        <AnimatePresence>
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-event-title"
                className="fixed inset-0 z-[105] flex items-center justify-center p-3 sm:p-5 md:p-6 lg:p-8 bg-black/60 backdrop-blur-sm overflow-y-auto"
                onClick={(e) => {
                    if (e.target === e.currentTarget) onClose?.();
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 16 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#140612]/95 border border-[#24BCE0]/40 w-full max-w-5xl lg:max-w-6xl max-h-[90vh] rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] relative flex flex-col md:flex-row overflow-hidden backdrop-blur-xl"
                >
                    {/* Close Button — High contrast, top-right, easy touch target */}
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close event details"
                        className="absolute top-3.5 right-3.5 z-30 w-10 h-10 rounded-full bg-black/70 hover:bg-[#D62C76] text-white/80 hover:text-white border border-white/20 transition-all flex items-center justify-center cursor-pointer shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#24BCE0]"
                    >
                        <X size={20} />
                    </button>

                    {/* Left Column: Artwork Image & Festival Brand Identity */}
                    <div className="w-full md:w-5/12 h-52 sm:h-64 md:h-auto relative shrink-0 overflow-hidden bg-[#0c040d]">
                        <img
                            src={eventImageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#140612] via-[#140612]/40 to-transparent md:bg-gradient-to-r md:from-transparent md:via-[#140612]/20 md:to-[#140612]" />

                        {/* Category & Track Badges */}
                        <div className="absolute top-3.5 left-3.5 z-20 flex flex-wrap gap-2">
                            {event.category && (
                                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#F5A623] to-[#F2D10A] text-black shadow-md">
                                    {event.category}
                                </span>
                            )}
                            {event.eventType && event.eventType !== event.category && (
                                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#D62C76]/90 text-white shadow-md border border-white/20">
                                    {event.eventType}
                                </span>
                            )}
                        </div>

                        {/* Mobile Title Overlay */}
                        <div className="absolute bottom-3.5 left-3.5 right-3.5 md:hidden z-20">
                            <h2 className="text-xl font-bold font-heading text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] line-clamp-2">
                                {event.title}
                            </h2>
                            {(event.department || event.club) && (
                                <p className="text-xs text-[#FFE6A0] font-semibold mt-0.5 flex items-center gap-1 drop-shadow-md">
                                    <Building2 size={12} />
                                    <span>{event.department || event.club}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Scrollable Event Information Details */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-7 space-y-4 custom-scrollbar text-white">
                        {/* Desktop Header */}
                        <div className="hidden md:block pr-8">
                            {(event.department || event.club) && (
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#F5A623]/15 border border-[#F5A623]/35 text-[#FFE6A0] text-xs font-semibold tracking-wider uppercase mb-1.5">
                                    <Building2 size={12} />
                                    <span>{event.department || event.club}</span>
                                </div>
                            )}
                            <h2 id="modal-event-title" className="text-xl sm:text-2xl font-bold font-heading tracking-tight text-white leading-tight">
                                {event.title}
                            </h2>
                        </div>

                        {/* Admin CSV Download Action */}
                        {isAdminView && (userRole === 'admin' || userRole === 'hod' || userRole === 'principal' || userRole === 'dean') && (
                            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#24BCE0]/10 border border-[#24BCE0]/30">
                                <span className="text-xs font-medium text-white/80">Admin Export</span>
                                <button
                                    onClick={handleDownloadCSV}
                                    className="flex items-center gap-1.5 bg-[#24BCE0] hover:bg-[#24BCE0]/90 text-black px-2.5 py-1 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer"
                                >
                                    <Tag size={12} /> Export CSV
                                </button>
                            </div>
                        )}

                        {/* Quick Stats Grid (Date, Time, Venue, Fee, Team Size, Deadline) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                            {formattedDate && (
                                <div className="bg-[#1a0818]/85 p-2.5 sm:p-3 rounded-xl border border-[#24BCE0]/25 flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-[#24BCE0]/20 flex items-center justify-center text-[#24BCE0] shrink-0">
                                        <Calendar size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-white/50 uppercase font-semibold">Event Date</p>
                                        <p className="text-xs sm:text-sm font-semibold text-white truncate">{formattedDate}</p>
                                    </div>
                                </div>
                            )}

                            {formattedTime && (
                                <div className="bg-[#1a0818]/85 p-2.5 sm:p-3 rounded-xl border border-[#D62C76]/25 flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-[#D62C76]/20 flex items-center justify-center text-[#D62C76] shrink-0">
                                        <Clock size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-white/50 uppercase font-semibold">Time Schedule</p>
                                        <p className="text-xs sm:text-sm font-semibold text-white truncate">{formattedTime}</p>
                                    </div>
                                </div>
                            )}

                            {event.venue && (
                                <div className="bg-[#1a0818]/85 p-2.5 sm:p-3 rounded-xl border border-[#F47721]/25 flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-[#F47721]/20 flex items-center justify-center text-[#F47721] shrink-0">
                                        <MapPin size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-white/50 uppercase font-semibold">Venue</p>
                                        <p className="text-xs sm:text-sm font-semibold text-white truncate">{event.venue}</p>
                                    </div>
                                </div>
                            )}

                            {teamSizeText && (
                                <div className="bg-[#1a0818]/85 p-2.5 sm:p-3 rounded-xl border border-[#F2D10A]/25 flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-[#F2D10A]/20 flex items-center justify-center text-[#F2D10A] shrink-0">
                                        <Users size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-white/50 uppercase font-semibold">Team Size</p>
                                        <p className="text-xs sm:text-sm font-semibold text-white truncate">{teamSizeText}</p>
                                    </div>
                                </div>
                            )}

                            {feeText && (
                                <div className="bg-[#1a0818]/85 p-2.5 sm:p-3 rounded-xl border border-[#F5A623]/25 flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-[#F5A623]/20 flex items-center justify-center text-[#F5A623] shrink-0">
                                        <Tag size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-white/50 uppercase font-semibold">Registration Fee</p>
                                        <p className="text-xs sm:text-sm font-semibold text-[#FFE6A0] truncate">{feeText}</p>
                                    </div>
                                </div>
                            )}

                            {deadlineText && (
                                <div className="bg-[#1a0818]/85 p-2.5 sm:p-3 rounded-xl border border-[#D62C76]/25 flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-[#D62C76]/20 flex items-center justify-center text-[#D62C76] shrink-0">
                                        <ShieldAlert size={16} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] text-white/50 uppercase font-semibold">Deadline</p>
                                        <p className="text-xs sm:text-sm font-semibold text-[#F2D10A] truncate">{deadlineText}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Prize Pool & Accolades */}
                        {hasPrize && (
                            <div className="bg-gradient-to-r from-[#F5A623]/15 via-[#D62C76]/15 to-[#F47721]/15 p-3 rounded-2xl border border-[#F2D10A]/40 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-[#F2D10A]/20 flex items-center justify-center text-[#F2D10A] shrink-0 shadow-lg">
                                    <Award size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs uppercase font-bold text-[#F2D10A] tracking-wider">Prizes & Glory</p>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-0.5 text-xs sm:text-sm font-semibold text-white">
                                        {event.winnerPrize && (
                                            <span>Winner: <strong className="text-[#F2D10A]">{event.winnerPrize}</strong></span>
                                        )}
                                        {event.runnerPrize && (
                                            <span>Runner-Up: <strong className="text-white/80">{event.runnerPrize}</strong></span>
                                        )}
                                        {!event.winnerPrize && !event.runnerPrize && event.prize && (
                                            <span>Prize: <strong className="text-[#F2D10A]">{event.prize}</strong></span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Event Description */}
                        {(event.description || event.eventDescription) && (
                            <div className="space-y-1.5">
                                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FFE6A0] flex items-center gap-1.5">
                                    <Info size={14} />
                                    <span>About the {isWorkshop ? 'Workshop' : 'Event'}</span>
                                </h3>
                                <p className="text-white/80 leading-relaxed text-xs sm:text-[13px] bg-[#160614]/80 p-3 rounded-xl border border-white/10 whitespace-pre-line font-body">
                                    {event.description || event.eventDescription}
                                </p>
                            </div>
                        )}

                        {/* Eligibility & Participation Rules */}
                        {event.eligibility && (
                            <div className="space-y-1.5">
                                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F2D10A] flex items-center gap-1.5">
                                    <Building2 size={14} />
                                    <span>Eligibility</span>
                                </h3>
                                <p className="text-white/80 leading-relaxed text-xs sm:text-[13px] bg-[#160614]/80 p-2.5 rounded-xl border border-white/10">
                                    {event.eligibility}
                                </p>
                            </div>
                        )}

                        {/* Rounds Details */}
                        {event.rounds && (Array.isArray(event.rounds) ? event.rounds.length > 0 : String(event.rounds).trim().length > 0) && (
                            <div className="space-y-1.5">
                                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#D62C76] flex items-center gap-1.5">
                                    <Calendar size={14} />
                                    <span>Rounds & Evaluation</span>
                                </h3>
                                <div className="text-white/80 leading-relaxed text-xs sm:text-[13px] bg-[#160614]/80 p-3 rounded-xl border border-[#D62C76]/30 whitespace-pre-wrap font-mono theme-rounds">
                                    {Array.isArray(event.rounds)
                                        ? event.rounds.map((r, i) => typeof r === 'string' ? r : `${r.name || `Round ${i + 1}`}: ${r.description || ''}`).join('\n\n')
                                        : event.rounds}
                                </div>
                            </div>
                        )}

                        {/* Guidelines & Rules */}
                        {event.rules && (Array.isArray(event.rules) ? event.rules.length > 0 : String(event.rules).trim().length > 0) && (
                            <div className="space-y-1.5">
                                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F5A623] flex items-center gap-1.5">
                                    <Tag size={14} />
                                    <span>Guidelines & Rules</span>
                                </h3>
                                <div className="text-white/80 leading-relaxed text-xs sm:text-[13px] bg-[#160614]/80 p-3 rounded-xl border border-white/10 whitespace-pre-wrap">
                                    {Array.isArray(event.rules) ? event.rules.join('\n') : event.rules}
                                </div>
                            </div>
                        )}

                        {/* PPT Template Download Link */}
                        {event.pptTemplateUrl && (
                            <div className="bg-[#1a0818]/90 border border-[#F5A623]/40 p-2.5 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ExternalLink className="text-[#F5A623]" size={16} />
                                    <div>
                                        <p className="text-xs font-bold text-white">Presentation Template</p>
                                        <p className="text-[10px] text-white/50">Official slides for technical evaluation</p>
                                    </div>
                                </div>
                                <a
                                    href={event.pptTemplateUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1 bg-gradient-to-r from-[#D62C76] to-[#F47721] text-white text-xs font-bold rounded-lg shadow transition-all hover:scale-105"
                                >
                                    Download
                                </a>
                            </div>
                        )}

                        {coordinators.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FFE6A0] flex items-center gap-1.5">
                                    <User size={14} />
                                    <span>Coordinators</span>
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {coordinators.map((c, idx) => (
                                        <div key={idx} className="bg-[#160614]/80 p-2.5 rounded-xl flex items-center gap-2.5 border border-white/10">
                                            <div className="w-7 h-7 rounded-full bg-[#D62C76]/25 border border-[#D62C76]/40 flex items-center justify-center font-bold text-[#D62C76] text-xs shrink-0">
                                                {c.name?.charAt(0) || 'C'}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-white truncate">{c.name}</p>
                                                {c.phone && (
                                                    <a href={`tel:${c.phone}`} className="text-[10px] text-[#FFE6A0] hover:underline flex items-center gap-1 mt-0.5">
                                                        <Phone size={10} /> {c.phone}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Participant List (Protected Admin View) */}
                        {isAdminView && (userRole === 'admin' || userRole === 'hod' || userRole === 'principal' || userRole === 'dean') && (
                            <div className="border-t border-white/10 pt-3 space-y-2">
                                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FFE6A0]">
                                    Registered Participants ({participants.length})
                                </h3>
                                {loadingParticipants ? (
                                    <p className="text-white/50 text-xs italic">Loading participants...</p>
                                ) : participants.length === 0 ? (
                                    <p className="text-white/40 text-xs italic">No registrations yet.</p>
                                ) : (
                                    <div className="overflow-x-auto bg-[#160614] rounded-xl border border-white/10">
                                        <table className="w-full text-left text-xs">
                                            <thead className="bg-[#F5A623]/15 text-[#FFE6A0] uppercase font-bold text-[10px]">
                                                <tr>
                                                    <th className="px-3 py-2">Name</th>
                                                    <th className="px-3 py-2">Dept</th>
                                                    <th className="px-3 py-2">Roll No</th>
                                                    <th className="px-3 py-2">Phone</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/10 text-white/80">
                                                {participants.map((p, i) => (
                                                    <tr key={i} className="hover:bg-white/5">
                                                        <td className="px-3 py-1.5 font-medium text-white">{p.studentName}</td>
                                                        <td className="px-3 py-1.5">{p.department} - {p.year}</td>
                                                        <td className="px-3 py-1.5">{p.rollNumber}</td>
                                                        <td className="px-3 py-1.5">{p.phone}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Primary Registration Action CTA -> Navigates to Passes Page */}
                        {showRegister && (
                            <div className="pt-1.5">
                                <button
                                    type="button"
                                    onClick={handleActionRegister}
                                    className="w-full py-2.5 sm:py-3 px-5 bg-gradient-to-r from-[#D62C76] via-[#F47721] to-[#F5A623] hover:from-[#c22064] hover:to-[#e09418] text-white font-heading font-bold text-xs sm:text-sm rounded-xl transition-all shadow-[0_0_25px_rgba(214,44,118,0.45)] transform hover:scale-[1.01] active:scale-[0.99] border border-[#F2D10A]/50 flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Ticket size={18} className="text-[#F2D10A] shrink-0" />
                                    <span>Select Pass to Register for {event.title}</span>
                                    <ArrowRight size={16} className="shrink-0" />
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default EventDetailsModal;
