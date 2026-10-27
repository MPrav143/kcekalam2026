import { Calendar, ArrowRight, Sparkles } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

const DepartmentCard = ({ dept, stats, totalEvents, accentColor = '#24BCE0', onClick }) => {
    // Calculate total events count directly without any subcategories
    const eventCount = totalEvents !== undefined
        ? totalEvents
        : (dept?.count !== undefined
            ? dept.count
            : (stats ? (stats.total ?? ((stats.workshops || 0) + (stats.technical || 0) + (stats.nonTechnical || 0))) : 0));

    const isCyan = accentColor === '#24BCE0' || accentColor.includes('24BCE0');

    return (
        <div
            onClick={onClick}
            className={`group h-full rounded-2xl border ${isCyan ? 'border-[#24BCE0]/25 hover:border-[#24BCE0]' : 'border-[#D62C76]/25 hover:border-[#D62C76]'} bg-[#180614]/85 overflow-hidden shadow-lg hover:shadow-[0_15px_35px_-10px_rgba(36,188,224,0.3)] transition-all duration-500 cursor-pointer flex flex-col hover:-translate-y-1.5`}
        >
            {/* Top Section - Image (Aspect Ratio 16/10) */}
            <div className={`aspect-[16/10] w-full relative overflow-hidden ${dept?.image ? 'bg-transparent' : 'bg-[#14050E]'}`}>
                {dept?.image ? (
                    <OptimizedImage
                        src={dept.image}
                        alt={dept.name}
                        preset="CATEGORY_BANNER"
                        aspectRatio="16/10"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#14050E] text-white/20">
                        <Sparkles size={24} className="sm:w-8 sm:h-8" />
                    </div>
                )}
                {/* Event Count Floating Badge */}
                <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 z-10">
                    <span
                        className="px-1.5 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[11px] font-bold uppercase tracking-wider backdrop-blur-md shadow-md flex items-center gap-1 text-white"
                        style={{
                            backgroundColor: isCyan ? 'rgba(36, 188, 224, 0.85)' : 'rgba(214, 44, 118, 0.85)',
                            border: `1px solid ${isCyan ? '#24BCE0' : '#D62C76'}`
                        }}
                    >
                        <Calendar size={10} className="sm:w-[11px] sm:h-[11px] shrink-0" />
                        <span>{eventCount} {eventCount === 1 ? 'Event' : 'Events'}</span>
                    </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#180715] via-transparent to-transparent opacity-80" />
            </div>

            {/* Bottom Section - Content (Category Name & Total Count) */}
            <div className="flex-1 p-2.5 sm:p-4 md:p-5 flex flex-col justify-between rounded-xl bg-[#180715]/90 backdrop-blur-xl border-t border-white/5 cursor-pointer group-hover:bg-[#1e0819] transition-all duration-300">
                <div className="w-full">
                    <h3 className="text-xs sm:text-base md:text-lg font-bold text-white font-heading leading-snug sm:leading-tight group-hover:text-[#24BCE0] transition-colors duration-300 mb-0.5 sm:mb-1 line-clamp-2">
                        {dept?.name}
                    </h3>
                    {dept?.tagline && (
                        <p className="text-[10px] sm:text-xs text-[#D8D4F0]/70 font-body line-clamp-1 sm:line-clamp-2 mt-0.5">
                            {dept.tagline}
                        </p>
                    )}
                </div>

                {/* Bottom Action Row - Simple & Direct */}
                <div className="mt-2 pt-2 sm:mt-3 sm:pt-3 border-t border-white/10 flex items-center justify-between w-full">
                    <span className="text-[9px] sm:text-[11px] font-medium text-[#D8D4F0]/80 truncate mr-1">
                        {eventCount} {eventCount === 1 ? 'event' : 'events'}
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-white/90 group-hover:text-white flex items-center gap-0.5 sm:gap-1 group-hover:translate-x-0.5 transition-all shrink-0">
                        <span>Explore</span>
                        <ArrowRight size={11} className={`sm:w-[13px] sm:h-[13px] ${isCyan ? 'text-[#24BCE0]' : 'text-[#D62C76]'}`} />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DepartmentCard;
