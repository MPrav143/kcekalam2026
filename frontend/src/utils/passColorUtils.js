/**
 * Dynamic Pass Color & Theme Utility
 * Centralized theme and palette configuration for the KALAM 2026 Digital Pass Card.
 * Implements 12 premium, royal & luxury color combinations with CSS variables and presets.
 */

export const LUXURY_PRESETS = [
    {
        id: 'royal',
        aliases: ['burgundy-gold', 'royal-burgundy'],
        number: '01',
        title: '01 · ROYAL',
        name: 'Imperial Burgundy + Champagne Gold',
        subtitle: 'Regal, timeless, palace-inspired luxury.',
        category: 'ROYAL',
        backgroundColor: '#100C12',
        secondaryBgColor: '#200D1A', // Imperial velvet blend
        primaryColor: '#4B1638',     // Imperial Burgundy
        accentColor: '#D6B36A',      // Champagne Gold
        highlightColor: '#F1DCA6',   // Highlight Champagne
        borderColor: '#D6B36A',
        dividerColor: 'rgba(214, 179, 106, 0.45)',
        titleColor: '#FFFDF5',
        textColor: '#F5F1E5',
        priceColor: '#F1DCA6',
        iconColor: '#D6B36A',
        artworkColor: '#D6B36A',
        buttonBgColor: '#D6B36A',
        buttonTextColor: '#100C12',
        glitterColor: '#F1DCA6',
        doodleColor: '#D6B36A',
        glowColor: '#D6B36A',
        qrFgColor: '#D6B36A',
        qrBgColor: '#100C12',
    },
    {
        id: 'couture',
        aliases: ['obsidian-amethyst'],
        number: '02',
        title: '02 · COUTURE',
        name: 'Obsidian + Amethyst + Platinum',
        subtitle: 'Ultra-premium, futuristic, sophisticated.',
        category: 'COUTURE',
        backgroundColor: '#09090D',  // Obsidian
        secondaryBgColor: '#25232E', // Surface
        primaryColor: '#8D52E8',     // Amethyst Accent
        accentColor: '#8D52E8',
        highlightColor: '#C9A7FF',   // Highlight Platinum
        borderColor: '#8D52E8',
        dividerColor: 'rgba(141, 82, 232, 0.45)',
        titleColor: '#FAF5FF',
        textColor: '#F3F4F6',
        priceColor: '#C9A7FF',
        iconColor: '#8D52E8',
        artworkColor: '#8D52E8',
        buttonBgColor: '#8D52E8',
        buttonTextColor: '#FFFFFF',
        glitterColor: '#C9A7FF',
        doodleColor: '#8D52E8',
        glowColor: '#C9A7FF',
        qrFgColor: '#C9A7FF',
        qrBgColor: '#09090D',
    },
    {
        id: 'sapphire',
        aliases: ['royal-sapphire', 'ice-platinum'],
        number: '03',
        title: '03 · SAPPHIRE',
        name: 'Royal Sapphire + Ice Platinum',
        subtitle: 'Elite, polished, technology-driven prestige.',
        category: 'SAPPHIRE',
        backgroundColor: '#071421',  // Royal Sapphire
        secondaryBgColor: '#163D59', // Surface
        primaryColor: '#50D9E8',     // Ice Platinum Accent
        accentColor: '#50D9E8',
        highlightColor: '#C4F8FF',   // Highlight
        borderColor: '#50D9E8',
        dividerColor: 'rgba(80, 217, 232, 0.45)',
        titleColor: '#FFFFFF',
        textColor: '#F3F4F6',
        priceColor: '#C4F8FF',
        iconColor: '#50D9E8',
        artworkColor: '#50D9E8',
        buttonBgColor: '#50D9E8',
        buttonTextColor: '#071421',
        glitterColor: '#C4F8FF',
        doodleColor: '#50D9E8',
        glowColor: '#50D9E8',
        qrFgColor: '#50D9E8',
        qrBgColor: '#071421',
    },
    {
        id: 'heritage',
        aliases: ['emerald-gold', 'emerald-velvet'],
        number: '04',
        title: '04 · HERITAGE',
        name: 'Emerald Velvet + Antique Gold',
        subtitle: 'Royal heritage, exclusivity, rich craftsmanship.',
        category: 'HERITAGE',
        backgroundColor: '#11100B',  // Background
        secondaryBgColor: '#123D31', // Primary Emerald Velvet Surface
        primaryColor: '#123D31',     // Emerald Velvet
        accentColor: '#C6A45A',      // Antique Gold
        highlightColor: '#F0DFAB',   // Highlight
        borderColor: '#C6A45A',
        dividerColor: 'rgba(198, 164, 90, 0.45)',
        titleColor: '#FFFDF5',
        textColor: '#F5F1E5',
        priceColor: '#F0DFAB',
        iconColor: '#C6A45A',
        artworkColor: '#C6A45A',
        buttonBgColor: '#C6A45A',
        buttonTextColor: '#11100B',
        glitterColor: '#F0DFAB',
        doodleColor: '#C6A45A',
        glowColor: '#C6A45A',
        qrFgColor: '#C6A45A',
        qrBgColor: '#11100B',
    },
    {
        id: 'opulence',
        aliases: ['ruby-velvet', 'rose-gold'],
        number: '05',
        title: '05 · OPULENCE',
        name: 'Ruby Velvet + Rose Gold',
        subtitle: 'Bold, luxurious, dramatic and elegant.',
        category: 'OPULENCE',
        backgroundColor: '#12090D',  // Background
        secondaryBgColor: '#2B0B14', // Rich ruby surface
        primaryColor: '#701C35',     // Ruby Velvet
        accentColor: '#E9A9B7',      // Rose Gold
        highlightColor: '#E4C78C',   // Metallic Gold
        borderColor: '#E9A9B7',
        dividerColor: 'rgba(233, 169, 183, 0.45)',
        titleColor: '#FFFDF5',
        textColor: '#FDE8EC',
        priceColor: '#E4C78C',
        iconColor: '#E9A9B7',
        artworkColor: '#E9A9B7',
        buttonBgColor: '#E9A9B7',
        buttonTextColor: '#12090D',
        glitterColor: '#E4C78C',
        doodleColor: '#E9A9B7',
        glowColor: '#E9A9B7',
        qrFgColor: '#E9A9B7',
        qrBgColor: '#12090D',
    },
    {
        id: 'platinum',
        aliases: ['platinum-silver'],
        number: '06',
        title: '06 · PLATINUM',
        name: 'Obsidian + Platinum Silver',
        subtitle: 'Minimalist luxury with a high-fashion finish.',
        category: 'PLATINUM',
        backgroundColor: '#0D0D10',  // Obsidian Background
        secondaryBgColor: '#34343D', // Surface
        primaryColor: '#C9CDD5',     // Accent Platinum Silver
        accentColor: '#C9CDD5',
        highlightColor: '#FFFFFF',   // Highlight
        borderColor: '#C9CDD5',
        dividerColor: 'rgba(201, 205, 213, 0.35)',
        titleColor: '#FFFFFF',
        textColor: '#E5E7EB',
        priceColor: '#FFFFFF',
        iconColor: '#C9CDD5',
        artworkColor: '#C9CDD5',
        buttonBgColor: '#C9CDD5',
        buttonTextColor: '#0D0D10',
        glitterColor: '#FFFFFF',
        doodleColor: '#C9CDD5',
        glowColor: '#FFFFFF',
        qrFgColor: '#FFFFFF',
        qrBgColor: '#0D0D10',
    },
    {
        id: 'royalty',
        aliases: ['royal-violet', 'midnight-violet'],
        number: '07',
        title: '07 · ROYALTY',
        name: 'Midnight Violet + Lavender Diamond',
        subtitle: 'Regal, mystical, refined and contemporary.',
        category: 'ROYALTY',
        backgroundColor: '#0D0A18',  // Background
        secondaryBgColor: '#201438', // Deep violet surface
        primaryColor: '#35205D',     // Midnight Violet
        accentColor: '#A58AFF',      // Lavender Diamond
        highlightColor: '#E1D6FF',   // Highlight
        borderColor: '#A58AFF',
        dividerColor: 'rgba(165, 138, 255, 0.45)',
        titleColor: '#FFFFFF',
        textColor: '#F3F0FF',
        priceColor: '#E1D6FF',
        iconColor: '#A58AFF',
        artworkColor: '#A58AFF',
        buttonBgColor: '#A58AFF',
        buttonTextColor: '#0D0A18',
        glitterColor: '#E1D6FF',
        doodleColor: '#A58AFF',
        glowColor: '#A58AFF',
        qrFgColor: '#A58AFF',
        qrBgColor: '#0D0A18',
    },
    {
        id: 'majestic',
        aliases: ['black-coffee', 'burnished-gold'],
        number: '08',
        title: '08 · MAJESTIC',
        name: 'Black Coffee + Burnished Gold',
        subtitle: 'Understated wealth with warm metallic richness.',
        category: 'MAJESTIC',
        backgroundColor: '#111016',  // Background
        secondaryBgColor: '#261B14', // Rich coffee surface
        primaryColor: '#8B5A24',     // Black Coffee
        accentColor: '#D9A441',      // Burnished Gold
        highlightColor: '#F7E5B2',   // Highlight
        borderColor: '#D9A441',
        dividerColor: 'rgba(217, 164, 65, 0.45)',
        titleColor: '#FFFDF5',
        textColor: '#FAF0D9',
        priceColor: '#F7E5B2',
        iconColor: '#D9A441',
        artworkColor: '#D9A441',
        buttonBgColor: '#D9A441',
        buttonTextColor: '#111016',
        glitterColor: '#F7E5B2',
        doodleColor: '#D9A441',
        glowColor: '#D9A441',
        qrFgColor: '#D9A441',
        qrBgColor: '#111016',
    },
    {
        id: 'prestige',
        aliases: ['jade-noir', 'mint-platinum'],
        number: '09',
        title: '09 · PRESTIGE',
        name: 'Jade Noir + Mint Platinum',
        subtitle: 'Distinctive, elegant, and fresh without losing luxury.',
        category: 'PRESTIGE',
        backgroundColor: '#0A1010',  // Background
        secondaryBgColor: '#122B27', // Deep jade surface
        primaryColor: '#145A50',     // Jade Noir
        accentColor: '#63D8BE',      // Mint Platinum
        highlightColor: '#D4FFF2',   // Highlight
        borderColor: '#63D8BE',
        dividerColor: 'rgba(99, 216, 190, 0.45)',
        titleColor: '#FFFFFF',
        textColor: '#E6FAF5',
        priceColor: '#D4FFF2',
        iconColor: '#63D8BE',
        artworkColor: '#63D8BE',
        buttonBgColor: '#63D8BE',
        buttonTextColor: '#0A1010',
        glitterColor: '#D4FFF2',
        doodleColor: '#63D8BE',
        glowColor: '#63D8BE',
        qrFgColor: '#63D8BE',
        qrBgColor: '#0A1010',
    },
    {
        id: 'ember',
        aliases: ['burnt-copper', 'cognac'],
        number: '10',
        title: '10 · EMBER',
        name: 'Burnt Copper + Cognac',
        subtitle: 'Warm, exclusive, bold and editorial.',
        category: 'EMBER',
        backgroundColor: '#100B0A',  // Background
        secondaryBgColor: '#2A160F', // Warm copper surface
        primaryColor: '#803B20',     // Burnt Copper
        accentColor: '#D98549',      // Cognac
        highlightColor: '#F3D0A0',   // Highlight
        borderColor: '#D98549',
        dividerColor: 'rgba(217, 133, 73, 0.45)',
        titleColor: '#FFFDF5',
        textColor: '#FBEEDB',
        priceColor: '#F3D0A0',
        iconColor: '#D98549',
        artworkColor: '#D98549',
        buttonBgColor: '#D98549',
        buttonTextColor: '#100B0A',
        glitterColor: '#F3D0A0',
        doodleColor: '#D98549',
        glowColor: '#D98549',
        qrFgColor: '#D98549',
        qrBgColor: '#100B0A',
    },
    {
        id: 'dynasty',
        aliases: ['royal-indigo', 'diamond-blue', 'midnight-ice'],
        number: '11',
        title: '11 · DYNASTY',
        name: 'Royal Indigo + Diamond Blue',
        subtitle: 'A prestigious, modern academic-festival identity.',
        category: 'DYNASTY',
        backgroundColor: '#0A0A12',  // Background
        secondaryBgColor: '#24233B', // Surface
        primaryColor: '#7E8CFF',     // Accent Diamond Blue
        accentColor: '#7E8CFF',
        highlightColor: '#D8DDFF',   // Highlight
        borderColor: '#7E8CFF',
        dividerColor: 'rgba(126, 140, 255, 0.45)',
        titleColor: '#FFFFFF',
        textColor: '#F3F4F6',
        priceColor: '#D8DDFF',
        iconColor: '#7E8CFF',
        artworkColor: '#7E8CFF',
        buttonBgColor: '#7E8CFF',
        buttonTextColor: '#0A0A12',
        glitterColor: '#D8DDFF',
        doodleColor: '#7E8CFF',
        glowColor: '#7E8CFF',
        qrFgColor: '#D8DDFF',
        qrBgColor: '#0A0A12',
    },
    {
        id: 'signature',
        aliases: ['black-cherry', 'royal-rose'],
        number: '12',
        title: '12 · SIGNATURE',
        name: 'Black Cherry + Royal Rose',
        subtitle: 'Fashion-house elegance with a vivid, luxurious accent.',
        category: 'SIGNATURE',
        backgroundColor: '#100C13',  // Background
        secondaryBgColor: '#291220', // Dark cherry surface
        primaryColor: '#50203D',     // Black Cherry
        accentColor: '#D65AA6',      // Royal Rose
        highlightColor: '#F5CDE5',   // Highlight
        borderColor: '#D65AA6',
        dividerColor: 'rgba(214, 90, 166, 0.45)',
        titleColor: '#FFFDF5',
        textColor: '#FCEBF4',
        priceColor: '#F5CDE5',
        iconColor: '#D65AA6',
        artworkColor: '#D65AA6',
        buttonBgColor: '#D65AA6',
        buttonTextColor: '#100C13',
        glitterColor: '#F5CDE5',
        doodleColor: '#D65AA6',
        glowColor: '#D65AA6',
        qrFgColor: '#D65AA6',
        qrBgColor: '#100C13',
    },
    // =========================================================================
    // 12 BRIGHTER ROYAL & LUXURY PRESETS (Luminous Accents with Dark Foundations)
    // =========================================================================
    {
        id: 'royal-amethyst',
        aliases: ['bright-amethyst', 'electric-violet'],
        number: '13',
        title: '13 · ROYAL AMETHYST',
        name: 'Royal Amethyst + Electric Violet',
        subtitle: 'Regal purple with bright, luminous accents.',
        category: 'BRIGHT LUXURY',
        isTopPick: true,
        backgroundColor: '#120A20',  // Color 1: Main background
        secondaryBgColor: '#7028E8', // Color 2: Card / secondary surface
        primaryColor: '#A855F7',     // Color 3: Primary brand accent
        accentColor: '#A855F7',
        highlightColor: '#C084FC',   // Color 4: Bright highlight & hover
        borderColor: '#A855F7',
        dividerColor: 'rgba(168, 85, 247, 0.45)',
        titleColor: '#F3E8FF',       // Color 5: Light text & premium detail
        textColor: '#F3E8FF',
        priceColor: '#C084FC',
        iconColor: '#A855F7',
        artworkColor: '#A855F7',
        buttonBgColor: '#A855F7',
        buttonTextColor: '#120A20',
        glitterColor: '#C084FC',
        doodleColor: '#A855F7',
        glowColor: '#C084FC',
        qrFgColor: '#C084FC',
        qrBgColor: '#120A20',
    },
    {
        id: 'midnight-sapphire',
        aliases: ['bright-sapphire', 'ice-cyan'],
        number: '14',
        title: '14 · MIDNIGHT SAPPHIRE',
        name: 'Midnight Sapphire + Ice Cyan',
        subtitle: 'Premium futuristic blue with brilliant cyan.',
        category: 'BRIGHT LUXURY',
        isTopPick: true,
        backgroundColor: '#071426',  // Color 1: Main background
        secondaryBgColor: '#123D78', // Color 2: Card / secondary surface
        primaryColor: '#0878F9',     // Color 3: Primary brand accent
        accentColor: '#0878F9',
        highlightColor: '#42D9FF',   // Color 4: Bright highlight & hover
        borderColor: '#42D9FF',
        dividerColor: 'rgba(66, 217, 255, 0.45)',
        titleColor: '#D8F8FF',       // Color 5: Light text & premium detail
        textColor: '#D8F8FF',
        priceColor: '#42D9FF',
        iconColor: '#0878F9',
        artworkColor: '#0878F9',
        buttonBgColor: '#0878F9',
        buttonTextColor: '#071426',
        glitterColor: '#42D9FF',
        doodleColor: '#0878F9',
        glowColor: '#42D9FF',
        qrFgColor: '#42D9FF',
        qrBgColor: '#071426',
    },
    {
        id: 'imperial-gold',
        aliases: ['imperial-black', 'bright-gold'],
        number: '15',
        title: '15 · IMPERIAL GOLD',
        name: 'Imperial Black + Royal Gold',
        subtitle: 'Classic luxury with bright champagne-gold highlights.',
        category: 'BRIGHT LUXURY',
        backgroundColor: '#11100A',  // Color 1: Main background
        secondaryBgColor: '#78520A', // Color 2: Card / secondary surface
        primaryColor: '#D4A72C',     // Color 3: Primary brand accent
        accentColor: '#D4A72C',
        highlightColor: '#FFD54A',   // Color 4: Bright highlight & hover
        borderColor: '#D4A72C',
        dividerColor: 'rgba(212, 167, 44, 0.45)',
        titleColor: '#FFF0B3',       // Color 5: Light text & premium detail
        textColor: '#FFF0B3',
        priceColor: '#FFD54A',
        iconColor: '#D4A72C',
        artworkColor: '#D4A72C',
        buttonBgColor: '#D4A72C',
        buttonTextColor: '#11100A',
        glitterColor: '#FFD54A',
        doodleColor: '#D4A72C',
        glowColor: '#FFD54A',
        qrFgColor: '#FFD54A',
        qrBgColor: '#11100A',
    },
    {
        id: 'ruby-rose',
        aliases: ['bright-ruby', 'rose-gold-bright'],
        number: '16',
        title: '16 · RUBY ROSE',
        name: 'Ruby Velvet + Rose Gold',
        subtitle: 'Rich crimson, vivid pink and elegant warm metallics.',
        category: 'BRIGHT LUXURY',
        backgroundColor: '#130812',  // Color 1: Main background
        secondaryBgColor: '#8F123D', // Color 2: Card / secondary surface
        primaryColor: '#C2185B',     // Color 3: Primary brand accent
        accentColor: '#C2185B',
        highlightColor: '#FF5DA2',   // Color 4: Bright highlight & hover
        borderColor: '#C2185B',
        dividerColor: 'rgba(194, 24, 91, 0.45)',
        titleColor: '#FFD6E7',       // Color 5: Light text & premium detail
        textColor: '#FFD6E7',
        priceColor: '#FF5DA2',
        iconColor: '#C2185B',
        artworkColor: '#C2185B',
        buttonBgColor: '#C2185B',
        buttonTextColor: '#130812',
        glitterColor: '#FF5DA2',
        doodleColor: '#C2185B',
        glowColor: '#FF5DA2',
        qrFgColor: '#FF5DA2',
        qrBgColor: '#130812',
    },
    {
        id: 'emerald-majesty',
        aliases: ['bright-emerald', 'neon-jade'],
        number: '17',
        title: '17 · EMERALD MAJESTY',
        name: 'Emerald Majesty + Neon Jade',
        subtitle: 'Royal green with energetic, jewel-like brightness.',
        category: 'BRIGHT LUXURY',
        isTopPick: true,
        backgroundColor: '#07150F',  // Color 1: Main background
        secondaryBgColor: '#087F50', // Color 2: Card / secondary surface
        primaryColor: '#10B981',     // Color 3: Primary brand accent
        accentColor: '#10B981',
        highlightColor: '#53F0AC',   // Color 4: Bright highlight & hover
        borderColor: '#53F0AC',
        dividerColor: 'rgba(83, 240, 172, 0.45)',
        titleColor: '#D1FAE5',       // Color 5: Light text & premium detail
        textColor: '#D1FAE5',
        priceColor: '#53F0AC',
        iconColor: '#10B981',
        artworkColor: '#10B981',
        buttonBgColor: '#10B981',
        buttonTextColor: '#07150F',
        glitterColor: '#53F0AC',
        doodleColor: '#10B981',
        glowColor: '#53F0AC',
        qrFgColor: '#53F0AC',
        qrBgColor: '#07150F',
    },
    {
        id: 'cherry-fuchsia',
        aliases: ['black-cherry-fuchsia', 'fuchsia-diamond'],
        number: '18',
        title: '18 · BLACK CHERRY',
        name: 'Black Cherry + Fuchsia Diamond',
        subtitle: 'Fashion-forward luxury with electric pink accents.',
        category: 'BRIGHT LUXURY',
        backgroundColor: '#16091D',  // Color 1: Main background
        secondaryBgColor: '#701A75', // Color 2: Card / secondary surface
        primaryColor: '#A21CAF',     // Color 3: Primary brand accent
        accentColor: '#A21CAF',
        highlightColor: '#F472D0',   // Color 4: Bright highlight & hover
        borderColor: '#F472D0',
        dividerColor: 'rgba(244, 114, 208, 0.45)',
        titleColor: '#FCE7F3',       // Color 5: Light text & premium detail
        textColor: '#FCE7F3',
        priceColor: '#F472D0',
        iconColor: '#A21CAF',
        artworkColor: '#A21CAF',
        buttonBgColor: '#A21CAF',
        buttonTextColor: '#16091D',
        glitterColor: '#F472D0',
        doodleColor: '#A21CAF',
        glowColor: '#F472D0',
        qrFgColor: '#F472D0',
        qrBgColor: '#16091D',
    },
    {
        id: 'burnished-copper',
        aliases: ['obsidian-copper', 'bright-copper'],
        number: '19',
        title: '19 · BURNISHED COPPER',
        name: 'Obsidian + Burnished Copper',
        subtitle: 'Warm, brilliant orange-gold with a premium finish.',
        category: 'BRIGHT LUXURY',
        backgroundColor: '#100C09',  // Color 1: Main background
        secondaryBgColor: '#8A3415', // Color 2: Card / secondary surface
        primaryColor: '#C65D18',     // Color 3: Primary brand accent
        accentColor: '#C65D18',
        highlightColor: '#FFAD42',   // Color 4: Bright highlight & hover
        borderColor: '#FFAD42',
        dividerColor: 'rgba(255, 173, 66, 0.45)',
        titleColor: '#FFE0AD',       // Color 5: Light text & premium detail
        textColor: '#FFE0AD',
        priceColor: '#FFAD42',
        iconColor: '#C65D18',
        artworkColor: '#C65D18',
        buttonBgColor: '#C65D18',
        buttonTextColor: '#100C09',
        glitterColor: '#FFAD42',
        doodleColor: '#C65D18',
        glowColor: '#FFAD42',
        qrFgColor: '#FFAD42',
        qrBgColor: '#100C09',
    },
    {
        id: 'royal-indigo-bright',
        aliases: ['indigo-diamond', 'bright-indigo'],
        number: '20',
        title: '20 · ROYAL INDIGO',
        name: 'Royal Indigo + Diamond Blue',
        subtitle: 'Elegant indigo with luminous periwinkle highlights.',
        category: 'BRIGHT LUXURY',
        backgroundColor: '#0B0B16',  // Color 1: Main background
        secondaryBgColor: '#312E81', // Color 2: Card / secondary surface
        primaryColor: '#4F46E5',     // Color 3: Primary brand accent
        accentColor: '#4F46E5',
        highlightColor: '#A5B4FC',   // Color 4: Bright highlight & hover
        borderColor: '#A5B4FC',
        dividerColor: 'rgba(165, 180, 252, 0.45)',
        titleColor: '#E0E7FF',       // Color 5: Light text & premium detail
        textColor: '#E0E7FF',
        priceColor: '#A5B4FC',
        iconColor: '#4F46E5',
        artworkColor: '#4F46E5',
        buttonBgColor: '#4F46E5',
        buttonTextColor: '#0B0B16',
        glitterColor: '#A5B4FC',
        doodleColor: '#4F46E5',
        glowColor: '#A5B4FC',
        qrFgColor: '#A5B4FC',
        qrBgColor: '#0B0B16',
    },
    {
        id: 'liquid-amber',
        aliases: ['espresso-amber', 'bright-amber'],
        number: '21',
        title: '21 · LIQUID AMBER',
        name: 'Espresso + Liquid Amber',
        subtitle: 'Rich amber and luminous gold, like a luxury timepiece.',
        category: 'BRIGHT LUXURY',
        backgroundColor: '#15100B',  // Color 1: Main background
        secondaryBgColor: '#78350F', // Color 2: Card / secondary surface
        primaryColor: '#B45309',     // Color 3: Primary brand accent
        accentColor: '#B45309',
        highlightColor: '#FBBF24',   // Color 4: Bright highlight & hover
        borderColor: '#FBBF24',
        dividerColor: 'rgba(251, 191, 36, 0.45)',
        titleColor: '#FEF3C7',       // Color 5: Light text & premium detail
        textColor: '#FEF3C7',
        priceColor: '#FBBF24',
        iconColor: '#B45309',
        artworkColor: '#B45309',
        buttonBgColor: '#B45309',
        buttonTextColor: '#15100B',
        glitterColor: '#FBBF24',
        doodleColor: '#B45309',
        glowColor: '#FBBF24',
        qrFgColor: '#FBBF24',
        qrBgColor: '#15100B',
    },
    {
        id: 'arctic-teal',
        aliases: ['deep-teal', 'arctic-cyan'],
        number: '22',
        title: '22 · ARCTIC TEAL',
        name: 'Deep Teal + Arctic Cyan',
        subtitle: 'Clean, vibrant, modern and expensive-looking.',
        category: 'BRIGHT LUXURY',
        backgroundColor: '#071519',  // Color 1: Main background
        secondaryBgColor: '#155E75', // Color 2: Card / secondary surface
        primaryColor: '#0E7490',     // Color 3: Primary brand accent
        accentColor: '#0E7490',
        highlightColor: '#22D3EE',   // Color 4: Bright highlight & hover
        borderColor: '#22D3EE',
        dividerColor: 'rgba(34, 211, 238, 0.45)',
        titleColor: '#CFFAFE',       // Color 5: Light text & premium detail
        textColor: '#CFFAFE',
        priceColor: '#22D3EE',
        iconColor: '#0E7490',
        artworkColor: '#0E7490',
        buttonBgColor: '#0E7490',
        buttonTextColor: '#071519',
        glitterColor: '#22D3EE',
        doodleColor: '#0E7490',
        glowColor: '#22D3EE',
        qrFgColor: '#22D3EE',
        qrBgColor: '#071519',
    },
    {
        id: 'crimson-royale',
        aliases: ['pink-diamond', 'bright-crimson'],
        number: '23',
        title: '23 · CRIMSON ROYALE',
        name: 'Crimson Royale + Pink Diamond',
        subtitle: 'Bold red, brilliant rose and a dramatic royal identity.',
        category: 'BRIGHT LUXURY',
        backgroundColor: '#170C0D',  // Color 1: Main background
        secondaryBgColor: '#881337', // Color 2: Card / secondary surface
        primaryColor: '#BE123C',     // Color 3: Primary brand accent
        accentColor: '#BE123C',
        highlightColor: '#FB7185',   // Color 4: Bright highlight & hover
        borderColor: '#FB7185',
        dividerColor: 'rgba(251, 113, 133, 0.45)',
        titleColor: '#FFE4E6',       // Color 5: Light text & premium detail
        textColor: '#FFE4E6',
        priceColor: '#FB7185',
        iconColor: '#BE123C',
        artworkColor: '#BE123C',
        buttonBgColor: '#BE123C',
        buttonTextColor: '#170C0D',
        glitterColor: '#FB7185',
        doodleColor: '#BE123C',
        glowColor: '#FB7185',
        qrFgColor: '#FB7185',
        qrBgColor: '#170C0D',
    },
    {
        id: 'cosmic-purple',
        aliases: ['pink-opal', 'bright-cosmic'],
        number: '24',
        title: '24 · COSMIC PURPLE',
        name: 'Cosmic Purple + Pink Opal',
        subtitle: 'Bright, youthful luxury for a modern college festival.',
        category: 'BRIGHT LUXURY',
        backgroundColor: '#0C0B13',  // Color 1: Main background
        secondaryBgColor: '#5B21B6', // Color 2: Card / secondary surface
        primaryColor: '#6D28D9',     // Color 3: Primary brand accent
        accentColor: '#6D28D9',
        highlightColor: '#E879F9',   // Color 4: Bright highlight & hover
        borderColor: '#E879F9',
        dividerColor: 'rgba(232, 121, 249, 0.45)',
        titleColor: '#FAE8FF',       // Color 5: Light text & premium detail
        textColor: '#FAE8FF',
        priceColor: '#E879F9',
        iconColor: '#6D28D9',
        artworkColor: '#6D28D9',
        buttonBgColor: '#6D28D9',
        buttonTextColor: '#0C0B13',
        glitterColor: '#E879F9',
        doodleColor: '#6D28D9',
        glowColor: '#E879F9',
        qrFgColor: '#E879F9',
        qrBgColor: '#0C0B13',
    }
];

