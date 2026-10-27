const express = require('express');
const router = express.Router();
const {
    getSheetConfig,
    updateSheetConfig,
    testConnection,
    syncEntireDatabase,
    syncSingleCollection,
    getScriptTemplate
} = require('../controllers/sheetController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/config', protect, admin, getSheetConfig);
router.post('/config', protect, admin, updateSheetConfig);
router.post('/test', protect, admin, testConnection);
router.post('/sync', protect, admin, syncEntireDatabase);
router.post('/sync/:collection', protect, admin, syncSingleCollection);
router.get('/template', protect, admin, getScriptTemplate);

module.exports = router;
