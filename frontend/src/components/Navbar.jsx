import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useGlobalConfig } from '../context/GlobalConfigContext';
import OptimizedImage from './OptimizedImage';
import { useHasPageBackground } from './PageBackground';

const Navbar = () => {
    const hasBgImage = useHasPageBackground();
    const { config, departments, culturalSubcategories } = useGlobalConfig();
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 15);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Dynamically split departments across 2 columns for mega-menu
    const deptList = departments && departments.length > 0 ? departments : [];
    const colCount = 2;
    const itemsPerCol = Math.max(1, Math.ceil(deptList.length / colCount));
    const techColumns = Array.from({ length: colCount }, (_, colIdx) => ({
        links: deptList.slice(colIdx * itemsPerCol, (colIdx + 1) * itemsPerCol).map(dept => ({
            name: dept.name.replace(/^Department of\s+/i, ''),
            code: dept.code
        }))
    })).filter(col => col.links.length > 0);

    const culturalDropdown = (culturalSubcategories && culturalSubcategories.length > 0 ? culturalSubcategories : [
        { name: 'On Stage', code: 'OnStage' },
        { name: 'Off Stage', code: 'OffStage' }
    ]);

    const navLinks = [
        { name: 'Home', sectionId: 'home' },
        { name: 'About', sectionId: 'about' },
        {
            name: 'Technical Fest',
            sectionId: 'technical-events',
            columns: techColumns
        },
        {
            name: 'Cultural Fest',
            sectionId: 'cultural-events',
            dropdown: culturalDropdown
        },
        { name: 'Passes', sectionId: 'passes' },
    ];

    const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);

    const toggleMobileDropdown = (name) => {
        setActiveMobileDropdown(activeMobileDropdown === name ? null : name);
    };

    // Smooth section scrolling handler
    const handleNavClick = (e, sectionId, filterDept = null, filterSub = null) => {
        if (e) e.preventDefault();
        setIsOpen(false);

        if (filterDept) {
            window.dispatchEvent(new CustomEvent('filter-technical-dept', { detail: { dept: filterDept } }));
        } else if (sectionId === 'technical-events') {
            window.dispatchEvent(new CustomEvent('select-event-type', { detail: { type: 'Technical' } }));
        }

        if (filterSub) {
            window.dispatchEvent(new CustomEvent('filter-cultural-sub', { detail: { subCategory: filterSub } }));
        } else if (sectionId === 'cultural-events') {
            window.dispatchEvent(new CustomEvent('select-event-type', { detail: { type: 'Cultural' } }));
        }

        if (location.pathname === '/') {
            const target = document.getElementById(sectionId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                window.history.pushState(null, '', `#${sectionId}`);
                setActiveSection(sectionId);
            }
        } else {
            navigate(`/#${sectionId}`);
        }
    };

    // Active section detection via IntersectionObserver
    useEffect(() => {
        if (location.pathname !== '/') return;

        const sectionIds = ['home', 'about', 'technical-events', 'cultural-events', 'passes', 'sponsors', 'contact'];
        const observers = [];

        sectionIds.forEach(id => {
            const element = document.getElementById(id);
            if (!element) return;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveSection(id);
                    }
                },
                { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
            );

            observer.observe(element);
            observers.push(observer);
        });

        return () => {
            observers.forEach(obs => obs.disconnect());
        };
    }, [location.pathname]);

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-[70] transition-all duration-300 ease-in-out montserrat-light h-16 ${
                isScrolled
                    ? 'bg-[#10040D]/95 backdrop-blur-2xl border-b border-[#24BCE0]/30 shadow-[0_10px_35px_rgba(0,0,0,0.7)]'
                    : hasBgImage
                        ? 'bg-[#12040E]/80 backdrop-blur-xl border-b border-[#24BCE0]/20'
                        : 'bg-[#140610]/90 backdrop-blur-xl border-b border-[#24BCE0]/20'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex items-center justify-between h-full">
                    {/* Logo Area */}
                    <div className="flex-shrink-0 flex items-center">
                        <a
                            href="#home"
                            onClick={(e) => handleNavClick(e, 'home')}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            {config.navbar_logo ? (
                                <OptimizedImage
                                    src={config.navbar_logo}
                                    alt={config.website_name || "Kalam Logo"}
                                    preset="NAVBAR_LOGO"
                                    priority={true}
                                    width={160}
                                    height={40}
                                    className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-all duration-200"
                                />
                            ) : (
                                <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-wider bg-gradient-to-r from-[#24BCE0] via-[#D62C76] to-[#F5A623] bg-clip-text text-transparent select-none">
                                    {config.website_name || 'KALAM'} <span className="text-[#FFE6A0]">{config.event_year || '2026'}</span>
                                </span>
                            )}
                        </a>
                    </div>

                    {/* Centered Desktop Menu */}
                    <div className="hidden lg:flex flex-1 justify-center">
                        <div className="flex items-center space-x-7 xl:space-x-8">
                            {navLinks.map((link) => {
                                const isActive = activeSection === link.sectionId;
                                return (
                                    <div key={link.name} className="relative group flex items-center h-16">
                                        <a
                                            href={`#${link.sectionId}`}
                                            onClick={(e) => handleNavClick(e, link.sectionId)}
                                            className={`text-[14px] font-medium transition-all duration-200 ease-out flex items-center gap-1.5 cursor-pointer py-1 ${isActive ? 'text-[#F2D10A] font-semibold' : 'text-white/75 hover:text-white'
                                                }`}
                                        >
                                            {link.name}
                                            {(link.columns || link.dropdown) && (
                                                <ChevronDown size={12} className="opacity-60 group-hover:rotate-180 transition-transform" />
                                            )}
                                        </a>

                                        {/* Mega Menu Dropdown (2-column) for Technical Fest */}
                                        {link.columns && (
                                            <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[85vw] max-w-3xl rounded-2xl shadow-2xl bg-[#180614]/95 backdrop-blur-3xl border border-[#F5A623]/35 shadow-[0_20px_50px_rgba(0,0,0,0.6)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform -translate-y-2 group-hover:translate-y-0 overflow-hidden z-50">
                                                <div className="p-6 md:p-8 grid grid-cols-2 gap-4 md:gap-6">
                                                    {link.columns.map((column, idx) => (
                                                        <div key={idx} className="space-y-2">
                                                            <div className="flex flex-col space-y-1">
                                                                {column.links.map((subLink, sIdx) => (
                                                                    <a
                                                                        key={sIdx}
                                                                        href="#technical-events"
                                                                        onClick={(e) => handleNavClick(e, 'technical-events', subLink.code)}
                                                                        className="px-3.5 py-2 text-[14px] font-medium text-white/75 hover:text-[#F2D10A] hover:bg-white/10 rounded-lg transition-all duration-200 cursor-pointer"
                                                                    >
                                                                        {subLink.name}
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Standard Dropdown (1-column) for Cultural Fest */}
                                        {link.dropdown && (
                                            <div className="absolute top-16 left-1/2 -translate-x-1/2 w-48 rounded-2xl shadow-2xl bg-[#180614]/95 backdrop-blur-3xl border border-[#D62C76]/35 shadow-[0_20px_50px_rgba(214,44,118,0.25)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform -translate-y-2 group-hover:translate-y-0 overflow-hidden z-50">
                                                <div className="p-2 flex flex-col space-y-1">
                                                    {link.dropdown.map((subItem, idx) => (
                                                        <a
                                                            key={idx}
                                                            href="#cultural-events"
                                                            onClick={(e) => handleNavClick(e, 'cultural-events', null, subItem.code)}
                                                            className="px-4 py-2.5 text-[14px] font-medium text-white/70 hover:text-[#D62C76] hover:bg-[#D62C76]/15 rounded-xl transition-all duration-200 cursor-pointer"
                                                        >
                                                            {subItem.name}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* CTA on Desktop */}
                    <div className="hidden lg:flex items-center gap-3">
                        <a
                            href="#passes"
                            onClick={(e) => handleNavClick(e, 'passes')}
                            className="px-5 py-2 rounded-xl text-xs font-heading font-semibold text-white bg-gradient-to-r from-[#D62C76] via-[#F47721] to-[#F5A623] hover:from-[#bf2264] hover:to-[#e09418] shadow-[0_0_20px_rgba(214,44,118,0.4)] border border-[#F2D10A]/40 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                        >
                            Get Passes
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center lg:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-white/80 hover:text-white cursor-pointer"
                            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                            aria-expanded={isOpen}
                        >
                            {isOpen ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-white/90">Close</span>
                                    <X size={22} />
                                </div>
                            ) : (
                                <Menu size={22} />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Backdrop */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-[75] bg-black/60 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Mobile Menu Drawer */}
            <div
                className={`lg:hidden fixed top-16 right-0 z-[80] w-[85%] max-w-sm h-[calc(100dvh-4rem)] bg-[#140610]/98 backdrop-blur-2xl border-l border-[#D62C76]/30 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
                    }`}
            >
                <div className="flex flex-col p-6 space-y-2 overflow-y-auto h-full">
                    {navLinks.map((link) => (
                        <div key={link.name} className="border-b border-white/5 last:border-0 pb-2">
                            {(link.columns || link.dropdown) ? (
                                <div>
                                    <div className="flex items-center justify-between w-full">
                                        <a
                                            href={`#${link.sectionId}`}
                                            onClick={(e) => handleNavClick(e, link.sectionId)}
                                            className="flex-1 py-2 text-base font-medium text-white/80 cursor-pointer"
                                        >
                                            {link.name}
                                        </a>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleMobileDropdown(link.name);
                                            }}
                                            className="p-2 text-white/80 cursor-pointer"
                                        >
                                            <ChevronDown
                                                size={18}
                                                className={`transition-transform duration-300 ${activeMobileDropdown === link.name ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    {/* Mobile Dropdown */}
                                    <div
                                        className={`grid transition-all duration-300 overflow-hidden ${activeMobileDropdown === link.name
                                            ? 'grid-rows-[1fr] opacity-100'
                                            : 'grid-rows-[0fr] opacity-0'
                                            }`}
                                    >
                                        <div className="min-h-0 pl-4 flex flex-col space-y-2 pt-2 pb-3">
                                            {link.columns ? (
                                                link.columns.map((col, cIdx) => (
                                                    <div key={cIdx} className="space-y-1">
                                                        {col.links.map((subLink, sIdx) => (
                                                            <a
                                                                key={sIdx}
                                                                href="#technical-events"
                                                                className="block py-1.5 text-sm text-white/60 hover:text-[#F2D10A] transition-colors cursor-pointer"
                                                                onClick={(e) => handleNavClick(e, 'technical-events', subLink.code)}
                                                            >
                                                                {subLink.name}
                                                            </a>
                                                        ))}
                                                    </div>
                                                ))
                                            ) : (
                                                link.dropdown.map((subItem, idx) => (
                                                    <a
                                                        key={idx}
                                                        href="#cultural-events"
                                                        className="block py-1.5 text-sm text-white/60 hover:text-[#D62C76] transition-colors cursor-pointer"
                                                        onClick={(e) => handleNavClick(e, 'cultural-events', null, subItem.code)}
                                                    >
                                                        {subItem.name}
                                                    </a>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <a
                                    href={`#${link.sectionId}`}
                                    className="block py-2 text-base font-medium text-white/80 cursor-pointer"
                                    onClick={(e) => handleNavClick(e, link.sectionId)}
                                >
                                    {link.name}
                                </a>
                            )}
                        </div>
                    ))}

                    <a
                        href="#passes"
                        className="mt-6 bg-gradient-to-r from-[#D62C76] via-[#F47721] to-[#F5A623] text-white py-3 rounded-xl font-bold text-center text-sm shadow-lg shadow-[#D62C76]/30 cursor-pointer"
                        onClick={(e) => handleNavClick(e, 'passes')}
                    >
                        Get Your Pass
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