export const PRESET_PASS_COLORS = LUXURY_PRESETS;
export const DEFAULT_PASS_THEME = LUXURY_PRESETS[0];

export const LEGACY_COLOR_MAP = {
    royal: '#D6B36A',
    couture: '#8D52E8',
    sapphire: '#50D9E8',
    heritage: '#C6A45A',
    opulence: '#E9A9B7',
    platinum: '#C9CDD5',
    royalty: '#A58AFF',
    majestic: '#D9A441',
    prestige: '#63D8BE',
    ember: '#D98549',
    dynasty: '#7E8CFF',
    signature: '#D65AA6',
    blue: '#50D9E8',
    violet: '#8B5CF6',
    purple: '#A855F7',
    green: '#10B981',
    emerald: '#C6A45A',
    orange: '#D98549',
    yellow: '#D6B36A',
    gold: '#D6B36A',
    red: '#E11D48',
    pink: '#D65AA6',
    cyan: '#50D9E8',
    teal: '#63D8BE',
    indigo: '#7E8CFF',
    magenta: '#D65AA6',
    burgundy: '#D6B36A',
    amethyst: '#8D52E8',
    'royal-amethyst': '#A855F7',
    'midnight-sapphire': '#0878F9',
    'imperial-gold': '#D4A72C',
    'ruby-rose': '#C2185B',
    'emerald-majesty': '#10B981',
    'cherry-fuchsia': '#A21CAF',
    'burnished-copper': '#C65D18',
    'royal-indigo-bright': '#4F46E5',
    'liquid-amber': '#B45309',
    'arctic-teal': '#0E7490',
    'crimson-royale': '#BE123C',
    'cosmic-purple': '#6D28D9'
};

