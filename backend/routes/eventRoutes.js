const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const {
    exportCulturalEvents,
    downloadCulturalTemplate,
    previewCulturalImport,
    executeCulturalImport,
    getLastCulturalImport
} = require('../controllers/culturalImportController');
const {
    exportTechnicalEvents,
    downloadTechnicalTemplate,
    previewTechnicalImport,
    executeTechnicalImport,
    getLastTechnicalImport,
    getTechnicalEvents
} = require('../controllers/technicalImportController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Memory storage for Excel file processing (safe for serverless and bounded memory)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'application/octet-stream'
        ];
        if (allowedMimes.includes(file.mimetype) || file.originalname.match(/\.(xlsx|xls)$/i)) {
            cb(null, true);
        } else {
            cb(new Error('Only .xlsx and .xls Excel files are allowed.'));
        }
    }
});

// ============================================================================
// TECHNICAL EVENTS EXCEL IMPORT & EXPORT ROUTES
// ============================================================================
router.get('/technical/export', exportTechnicalEvents);
router.get('/technical/template', downloadTechnicalTemplate);
router.get('/technical/import/last', protect, admin, getLastTechnicalImport);
router.post('/technical/import/preview', protect, admin, upload.single('file'), previewTechnicalImport);
router.post('/technical/import/execute', protect, admin, executeTechnicalImport);
router.get('/technical', getTechnicalEvents);

// ============================================================================
// CULTURAL EVENTS EXCEL IMPORT & EXPORT ROUTES
// ============================================================================
router.get('/cultural/export', exportCulturalEvents);
router.get('/cultural/template', downloadCulturalTemplate);
router.get('/cultural/import/last', protect, admin, getLastCulturalImport);
router.post('/cultural/import/preview', protect, admin, upload.single('file'), previewCulturalImport);
router.post('/cultural/import/execute', protect, admin, executeCulturalImport);

// ============================================================================
// GENERAL EVENT CRUD ROUTES
// ============================================================================
router.route('/')
    .get(getEvents)
    .post(protect, admin, createEvent);

router.route('/:id')
    .get(getEventById)
    .put(protect, admin, updateEvent)
    .delete(protect, admin, deleteEvent);

module.exports = router;
