const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const SiteConfig = require('../models/SiteConfig');
const { protect, admin } = require('../middlewares/authMiddleware');

// Multer Storage Engine
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads'),
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 50000000 }, // 50MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('image');

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif|webp|mp4|webm|ogg|mov|m4v/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = /jpeg|jpg|png|gif|webp|mp4|webm|ogg|quicktime|video/.test(file.mimetype);

    if (mimetype || extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only images (jpg, png, gif, webp) and videos (mp4, webm, ogg, mov) are allowed!'));
    }
}

// @desc    Upload Image & Update Config
// @route   POST /api/upload/:key
// @access  Private/Admin
router.post('/:key', protect, admin, (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message || err });
        } else {
            if (req.file == undefined) {
                return res.status(400).json({ message: 'No file selected!' });
            } else {
                try {
                    const key = req.params.key;
                    const imageUrl = `/uploads/${req.file.filename}`;
                    const isVideo = /\.(mp4|webm|ogg|mov|m4v)$/i.test(req.file.filename);

                    // Update or Insert in SiteConfig
                    const config = await SiteConfig.findOneAndUpdate(
                        { key },
                        { value: imageUrl, type: isVideo ? 'video' : 'image' },
                        { new: true, upsert: true }
                    );

                    res.json({
                        message: 'File uploaded successfully',
                        data: config
                    });
                } catch (error) {
                    res.status(500).json({ message: 'Database update failed', error: error.message });
                }
            }
        }
    });
});

// @desc    Generic File Upload (returns URL)
// @route   POST /api/upload/file
// @access  Private/Admin
router.post('/generic/file', protect, admin, (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message || err });
        } else {
            if (req.file == undefined) {
                return res.status(400).json({ message: 'No file selected!' });
            } else {
                const imageUrl = `/uploads/${req.file.filename}`;
                const isVideo = /\.(mp4|webm|ogg|mov|m4v)$/i.test(req.file.filename);
                res.json({
                    message: 'File uploaded successfully',
                    url: imageUrl,
                    type: isVideo ? 'video' : 'image'
                });
            }
        }
    });
});

// @desc    Get All Site Configs
// @route   GET /api/upload
// @access  Public
router.get('/', async (req, res) => {
    try {
        const configs = await SiteConfig.find({});
        // Convert array to object for easier key-value access on frontend
        const configMap = {};
        configs.forEach(conf => {
            configMap[conf.key] = conf.value;
        });
        res.json(configMap);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch configs' });
    }
});

module.exports = router;