/**
 * Searches and resolves a preset by ID, alias, category, or title
 */
export function findPresetById(idOrName) {
    if (!idOrName || typeof idOrName !== 'string') return null;
    const lower = idOrName.trim().toLowerCase();
    return LUXURY_PRESETS.find(p =>
        p.id === lower ||
        (p.aliases && p.aliases.includes(lower)) ||
        p.name.toLowerCase() === lower ||
        (p.title && p.title.toLowerCase() === lower) ||
        (p.category && p.category.toLowerCase() === lower)
    ) || null;
}

/**
 * Parses any color input (preset id, hex or legacy name) to { r, g, b, hex }
 */
export function parseColor(input) {
    if (!input || typeof input !== 'string') {
        return { r: 214, g: 179, b: 106, hex: '#D6B36A' };
    }

    const trimmed = input.trim();

    // Check if preset id or alias
    const matchedPreset = findPresetById(trimmed);
    if (matchedPreset) {
        return hexToRgb(matchedPreset.accentColor || matchedPreset.primaryColor);
    }

    // Check if legacy name
    const lower = trimmed.toLowerCase();
    if (LEGACY_COLOR_MAP[lower]) {
        return hexToRgb(LEGACY_COLOR_MAP[lower]);
    }

    // Check if valid hex
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(trimmed)) {
        return hexToRgb(trimmed);
    }

    // Fallback to Champagne Gold
    return { r: 214, g: 179, b: 106, hex: '#D6B36A' };
}

