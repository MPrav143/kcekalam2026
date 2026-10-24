require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const connectDB = require('../config/db');
const SiteConfig = require('../models/SiteConfig');

const DEFAULT_CONFIGS = [
    {
        key: 'global_bg',
        value: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
        type: 'image'
    },
    {
        key: 'events_bg',
        value: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80',
        type: 'image'
    },
    {
        key: 'cultural_events_bg',
        value: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80',
        type: 'image'
    },
    {
        key: 'highlights_bg',
        value: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1920&q=80',
        type: 'image'
    },
    {
        key: 'event_detail_bg',
        value: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=1920&q=80',
        type: 'image'
    },
    {
        key: 'register_bg',
        value: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80',
        type: 'image'
    },
    {
        key: 'admin_bg',
        value: '',
        type: 'image'
    },
    {
        key: 'footer_bg',
        value: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80',
        type: 'image'
    }
];

async function seed() {
    try {
        await connectDB();
        console.log('Connected to MongoDB');

        for (const item of DEFAULT_CONFIGS) {
            if (item.key === 'admin_bg') {
                await SiteConfig.findOneAndUpdate(
                    { key: 'admin_bg' },
                    { value: '', type: 'image' },
                    { upsert: true, new: true }
                );
                console.log(`[Cleared] admin_bg -> empty (No bg in admin panel)`);
                continue;
            }

            const existing = await SiteConfig.findOne({ key: item.key });
            if (!existing || !existing.value || existing.value.trim() === '') {
                await SiteConfig.findOneAndUpdate(
                    { key: item.key },
                    { value: item.value, type: item.type },
                    { upsert: true, new: true }
                );
                console.log(`[Seeded] ${item.key} -> ${item.value}`);
            } else {
                console.log(`[Preserved Existing] ${item.key} -> ${existing.value}`);
            }
        }


        // Fetch all configs from DB
        const allConfigs = await SiteConfig.find({});
        const configMap = {};
        allConfigs.forEach(c => {
            configMap[c.key] = c.value;
        });

        // Update public/data/global/site-config.json
        const siteConfigPath = path.resolve(__dirname, '../../public/data/global/site-config.json');
        fs.writeFileSync(siteConfigPath, JSON.stringify(configMap, null, 2), 'utf8');
        console.log(`Updated ${siteConfigPath}`);

        // Update public/data/global/theme-config.json
        const themeConfigPath = path.resolve(__dirname, '../../public/data/global/theme-config.json');
        let themeConfig = {};
        if (fs.existsSync(themeConfigPath)) {
            try {
                themeConfig = JSON.parse(fs.readFileSync(themeConfigPath, 'utf8'));
            } catch (_) {}
        }
        themeConfig.colors = themeConfig.colors || {
            kalamYellow: "#F2D10A",
            kalamGolden: "#F5A623",
            kalamOrange: "#F47721",
            kalamCoral: "#F04438",
            kalamMagenta: "#D62C76",
            kalamCyan: "#24BCE0",
            kalamBg: "#14050E"
        };
        themeConfig.backgrounds = {
            global_bg: configMap.global_bg || '',
            home_bg: configMap.home_bg || '',
            about_bg: configMap.about_bg || '',
            passes_bg: configMap.passes_bg || '',
            events_bg: configMap.events_bg || '',
            cultural_events_bg: configMap.cultural_events_bg || '',
            highlights_bg: configMap.highlights_bg || '',
            event_detail_bg: configMap.event_detail_bg || '',
            register_bg: configMap.register_bg || '',
            admin_bg: configMap.admin_bg || '',
            footer_bg: configMap.footer_bg || '',
            footer_bg_video: configMap.footer_bg_video || ''
        };
        fs.writeFileSync(themeConfigPath, JSON.stringify(themeConfig, null, 2), 'utf8');
        console.log(`Updated ${themeConfigPath}`);

        console.log('Background migration and seeding successfully completed!');
        process.exit(0);
    } catch (err) {
        console.error('Migration error:', err);
        process.exit(1);
    }
}

seed();
