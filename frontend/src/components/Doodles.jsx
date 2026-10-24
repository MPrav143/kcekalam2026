// Geometric polygonal accents inspired by the KALAM logo & its 6 authentic color families:
// Yellow (#F2D10A), Golden (#F5A623), Orange (#F47721), Coral Red (#F04438), Magenta (#D62C76), Cyan (#24BCE0)
const Doodles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
        {/* Top-right low-poly facet cluster (Magenta, Coral Red, Golden, Yellow) */}
        <svg
            className="absolute -top-10 -right-16 w-80 h-80 opacity-30 transition-transform duration-1000"
            viewBox="0 0 300 300"
            fill="none"
        >
            <polygon points="150,20 220,90 180,180 90,140" fill="url(#polyGradMagentaCoral)" opacity="0.65" />
            <polygon points="220,90 280,160 210,230 180,180" fill="url(#polyGradOrangeGolden)" opacity="0.55" />
            <polygon points="90,140 180,180 140,250 50,190" fill="url(#polyGradGoldenYellow)" opacity="0.45" />
            <polygon points="180,180 210,230 140,250" fill="#D62C76" opacity="0.75" />
            <defs>
                <linearGradient id="polyGradMagentaCoral" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#D62C76" />
                    <stop offset="100%" stopColor="#F04438" />
                </linearGradient>
                <linearGradient id="polyGradOrangeGolden" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#F47721" />
                    <stop offset="100%" stopColor="#F5A623" />
                </linearGradient>
                <linearGradient id="polyGradGoldenYellow" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#F5A623" />
                    <stop offset="100%" stopColor="#F2D10A" />
                </linearGradient>
            </defs>
        </svg>

        {/* Top-left subtle geometric facets (Cyan & Magenta) */}
        <svg
            className="absolute top-28 -left-12 w-64 h-64 opacity-25"
            viewBox="0 0 200 200"
            fill="none"
        >
            <polygon points="80,10 160,50 120,130 40,90" fill="url(#polyGradCyanMagenta)" />
            <polygon points="160,50 190,120 120,130" fill="#24BCE0" opacity="0.5" />
            <polygon points="40,90 120,130 70,180 10,120" fill="#D62C76" opacity="0.4" />
            <defs>
                <linearGradient id="polyGradCyanMagenta" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#24BCE0" />
                    <stop offset="100%" stopColor="#D62C76" />
                </linearGradient>
            </defs>
        </svg>

        {/* Mid-right KALAM geometric facet diagram */}
        <svg
            className="absolute top-1/2 right-6 w-44 h-44 opacity-25"
            viewBox="0 0 160 160"
            fill="none"
            stroke="#24BCE0"
            strokeWidth="0.9"
        >
            <circle cx="80" cy="80" r="60" strokeDasharray="3 3" opacity="0.6" />
            <polygon points="80,20 132,50 132,110 80,140 28,110 28,50" stroke="#F5A623" opacity="0.7" />
            <line x1="80" y1="20" x2="80" y2="140" stroke="#D62C76" opacity="0.5" />
            <line x1="28" y1="50" x2="132" y2="110" stroke="#24BCE0" opacity="0.5" />
            <line x1="28" y1="110" x2="132" y2="50" stroke="#F47721" opacity="0.5" />
        </svg>

        {/* Bottom-left low-poly crystal facets (Orange / Coral Red / Yellow / Golden) */}
        <svg
            className="absolute bottom-20 -left-10 w-72 h-72 opacity-25"
            viewBox="0 0 240 240"
            fill="none"
        >
            <polygon points="120,20 180,80 140,160 60,110" fill="#F47721" opacity="0.5" />
            <polygon points="180,80 220,150 140,160" fill="#F04438" opacity="0.55" />
            <polygon points="60,110 140,160 100,220 30,160" fill="#F5A623" opacity="0.45" />
            <polygon points="140,160 220,150 170,210 100,220" fill="#F2D10A" opacity="0.4" />
        </svg>

        {/* Bottom-right subtle accent (Magenta & Cyan) */}
        <svg
            className="absolute bottom-10 right-10 w-48 h-48 opacity-20"
            viewBox="0 0 180 180"
            fill="none"
            stroke="#D62C76"
            strokeWidth="0.8"
        >
            <polygon points="90,10 160,80 130,160 40,140 20,60" />
            <circle cx="90" cy="90" r="4" fill="#24BCE0" />
        </svg>
    </div>
);

export default Doodles;