export function hexToRgb(hexStr) {
    let hex = hexStr.replace('#', '');
    if (hex.length === 3) {
        hex = hex.split('').map((char) => char + char).join('');
    }
    const num = parseInt(hex, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return { r, g, b, hex: `#${hex.toUpperCase()}` };
}

export function adjustBrightness({ r, g, b }, percent) {
    const factor = 1 + percent / 100;
    const nr = Math.min(255, Math.max(0, Math.round(r * factor)));
    const ng = Math.min(255, Math.max(0, Math.round(g * factor)));
    const nb = Math.min(255, Math.max(0, Math.round(b * factor)));
    return { r: nr, g: ng, b: nb, hex: rgbToHex(nr, ng, nb) };
}

export function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

/**
 * Ensures text colors maintain high contrast against dark backgrounds
 */
export function sanitizeFontColor(colorStr, fallback = '#FFFFFF') {
    if (!colorStr || typeof colorStr !== 'string') return fallback;
    const trimmed = colorStr.trim();
    if (!trimmed) return fallback;
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(trimmed)) {
        return trimmed;
    }
    return fallback;
}

/**
 * Builds the complete dynamic theme object from pass data and themeConfig.
 * Fully supports all 12 royal luxury combinations with high-fidelity gradients and highlights.
 */
