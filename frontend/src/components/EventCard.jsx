import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Trophy, ArrowRight, Eye, Edit, Trash2, Sparkles, Zap } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';
import OptimizedImage from './OptimizedImage';

/**
 * Category Theme Resolver
 * Maps event categories to sophisticated sci-fi color tokens
 */
const getCategoryTokens = (category = '') => {
    const cat = category.toLowerCase();
    // Technical -> KALAM Cyan (#24BCE0)
    if (cat.includes('technical') || cat.includes('hackathon') || cat.includes('code') || cat.includes('ideathon')) {
        return {
            border: 'border-[#24BCE0]/35 group-hover:border-[#24BCE0]',
            glow: 'rgba(36, 188, 224, 0.35)',
            accent: '#24BCE0',
            accentLight: '#7DD3FC',
            badgeBg: 'bg-[#24BCE0]/20 border-[#24BCE0]/40 text-[#24BCE0]',
            accentLine: 'from-[#24BCE0] via-[#F2D10A] to-transparent',
            primaryBtn: 'from-[#24BCE0] via-[#0284C7] to-[#123C8C] hover:from-[#38BDF8] hover:to-[#0284C7]',
            cornerColor: '#24BCE0',
        };
    }
    // Workshops -> KALAM Coral Red (#F04438)
    if (cat.includes('workshop') || cat.includes('hands-on')) {
        return {
            border: 'border-[#F04438]/35 group-hover:border-[#F04438]',
            glow: 'rgba(240, 68, 56, 0.35)',
            accent: '#F04438',
            accentLight: '#FCA5A5',
            badgeBg: 'bg-[#F04438]/20 border-[#F04438]/40 text-[#FCA5A5]',
            accentLine: 'from-[#F04438] via-[#F47721] to-transparent',
            primaryBtn: 'from-[#D62C76] via-[#F04438] to-[#F47721] hover:from-[#b0225e] hover:to-[#e03d32]',
            cornerColor: '#F04438',
        };
    }
    // Cultural -> KALAM Magenta (#D62C76)
    if (cat.includes('cultural') || cat.includes('music') || cat.includes('concert') || cat.includes('dance')) {
        return {
            border: 'border-[#D62C76]/35 group-hover:border-[#D62C76]',
            glow: 'rgba(214, 44, 118, 0.38)',
            accent: '#D62C76',
            accentLight: '#F472B6',
            badgeBg: 'bg-[#D62C76]/20 border-[#D62C76]/40 text-[#F472B6]',
            accentLine: 'from-[#D62C76] via-[#F47721] to-transparent',
            primaryBtn: 'from-[#D62C76] via-[#F47721] to-[#F5A623] hover:from-[#b0225e] hover:to-[#d96818]',
            cornerColor: '#D62C76',
        };
    }
    // Default -> KALAM Golden & Magenta Theme
    return {
        border: 'border-[#F5A623]/35 group-hover:border-[#D62C76]',
        glow: 'rgba(245, 166, 35, 0.35)',
        accent: '#F5A623',
        accentLight: '#F2D10A',
        badgeBg: 'bg-[#F5A623]/20 border-[#F2D10A]/40 text-[#F2D10A]',
        accentLine: 'from-[#F2D10A] via-[#F5A623] to-transparent',
        primaryBtn: 'from-[#D62C76] via-[#F47721] to-[#F5A623] hover:from-[#b0225e] hover:to-[#e59b1f]',
        cornerColor: '#F5A623',
    };
};

