const express = require('express');
const router = express.Router();
const Pass = require('../models/Pass');
const { protect, admin } = require('../middlewares/authMiddleware');

// Helper to validate and sanitize color (hex or standard color name)
function sanitizeColor(c) {
    if (!c || typeof c !== 'string') return '#6D28D9';
    const trimmed = c.trim();
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(trimmed)) {
        return trimmed;
    }
    if (/^[a-zA-Z]{3,20}$/.test(trimmed)) {
        return trimmed.toLowerCase();
    }
    return '#6D28D9';
}

// @desc    Get all passes
// @route   GET /api/passes
// @access  Public
router.get('/', async (req, res) => {
    try {
        const passes = await Pass.find({});
        res.json(passes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a pass
// @route   POST /api/passes
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const passData = { ...req.body };
        if (passData.color) {
            passData.color = sanitizeColor(passData.color);
        } else {
            passData.color = '#6D28D9';
        }
        const pass = new Pass(passData);
        const createdPass = await pass.save();
        res.status(201).json(createdPass);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update a pass
// @route   PUT /api/passes/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const {
            name,
            price,
            type,
            perks,
            color,
            description,
            isActive,
            currency,
            eventName,
            eventYear,
            buttonText,
            registrationUrl,
            customLogo,
            themeConfig,
        } = req.body;
        const pass = await Pass.findById(req.params.id);

        if (pass) {
            if (name !== undefined) pass.name = name;
            if (price !== undefined) pass.price = price;
            if (type !== undefined) pass.type = type;
            if (perks !== undefined) pass.perks = perks;
            if (description !== undefined) pass.description = description;
            if (color !== undefined) pass.color = sanitizeColor(color);
            if (isActive !== undefined) pass.isActive = isActive;
            if (currency !== undefined) pass.currency = currency;
            if (eventName !== undefined) pass.eventName = eventName;
            if (eventYear !== undefined) pass.eventYear = eventYear;
            if (buttonText !== undefined) pass.buttonText = buttonText;
            if (registrationUrl !== undefined) pass.registrationUrl = registrationUrl;
            if (customLogo !== undefined) pass.customLogo = customLogo;
            if (themeConfig !== undefined) pass.themeConfig = themeConfig;

            const updatedPass = await pass.save();
            res.json(updatedPass);
        } else {
            res.status(404).json({ message: 'Pass not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete a pass
// @route   DELETE /api/passes/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const pass = await Pass.findById(req.params.id);

        if (pass) {
            await pass.deleteOne();
            res.json({ message: 'Pass removed' });
        } else {
            res.status(404).json({ message: 'Pass not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
