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
                        <Sparkles size={32} />
                    </div>
                )}
                {/* Event Count Floating Badge */}
                <div className="absolute top-2.5 right-2.5 z-10">
                    <span
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-md shadow-md flex items-center gap-1 text-white"
                        style={{
                            backgroundColor: isCyan ? 'rgba(36, 188, 224, 0.85)' : 'rgba(214, 44, 118, 0.85)',
                            border: `1px solid ${isCyan ? '#24BCE0' : '#D62C76'}`
                        }}
                    >
                        <Calendar size={11} />
                        {eventCount} {eventCount === 1 ? 'Event' : 'Events'}
                    </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#180715] via-transparent to-transparent opacity-80" />
            </div>

            {/* Bottom Section - Content (Category Name & Total Count) */}
            <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between rounded-xl bg-[#180715]/90 backdrop-blur-xl border-t border-white/5 cursor-pointer group-hover:bg-[#1e0819] transition-all duration-300">
                <div className="w-full">
                    <h3 className="text-base sm:text-lg font-bold text-white font-heading leading-tight group-hover:text-[#24BCE0] transition-colors duration-300 mb-1">
                        {dept?.name}
                    </h3>
                    {dept?.tagline && (
                        <p className="text-xs text-[#D8D4F0]/70 font-body line-clamp-2 mt-0.5">
                            {dept.tagline}
                        </p>
                    )}
                </div>

                {/* Bottom Action Row - Simple & Direct */}
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between w-full">
                    <span className="text-[11px] font-medium text-[#D8D4F0]/80">
                        Total {eventCount} {eventCount === 1 ? 'competition' : 'competitions'}
                    </span>
                    <span className="text-xs font-bold text-white/90 group-hover:text-white flex items-center gap-1 group-hover:translate-x-0.5 transition-all">
                        View Events
                        <ArrowRight size={13} className={isCyan ? 'text-[#24BCE0]' : 'text-[#D62C76]'} />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DepartmentCard;