const EventCard = ({
    event,
    onEdit,
    onDelete,
    onView,
    onExplore,
    onRegister,
    className = '',
}) => {
    const navigate = useNavigate();

    if (!event) return null;

    const tokens = getCategoryTokens(event.category || event.eventType);

    const handleExplore = (e) => {
        e.stopPropagation();
        if (onExplore) {
            onExplore(event);
        } else {
            navigate(`/event/${event.slug || event._id}`);
        }
    };

    const handleRegister = (e) => {
        e.stopPropagation();
        if (onRegister) {
            onRegister(event);
        } else if (onView) {
            onView(event);
        } else {
            navigate(`/register/${event._id}`);
        }
    };

    // Format dates & times safely
    const formattedDate = event.date
        ? new Date(event.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
          })
        : 'Festival Days';

    const formattedTime = event.fromTime
        ? event.toTime
            ? `${event.fromTime} - ${event.toTime}`
            : event.fromTime
        : event.timings || null;

    const prizeAmount = event.winnerPrize || event.prize;

    const handleCardClick = (e) => {
        if (e.target.closest('button') || e.target.closest('a')) {
            return;
        }
        if (onExplore) {
            onExplore(event);
        } else if (onView) {
            onView(event);
        } else {
            navigate(`/event/${event.slug || event._id}`);
        }
    };

    return (
        <div
            onClick={handleCardClick}
            className={`group relative flex flex-col h-full bg-[#180614]/85 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:-translate-y-1.5 ${tokens.border} overflow-hidden cursor-pointer ${className}`}
            style={{
                boxShadow: `0 10px 30px -10px rgba(0, 0, 0, 0.6)`,
            }}
        >
            {/* Subtle Outer Glow on Hover */}
            <div
                className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at 50% 20%, ${tokens.glow} 0%, transparent 70%)`,
                }}
            />

            {/* Futuristic Top Circuit Edge Accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#24BCE0]/60 to-transparent opacity-60 group-hover:opacity-100 transition-opacity z-20" />

            {/* Angular Corner Accents (Subtle Sci-Fi Geometry) */}
            <div
                className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 pointer-events-none z-20 transition-colors duration-300"
                style={{ borderColor: tokens.cornerColor }}
            />
            <div
                className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 pointer-events-none z-20 transition-colors duration-300"
                style={{ borderColor: tokens.cornerColor }}
            />
            <div
                className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 pointer-events-none z-20 transition-colors duration-300"
                style={{ borderColor: tokens.cornerColor }}
            />
            <div
                className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 pointer-events-none z-20 transition-colors duration-300"
                style={{ borderColor: tokens.cornerColor }}
            />

            {/* A. Large Event Image */}
            <div className={`relative aspect-[16/9] w-full overflow-hidden ${event.image ? 'bg-transparent' : 'bg-[#14050E]/60'}`}>
                <OptimizedImage
                    src={event.image}
                    alt={event.title}
                    preset="EVENT_CARD"
                    aspectRatio="16/9"
                    fallbackSrc="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=640&q=80"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {!event.image && (
                    <div className="absolute inset-0 bg-gradient-to-t from-[#180614] via-[#180614]/30 to-transparent" />
                )}

                {/* Category Badge */}
                <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 z-10">
                    <span
                        className={`inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-0.5 rounded-full text-[8px] sm:text-[10px] font-heading font-semibold uppercase tracking-wider border backdrop-blur-md shadow-sm ${tokens.badgeBg}`}
                    >
                        <Zap size={9} className="sm:w-2.5 sm:h-2.5 shrink-0" />
                        <span className="line-clamp-1">{event.category || 'Science Event'}</span>
                    </span>
                </div>

                {/* Event Type / Department Tag (if present) */}
                {(event.eventType || event.department) && (
                    <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 z-10">
                        <span className="inline-block px-1.5 sm:px-2 py-0.5 rounded-md text-[8px] sm:text-[9px] font-mono uppercase tracking-wider bg-[#14050E]/80 text-[#D8D4F0]/90 border border-[#24BCE0]/25 backdrop-blur-md line-clamp-1">
                            {event.eventType && event.eventType !== 'Normal'
                                ? event.eventType
                                : event.department?.slice(0, 14) || 'Festival'}
                        </span>
                    </div>
                )}

                {/* Prize Highlight (over bottom of image if available) */}
                {prizeAmount && (
                    <div className="absolute bottom-1.5 left-2 sm:bottom-2 sm:left-3 z-10 flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 rounded-lg bg-[#14050E]/85 border border-[#F5A623]/40 text-[#F2D10A] text-[9px] sm:text-[11px] font-semibold backdrop-blur-md">
                        <Trophy size={10} className="sm:w-[11px] sm:h-[11px] text-[#F5A623] shrink-0" />
                        <span className="line-clamp-1">{prizeAmount}</span>
                    </div>
                )}
            </div>

            {/* Card Content Body */}
            <div className="relative p-2.5 sm:p-4 md:p-4.5 flex flex-col flex-1 z-10">
                {/* B. Event Title */}
                <div className="mb-1">
                    <h3
                        className="text-xs sm:text-base md:text-lg font-bold font-heading text-white tracking-tight leading-snug line-clamp-1 group-hover:text-[#24BCE0] transition-colors"
                        title={event.title}
                    >
                        {event.title}
                    </h3>

                    {/* Futuristic Accent Line beneath title */}
                    <div className="mt-1 sm:mt-1.5 h-[2px] w-8 sm:w-10 bg-gradient-to-r rounded-full transition-all duration-300 group-hover:w-16"
                        style={{
                            background: `linear-gradient(90deg, ${tokens.accent} 0%, transparent 100%)`,
                        }}
                    />
                </div>

                {/* C. Event Description (2 lines truncated) */}
                <p className="text-[10px] sm:text-xs font-body text-[#D8D4F0]/80 leading-relaxed line-clamp-2 mb-2 sm:mb-2.5">
                    {event.description ||
                        'Engage in premier competitive scientific tracks, hands-on demonstrations, and academic challenges.'}
                </p>

                {/* Metadata Chips: Date, Time, Venue */}
                <div className="space-y-1 sm:space-y-1.5 mb-2.5 sm:mb-3.5 text-[9px] sm:text-[11px] text-[#D8D4F0]/70 font-body">
                    <div className="flex items-center gap-1 sm:gap-1.5">
                        <Calendar size={11} className="sm:w-[13px] sm:h-[13px] shrink-0" style={{ color: tokens.accentLight }} />
                        <span className="line-clamp-1">{formattedDate}</span>
                    </div>

                    {formattedTime && (
                        <div className="flex items-center gap-1 sm:gap-1.5">
                            <Clock size={11} className="sm:w-[13px] sm:h-[13px] shrink-0" style={{ color: tokens.accentLight }} />
                            <span className="line-clamp-1">{formattedTime}</span>
                        </div>
                    )}

                    {event.venue && (
                        <div className="flex items-center gap-1 sm:gap-1.5">
                            <MapPin size={11} className="sm:w-[13px] sm:h-[13px] shrink-0" style={{ color: tokens.accentLight }} />
                            <span className="line-clamp-1">{event.venue}</span>
                        </div>
                    )}
                </div>

                {/* D. Action Buttons */}
                <div className="mt-auto pt-2 sm:pt-2.5 border-t border-[#D62C76]/20">
                    {onEdit && onDelete ? (
                        /* Admin Controls */
                        <div className="flex gap-1.5 sm:gap-2">
                            <button
                                type="button"
                                onClick={() => onEdit(event)}
                                className="flex-1 flex items-center justify-center gap-1 py-1.5 sm:py-2 px-1.5 sm:px-2.5 rounded-lg sm:rounded-xl bg-[#24BCE0]/15 hover:bg-[#24BCE0]/25 text-[#24BCE0] text-[10px] sm:text-xs font-semibold transition-colors border border-[#24BCE0]/30 cursor-pointer"
                            >
                                <Edit size={11} className="sm:w-[13px] sm:h-[13px]" /> Edit
                            </button>
                            <button
                                type="button"
                                onClick={() => onDelete(event._id)}
                                className="flex-1 flex items-center justify-center gap-1 py-1.5 sm:py-2 px-1.5 sm:px-2.5 rounded-lg sm:rounded-xl bg-[#F04438]/20 hover:bg-[#F04438]/30 text-[#F04438] text-[10px] sm:text-xs font-semibold transition-colors border border-[#F04438]/30 cursor-pointer"
                            >
                                <Trash2 size={11} className="sm:w-[13px] sm:h-[13px]" /> Delete
                            </button>
                        </div>
                    ) : (
                        /* Public Dual Action Buttons: Explore & Register */
                        <div className="grid grid-cols-2 gap-1 sm:gap-2">
                            {/* Secondary Action: Explore */}
                            <button
                                type="button"
                                onClick={handleExplore}
                                className="relative py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg sm:rounded-xl font-heading font-medium text-[10px] sm:text-xs text-[#D8D4F0] hover:text-white bg-[#24BCE0]/10 hover:bg-[#24BCE0]/20 border border-[#24BCE0]/25 hover:border-[#24BCE0]/50 backdrop-blur-md transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer active:scale-[0.98]"
                            >
                                <Eye size={11} className="opacity-75 text-[#24BCE0] shrink-0" />
                                <span className="truncate">Explore</span>
                            </button>

                            {/* Primary Action: Register */}
                            <button
                                type="button"
                                onClick={handleRegister}
                                className={`relative py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg sm:rounded-xl font-heading font-semibold text-[10px] sm:text-xs text-white bg-gradient-to-r ${tokens.primaryBtn} border border-white/20 shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1 cursor-pointer overflow-hidden group/btn`}
                            >
                                {/* Shimmer Sweep on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                                <Sparkles size={10} className="shrink-0 text-white/80" />
                                <span className="truncate">Register</span>
                                <ArrowRight size={10} className="hidden sm:inline shrink-0 group-hover/btn:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventCard;
