const express = require('express');
const router = express.Router();
const Sponsor = require('../models/Sponsor');
const Club = require('../models/Club');
const PastEvent = require('../models/PastEvent');
const SiteConfig = require('../models/SiteConfig');
const Department = require('../models/Department');
const CulturalSubcategory = require('../models/CulturalSubcategory');
const { protect, admin } = require('../middlewares/authMiddleware');

// --- CONSOLIDATED BOOTSTRAP (High Performance Single Roundtrip for Frontend Hydration) ---
router.get('/bootstrap', async (req, res) => {
    try {
        const [configs, sponsors, clubs, depts, culturals] = await Promise.all([
            SiteConfig.find({}).lean(),
            Sponsor.find({}).lean(),
            Club.find({}).lean(),
            Department.find({}).sort({ order: 1, code: 1 }).lean(),
            CulturalSubcategory.find({}).sort({ order: 1, name: 1 }).lean(),
        ]);

        const configMap = {};
        configs.forEach(conf => {
            configMap[conf.key] = conf.value;
        });

        // Set Edge & Browser Caching Headers (Fresh for 2m, Stale-while-revalidate for 10m)
        res.set('Cache-Control', 'public, max-age=120, s-maxage=300, stale-while-revalidate=600');

        res.json({
            config: configMap,
            sponsors,
            clubs,
            departments: depts,
            culturalSubcategories: culturals
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- PAST EVENTS ---

router.get('/pastEvents', async (req, res) => {
    try {
        const events = await PastEvent.find({}).lean();
        res.set('Cache-Control', 'public, max-age=120, s-maxage=300, stale-while-revalidate=600');
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/pastEvents', protect, admin, async (req, res) => {
    try {
        const event = await PastEvent.create(req.body);
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/pastEvents/:id', protect, admin, async (req, res) => {
    try {
        const event = await PastEvent.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/pastEvents/:id', protect, admin, async (req, res) => {
    try {
        const event = await PastEvent.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        await event.deleteOne();
        res.json({ message: 'Event removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- SPONSORS ---

router.get('/sponsors', async (req, res) => {
    try {
        const sponsors = await Sponsor.find({}).lean();
        res.set('Cache-Control', 'public, max-age=120, s-maxage=300, stale-while-revalidate=600');
        res.json(sponsors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/sponsors', protect, admin, async (req, res) => {
    try {
        const sponsor = await Sponsor.create(req.body);
        res.status(201).json(sponsor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/sponsors/:id', protect, admin, async (req, res) => {
    try {
        const sponsor = await Sponsor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!sponsor) return res.status(404).json({ message: 'Sponsor not found' });
        res.json(sponsor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/sponsors/:id', protect, admin, async (req, res) => {
    try {
        const sponsor = await Sponsor.findById(req.params.id);
        if (!sponsor) return res.status(404).json({ message: 'Sponsor not found' });
        await sponsor.deleteOne();
        res.json({ message: 'Sponsor removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- CLUBS ---

router.get('/clubs', async (req, res) => {
    try {
        const clubs = await Club.find({}).lean();
        res.set('Cache-Control', 'public, max-age=120, s-maxage=300, stale-while-revalidate=600');
        res.json(clubs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/clubs', protect, admin, async (req, res) => {
    try {
        const club = await Club.create(req.body);
        res.status(201).json(club);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/clubs/:id', protect, admin, async (req, res) => {
    try {
        const club = await Club.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!club) return res.status(404).json({ message: 'Club not found' });
        res.json(club);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/clubs/:id', protect, admin, async (req, res) => {
    try {
        const club = await Club.findById(req.params.id);
        if (!club) return res.status(404).json({ message: 'Club not found' });
        await club.deleteOne();
        res.json({ message: 'Club removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- SITE CONFIG (RULES & CONTACT) ---

router.post('/config', protect, admin, async (req, res) => {
    try {
        const { key, value } = req.body;
        const valStr = typeof value === 'string' ? value.trim() : '';
        const isVideo = valStr && /\.(mp4|webm|ogg|mov|m4v)$/i.test(valStr.split('?')[0].split('#')[0]);
        const type = req.body.type || (isVideo ? 'video' : 'image');

        const config = await SiteConfig.findOneAndUpdate(
            { key },
            { value: valStr, type },
            { new: true, upsert: true }
        );
        res.json(config);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const DEFAULT_DEPARTMENTS = [
    { code: 'AIDS', name: 'Department of Artificial Intelligence and Data Science', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80', order: 1 },
    { code: 'CIVIL', name: 'Department of Civil Engineering', image: 'https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&w=800&q=80', order: 2 },
    { code: 'CSD-CST', name: 'Department of Computer Science and Design & Technology', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', order: 3 },
    { code: 'CSE', name: 'Department of Computer Science and Engineering', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80', order: 4 },
    { code: 'CSECS', name: 'Department of Computer Science and Engineering(Cyber Security)', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80', order: 5 },
    { code: 'ECE', name: 'Department of Electronics and Communication Engineering', image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80', order: 6 },
    { code: 'EEE', name: 'Department of Electrical and Electronics Engineering', image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80', order: 7 },
    { code: 'ETE-VLSI', name: 'Department of Electronics and Telecommunication Engineering & Department of Electronic Engineering - VLSI Design and Technology', image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80', order: 8 },
    { code: 'IT', name: 'Department of Information Technology', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', order: 9 },
    { code: 'MECH', name: 'Department of Mechanical Engineering', image: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&w=800&q=80', order: 10 },
    { code: 'MBA', name: 'Department of Master of Business Administration', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', order: 11 },
    { code: 'MCA', name: 'Department of Master of Computer Applications', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', order: 12 }
];

const DEFAULT_CULTURAL_SUBCATEGORIES = [
    { code: 'OnStage', name: 'On Stage', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80', order: 1 },
    { code: 'OffStage', name: 'Off Stage', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80', order: 2 }
];


// --- DEPARTMENTS (TECHNICAL) ---

router.get('/departments', async (req, res) => {
    try {
        let depts = await Department.find({}).sort({ order: 1, code: 1 }).lean();
        if (depts.length === 0) {
            await Department.insertMany(DEFAULT_DEPARTMENTS);
            depts = await Department.find({}).sort({ order: 1, code: 1 }).lean();
        }
        res.set('Cache-Control', 'public, max-age=120, s-maxage=300, stale-while-revalidate=600');
        res.json(depts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/departments', protect, admin, async (req, res) => {
    try {
        const { code, name, image, order } = req.body;
        if (!code || !name) {
            return res.status(400).json({ message: 'Department code and name are required' });
        }
        const existing = await Department.findOne({ code: code.toUpperCase().trim() });
        if (existing) {
            return res.status(400).json({ message: `Department with code '${code}' already exists` });
        }
        const dept = await Department.create({
            code: code.toUpperCase().trim(),
            name: name.trim(),
            image: image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
            order: Number(order) || 0
        });
        res.status(201).json(dept);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/departments/:id', protect, admin, async (req, res) => {
    try {
        const { code, name, image, order } = req.body;
        const updateData = {};
        if (code) updateData.code = code.toUpperCase().trim();
        if (name) updateData.name = name.trim();
        if (image !== undefined) updateData.image = image;
        if (order !== undefined) updateData.order = Number(order);

        const dept = await Department.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!dept) return res.status(404).json({ message: 'Department not found' });
        res.json(dept);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/departments/:id', protect, admin, async (req, res) => {
    try {
        const dept = await Department.findById(req.params.id);
        if (!dept) return res.status(404).json({ message: 'Department not found' });
        await dept.deleteOne();
        res.json({ message: 'Department removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- CULTURAL SUBCATEGORIES ---

router.get('/cultural-subcategories', async (req, res) => {
    try {
        let subs = await CulturalSubcategory.find({}).sort({ order: 1, name: 1 }).lean();
        if (subs.length === 0) {
            await CulturalSubcategory.insertMany(DEFAULT_CULTURAL_SUBCATEGORIES);
            subs = await CulturalSubcategory.find({}).sort({ order: 1, name: 1 }).lean();
        }
        res.set('Cache-Control', 'public, max-age=120, s-maxage=300, stale-while-revalidate=600');
        res.json(subs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/cultural-subcategories', protect, admin, async (req, res) => {
    try {
        const { code, name, image, order } = req.body;
        if (!code || !name) {
            return res.status(400).json({ message: 'Subcategory code and name are required' });
        }
        const existing = await CulturalSubcategory.findOne({ code: code.trim() });
        if (existing) {
            return res.status(400).json({ message: `Subcategory with code '${code}' already exists` });
        }
        const sub = await CulturalSubcategory.create({
            code: code.trim(),
            name: name.trim(),
            image: image || 'https://images.unsplash.com/photo-1514525253361-bee8a48790c3?auto=format&fit=crop&w=800&q=80',
            order: Number(order) || 0
        });
        res.status(201).json(sub);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/cultural-subcategories/:id', protect, admin, async (req, res) => {
    try {
        const { code, name, image, order } = req.body;
        const updateData = {};
        if (code) updateData.code = code.trim();
        if (name) updateData.name = name.trim();
        if (image !== undefined) updateData.image = image;
        if (order !== undefined) updateData.order = Number(order);

        const sub = await CulturalSubcategory.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!sub) return res.status(404).json({ message: 'Subcategory not found' });
        res.json(sub);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/cultural-subcategories/:id', protect, admin, async (req, res) => {
    try {
        const sub = await CulturalSubcategory.findById(req.params.id);
        if (!sub) return res.status(404).json({ message: 'Subcategory not found' });
        await sub.deleteOne();
        res.json({ message: 'Subcategory removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