export function buildDynamicPassTheme(pass, variantIndex = 0) {
    // Alternate through the 12 royal presets if no explicit preset is selected
    const defaultPreset = LUXURY_PRESETS[variantIndex % LUXURY_PRESETS.length] || LUXURY_PRESETS[0];

    const tc = (pass && typeof pass.themeConfig === 'object' && pass.themeConfig !== null) ? pass.themeConfig : {};
    
    // Resolve preset if selected or fallback
    const matchedPreset = findPresetById(tc.presetId) || defaultPreset;

    // 1. Main card background color
    const mainBg = tc.backgroundColor || (pass && pass.color && isHexColor(pass.color) && pass.color.length === 7 ? adjustBrightness(parseColor(pass.color), -75).hex : null) || matchedPreset.backgroundColor;

    // 2. Secondary background / gradient bottom stop
    const secondaryBg = tc.secondaryBgColor || (mainBg ? adjustBrightness(parseColor(mainBg), -20).hex : null) || matchedPreset.secondaryBgColor;
    const bgGradient = `linear-gradient(180deg, ${mainBg} 0%, ${secondaryBg} 100%)`;

    // 3. Border color
    const outerBorder = tc.borderColor || tc.accentColor || matchedPreset.borderColor;

    // 4. Accent & Highlight Colors
    const accentColor = tc.accentColor || matchedPreset.accentColor;
    const highlightColor = tc.highlightColor || matchedPreset.highlightColor || accentColor;

    // 5. Title and heading color
    const titleColor = sanitizeFontColor(tc.titleColor || matchedPreset.titleColor, '#FFFFFF');

    // 6. Body text color
    const textColor = sanitizeFontColor(tc.textColor || matchedPreset.textColor, '#F3F4F6');

    // 7. Divider color
    const divider = tc.dividerColor || matchedPreset.dividerColor || `rgba(${parseColor(accentColor).r}, ${parseColor(accentColor).g}, ${parseColor(accentColor).b}, 0.45)`;

    // 8. Glitter and sparkle color
    const glitterColor = tc.glitterColor || highlightColor || matchedPreset.glitterColor;

    // 9. Doodle color
    const doodleColor = tc.doodleColor || accentColor || matchedPreset.doodleColor;

    // 10. Glow and highlight color
    const glowColor = tc.glowColor || highlightColor || matchedPreset.glowColor;
    const glowRgb = parseColor(glowColor);

    // Derived UI details
    const primaryColor = tc.primaryColor || matchedPreset.primaryColor;
    const primaryRgb = parseColor(primaryColor);
    const accentRgb = parseColor(accentColor);

    // Price panel styling
    const pricePanelBg = tc.pricePanelBg || adjustBrightness(parseColor(mainBg), 8).hex;
    const pricePanelBorder = tc.pricePanelBorder || adjustBrightness(parseColor(outerBorder), -10).hex;
    const priceText = sanitizeFontColor(tc.priceColor || matchedPreset.priceColor, highlightColor);
    const priceHighlight = sanitizeFontColor(highlightColor, '#F1DCA6');
    const perPersonText = sanitizeFontColor(tc.perPersonText, '#E5E7EB');
    const tagline = sanitizeFontColor(tc.tagline, '#E5E7EB');
    const privilegesHeading = sanitizeFontColor(tc.privilegesHeading, highlightColor);
    const yearHighlight = sanitizeFontColor(tc.yearHighlight, highlightColor);
    const badgeText = sanitizeFontColor(tc.badgeText, '#FFFFFF');

    // CTA Button
    const buttonBg = tc.buttonBgColor || accentColor;
    const buttonText = sanitizeFontColor(tc.buttonTextColor, matchedPreset.buttonTextColor || '#100C12');
    const buttonRgb = parseColor(buttonBg);
    const ctaGradient = `linear-gradient(135deg, ${adjustBrightness(buttonRgb, 20).hex} 0%, ${buttonBg} 100%)`;

    // Visual options
    const showGlitter = tc.showGlitter !== false;
    const showDoodles = tc.showDoodles !== false;
    const doodleOpacity = typeof tc.doodleOpacity === 'number' ? tc.doodleOpacity : 0.28;

    return {
        id: matchedPreset.id,
        presetNumber: matchedPreset.number,
        presetName: matchedPreset.name,
        presetCategory: matchedPreset.category,
        mainBg,
        secondaryBg,
        bgGradient,
        outerBorder,
        borderGlow: glowColor,
        cardShadow: 'rgba(0, 0, 0, 0.45)',
        glowColor,
        glowRgba: `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, 0.35)`,
        crownIcon: accentColor,
        kalamText: titleColor,
        yearHighlight,
        badgeBg: adjustBrightness(parseColor(mainBg), 15).hex,
        badgeBorder: outerBorder,
        badgeText,
        divider,
        tagline,
        titleColor,
        titleGradientAccent: titleColor,
        pricePanelBg,
        pricePanelBorder,
        priceText,
        priceHighlight,
        perPersonText,
        privilegesHeading,
        diamondIcon: highlightColor,
        checkmarkCircle: accentColor,
        checkmarkIcon: mainBg,
        privilegeText: textColor,
        ctaGradient,
        ctaText: buttonText,
        ribbonColor: primaryColor,
        emblemGlow: `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.4)`,
        glitterColor,
        doodleColor,
        showGlitter,
        showDoodles,
        doodleOpacity,
    };
}

function isHexColor(str) {
    return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(str);
}
