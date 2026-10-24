import { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Facebook, Youtube as YoutubeIcon, Instagram, Linkedin } from 'lucide-react';
import MarqueePkg from 'react-fast-marquee';
import { useLocation } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';
import { useGlobalConfig } from '../context/GlobalConfigContext';
import OptimizedImage from './OptimizedImage';
import { useHasPageBackground } from './PageBackground';

import SectionBackground from './SectionBackground';

const Marquee = MarqueePkg.default || MarqueePkg;

const Footer = () => {
    const hasBgImage = useHasPageBackground();
    const { config, sponsors, clubs } = useGlobalConfig();
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [hoveredSocial, setHoveredSocial] = useState(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const footerBg = (isMobile && config.footer_bg_video_mobile) ? config.footer_bg_video_mobile : config.footer_bg_video;
    const phoneNumbers = config.contact_phones
        ? config.contact_phones.split(',').map(p => p.trim())
        : [config.contact_phone || '+91 12345 67890'];

    return (
        <footer className="relative text-white border-t border-[#D62C76]/25 overflow-hidden bg-gradient-to-b from-[#140610] via-[#081820] to-[#16050e]">
            {/* Independently Configured Footer Background */}
            <SectionBackground
                bgKey="footer_bg_video"
                fallbackKey="footer_bg"
                config={config}
                fallbackGradient="bg-gradient-to-b from-[#140610] via-[#081820] to-[#16050e]"
                overlayOpacity=""
            />

            <div className="relative z-10">
                {/* Sponsors Section */}
                {sponsors.length > 0 && (
                    <section id="sponsors" className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8 sm:py-10">

                        <h3 className="text-xl md:text-2xl font-bold text-center mb-5 sm:mb-6">
                            Our Sponsors
                        </h3>

                        <div className="space-y-6 sm:space-y-8">

                            {["Title", "Platinum", "Gold", "Silver", "Associate"].map((tier) => {

                                const tieredSponsors = sponsors.filter(
                                    (s) => s.tier === tier || (tier === "Silver" && !s.tier)
                                )

                                if (tieredSponsors.length === 0) return null

                                return (
                                    <div key={tier} className="flex flex-col items-center">

                                        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8">

                                            {tieredSponsors.map((s) => (
                                                <div key={s._id} className="group flex flex-col items-center">

                                                    <div className="
                    relative
                    w-16 h-16
                    sm:w-20 sm:h-20
                    md:w-24 md:h-24
                    lg:w-28 lg:h-28
                    flex items-center justify-center
                    bg-[#180715]/70
                    rounded-xl
                    p-2 sm:p-2.5
                    border border-[#D62C76]/20
                    shadow-md
                    backdrop-blur-sm
                    transition-all duration-300
                    group-hover:border-[#24BCE0]/50
                    group-hover:shadow-[0_0_20px_rgba(36,188,224,0.25)]
                  ">

                                                        {s.logo && /\.(mp4|webm|ogg)$/i.test(s.logo) ? (
                                                            <video
                                                                src={getImageUrl(s.logo)}
                                                                autoPlay
                                                                loop
                                                                muted
                                                                playsInline
                                                                className="
                          w-full h-full object-contain
                          opacity-80
                          transition-all duration-300
                          group-hover:opacity-100
                          group-hover:scale-105
                        "
                                                            />
                                                        ) : (
                                                            <OptimizedImage
                                                                src={s.logo}
                                                                alt={s.name}
                                                                preset="SPONSOR_LOGO"
                                                                width={112}
                                                                height={112}
                                                                className="
                          w-full h-full object-contain
                          opacity-80
                          transition-all duration-300
                          group-hover:opacity-100
                          group-hover:scale-105
                        "
                                                            />
                                                        )}

                                                    </div>

                                                    <div className="text-center mt-1.5">
                                                        <p className="text-[10px] md:text-[11px] font-semibold text-white/90 uppercase tracking-wide">
                                                            {s.name}
                                                        </p>
                                                    </div>

                                                </div>
                                            ))}

                                        </div>

                                    </div>
                                )
                            })}

                        </div>
                    </section>
                )}
                {/* Club Logos Marquee */}
                {clubs.length > 0 && (
                    <section className={`py-6 sm:py-8 ${hasBgImage ? 'bg-transparent' : 'bg-[#0e040c]/90'} border-y border-[#D62C76]/20`}>
                        <h3 className="text-xl sm:text-2xl font-bold text-center mb-6">Our Clubs</h3>
                        <Marquee gradient={false} speed={40}>
                            {clubs.map(club => (
                                <div key={club._id} className="mx-2 md:mx-3 w-24 md:w-32 flex items-center justify-center hover:grayscale-0 transition-all opacity-100 hover:opacity-100">
                                    <OptimizedImage
                                        src={club.logo}
                                        alt={club.name}
                                        preset="SPONSOR_LOGO"
                                        width={128}
                                        height={60}
                                        className="h-10 md:h-12 w-full object-contain"
                                    />
                                </div>
                            ))}
                        </Marquee>
                    </section>
                )}

                {/* Main Footer Links & Info Section (with Background Media) */}
                <div id="contact" className={`w-full max-w-full relative ${(sponsors.length > 0 || clubs.length > 0) ? 'border-t border-[#D62C76]/20' : ''} pt-6 sm:pt-10 pb-6 overflow-hidden ${footerBg ? 'bg-transparent' : 'bg-gradient-to-b from-[#140610]/95 via-[#081820]/95 to-[#16050e]/95'}`}>
                    {/* Background Media */}
                    {footerBg ? (
                        <div className="absolute inset-0 z-0">
                            {/\.(mp4|webm|ogg)$/i.test(footerBg) ? (
                                <video
                                    key={footerBg} // Force rerender on source change
                                    src={getImageUrl(footerBg)}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <OptimizedImage
                                    src={footerBg}
                                    alt="Footer Background"
                                    preset="PAGE_BG"
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                    ) : (
                        <div className="absolute inset-0 bg-[#140610]/40 z-0" />
                    )}

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-8 mb-6 sm:mb-8">
                        <div className="col-span-1">
                            <h2 className="text-lg sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F2D10A] via-[#F47721] to-[#D62C76] mb-2 sm:mb-3">
                                {config.website_name || 'KALAM'} {config.event_year || '2026'}
                            </h2>
                            <p className="text-xs sm:text-sm text-[#D8D4F0]/80 leading-relaxed">
                                The ultimate technical, cultural, and science festival celebrating talent, innovation, and spirit.
                            </p>
                        </div>

                        <div className="col-span-1">
                            <h3 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">Quick Links</h3>
                            <ul className="space-y-1.5 text-xs sm:text-sm text-[#D8D4F0]/80">
                                <li><a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#F5A623] transition-colors cursor-pointer">About</a></li>
                                <li><a href="#technical-events" onClick={(e) => { e.preventDefault(); document.getElementById('technical-events')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#F5A623] transition-colors cursor-pointer">Technical Fest</a></li>
                                <li><a href="#cultural-events" onClick={(e) => { e.preventDefault(); document.getElementById('cultural-events')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#F5A623] transition-colors cursor-pointer">Cultural Fest</a></li>
                                <li><a href="#passes" onClick={(e) => { e.preventDefault(); document.getElementById('passes')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#F5A623] transition-colors cursor-pointer">Get Passes</a></li>
                                {/* <li><a href="#sponsors" onClick={(e) => { e.preventDefault(); document.getElementById('sponsors')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#F5A623] transition-colors cursor-pointer">Sponsors</a></li>
                            <li><a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#F5A623] transition-colors cursor-pointer">Contact Us</a></li>
                         */}
                            </ul>
                        </div>

                        <div className="col-span-1">
                            <h3 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">Contact Us</h3>
                            <ul className="space-y-2 text-xs sm:text-sm text-[#D8D4F0]/80">
                                <li className="flex items-start gap-2">
                                    <MapPin size={15} className="text-[#F5A623] mt-0.5 shrink-0" />
                                    <span>{config.contact_address || 'College Campus, India'}</span>
                                </li>
                                {phoneNumbers.map((phone, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                        <Phone size={15} className="text-[#F5A623] shrink-0" />
                                        <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-[#F5A623] transition-colors">{phone}</a>
                                    </li>
                                ))}
                                <li className="flex items-center gap-2">
                                    <Mail size={15} className="text-[#F5A623] shrink-0" />
                                    <a href={`mailto:${config.contact_email || 'kcekalam2026@gmail.com'}`} className="hover:text-[#F5A623] transition-colors break-all">{config.contact_email || 'kce.kalamcontact@gmail.com'}</a>
                                </li>
                            </ul>
                        </div>

                        <div className="col-span-1">
                            {/* Scoped CSS for native instant hardware-accelerated brand hover states */}
                            <style>{`
                                .social-link-facebook:hover .social-badge-facebook {
                                    background: #1877F2 !important;
                                    border-color: #1877F2 !important;
                                    box-shadow: 0 0 16px rgba(24, 119, 242, 0.6) !important;
                                    transform: scale(1.12);
                                    color: #ffffff !important;
                                }
                                .social-link-facebook:hover .social-text-facebook {
                                    color: #1877F2 !important;
                                }

                                .social-link-youtube:hover .social-badge-youtube {
                                    background: #FF0000 !important;
                                    border-color: #FF0000 !important;
                                    box-shadow: 0 0 16px rgba(255, 0, 0, 0.6) !important;
                                    transform: scale(1.12);
                                    color: #ffffff !important;
                                }
                                .social-link-youtube:hover .social-text-youtube {
                                    color: #FF0000 !important;
                                }

                                .social-link-instagram:hover .social-badge-instagram {
                                    background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%) !important;
                                    border-color: #dc2743 !important;
                                    box-shadow: 0 0 16px rgba(220, 39, 67, 0.6) !important;
                                    transform: scale(1.12);
                                    color: #ffffff !important;
                                }
                                .social-link-instagram:hover .social-text-instagram {
                                    color: #E4405F !important;
                                }

                                .social-link-linkedin:hover .social-badge-linkedin {
                                    background: #0A66C2 !important;
                                    border-color: #0A66C2 !important;
                                    box-shadow: 0 0 16px rgba(10, 102, 194, 0.6) !important;
                                    transform: scale(1.12);
                                    color: #ffffff !important;
                                }
                                .social-link-linkedin:hover .social-text-linkedin {
                                    color: #0A66C2 !important;
                                }
                            `}</style>

                            <h3 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">Follow Us</h3>
                            <div className="flex flex-col gap-2.5">
                                {[
                                    {
                                        id: 'facebook',
                                        Icon: Facebook,
                                        label: 'Facebook',
                                        href: config.facebook_url || 'https://www.facebook.com/share/1ERFLsRYj7/',
                                        brandColor: '#1877F2',
                                        bg: '#1877F2',
                                        glow: '0 0 16px rgba(24, 119, 242, 0.6)'
                                    },
                                    {
                                        id: 'youtube',
                                        Icon: YoutubeIcon,
                                        label: 'Youtube',
                                        href: config.youtube_url || 'https://www.youtube.com/@wekceians?si=2UClrWxuRShi8Xoy',
                                        brandColor: '#FF0000',
                                        bg: '#FF0000',
                                        glow: '0 0 16px rgba(255, 0, 0, 0.6)'
                                    },
                                    {
                                        id: 'instagram',
                                        Icon: Instagram,
                                        label: 'Instagram',
                                        href: config.instagram_url || 'https://www.instagram.com/kcekalam/',
                                        brandColor: '#E4405F',
                                        gradient: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                                        glow: '0 0 16px rgba(220, 39, 67, 0.6)'
                                    },
                                    {
                                        id: 'linkedin',
                                        Icon: Linkedin,
                                        label: 'LinkedIn',
                                        href: config.linkedin_url || 'https://www.linkedin.com/school/wekceians/',
                                        brandColor: '#0A66C2',
                                        bg: '#0A66C2',
                                        glow: '0 0 16px rgba(10, 102, 194, 0.6)'
                                    }
                                ].map((social, i) => {
                                    const isHovered = hoveredSocial === i;
                                    return (
                                        <a
                                            key={i}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onMouseEnter={() => setHoveredSocial(i)}
                                            onMouseLeave={() => setHoveredSocial(null)}
                                            className={`social-link-${social.id} flex items-center gap-2.5 text-xs sm:text-sm transition-colors duration-200 cursor-pointer`}
                                            style={{
                                                color: isHovered ? social.brandColor : 'rgba(216, 212, 240, 0.8)'
                                            }}
                                        >
                                            <div
                                                className={`social-badge-${social.id} w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300`}
                                                style={{
                                                    background: isHovered
                                                        ? (social.gradient || social.bg)
                                                        : 'rgba(245, 166, 35, 0.1)',
                                                    border: isHovered
                                                        ? `1px solid ${social.brandColor}`
                                                        : '1px solid rgba(245, 166, 35, 0.2)',
                                                    color: isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.9)',
                                                    boxShadow: isHovered ? social.glow : 'none',
                                                    transform: isHovered ? 'scale(1.12)' : 'scale(1)'
                                                }}
                                            >
                                                <social.Icon size={14} />
                                            </div>
                                            <span
                                                className={`social-text-${social.id} transition-colors duration-200 font-medium`}
                                                style={{
                                                    color: isHovered ? social.brandColor : undefined
                                                }}
                                            >
                                                {social.label}
                                            </span>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="col-span-2 lg:col-span-1">
                            <h3 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">Location</h3>
                            <div className="w-full h-32 sm:h-36 rounded-lg overflow-hidden border border-[#F5A623]/30 shadow-md">
                                <iframe
                                    src="https://maps.google.com/maps?q=Karpagam%20College%20of%20Engineering&t=&z=13&ie=UTF8&iwloc=&output=embed"
                                    className="w-full h-full"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    title="Karpagam College of Engineering Location"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 border-t border-[#D62C76]/15 pt-4 text-center text-xs text-gray-400">
                        <p>&copy; {config.event_year || '2026'} {config.website_name || 'Kalam'} Team. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
