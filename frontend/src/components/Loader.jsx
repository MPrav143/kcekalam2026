import { useState } from 'react';
import ParticleLoader from './ParticleLoader';

/**
 * Universal KALAM Particle Loader.
 * Automatically unmounts when the animation completes so it never blocks page interaction or scrolling.
 */
const Loader = ({ text = "KALAM 2026...", inline = false }) => {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    if (inline) {
        return (
            <div className="flex items-center justify-center py-12 gap-3 text-[#38BDF8]">
                <div className="w-6 h-6 rounded-full border-2 border-t-transparent border-[#9333EA] animate-spin" />
                <span className="text-sm font-semibold tracking-wide text-[#D8D4F0]">{text}</span>
            </div>
        );
    }

    return (
        <ParticleLoader
            isActive={visible}
            isInitial={false}
            onComplete={() => setVisible(false)}
            pageLabel={text}
        />
    );
};

export default Loader;
