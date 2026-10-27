const mongoose = require('mongoose');
const SiteConfig = require('../models/SiteConfig');
const Event = require('../models/Event');
const Pass = require('../models/Pass');
const Department = require('../models/Department');
const CulturalSubcategory = require('../models/CulturalSubcategory');
const Club = require('../models/Club');
const PastEvent = require('../models/PastEvent');
const Admin = require('../models/Admin');
const {
    getGoogleSheetUrl,
    testSheetConnection,
    syncFullDatabaseToSheet,
    syncSingleCollection,
    formatDatabasePayload
} = require('../utils/googleSheets');
const { GOOGLE_APPS_SCRIPT_CODE } = require('../utils/googleAppsScriptTemplate');

// @desc    Get Google Sheets Sync Configuration & MongoDB Atlas Database Stats
// @route   GET /api/sheets/config
// @access  Private/Admin
const getSheetConfig = async (req, res) => {
    try {
        const scriptUrl = await getGoogleSheetUrl();

        const [
            eventCount,
            passCount,
            siteConfigCount,
            deptCount,
            culturalCount,
            clubCount,
            pastEventCount,
            adminCount
        ] = await Promise.all([
            Event.countDocuments(),
            Pass.countDocuments(),
            SiteConfig.countDocuments(),
            Department.countDocuments(),
            CulturalSubcategory.countDocuments(),
            Club.countDocuments(),
            PastEvent.countDocuments(),
            Admin.countDocuments()
        ]);

        const totalRecords = eventCount + passCount + siteConfigCount + deptCount + culturalCount + clubCount + pastEventCount + adminCount;

        res.json({
            scriptUrl,
            isConfigured: !!scriptUrl,
            database: {
                name: mongoose.connection.name || 'kalam',
                cluster: 'kalam.kz35dtp.mongodb.net',
                status: mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting'
            },
            totalRecords,
            collections: {
                Events: { count: eventCount, label: 'Events & Competitions', color: '#6366f1' },
                Passes: { count: passCount, label: 'Registration Passes', color: '#a855f7' },
                SiteConfig: { count: siteConfigCount, label: 'Website Settings & Media', color: '#22c55e' },
                Departments: { count: deptCount, label: 'Academic Departments', color: '#06b6d4' },
                CulturalSubcategories: { count: culturalCount, label: 'Cultural Subcategories', color: '#ec4899' },
                Clubs: { count: clubCount, label: 'Student Clubs & Teams', color: '#eab308' },
                PastEvents: { count: pastEventCount, label: 'Past Event Highlights', color: '#64748b' },
                Admins: { count: adminCount, label: 'Staff & Admin Accounts', color: '#4f46e5' }
            }
        });
    } catch (error) {
        console.error('Error fetching sheet config:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Google Sheets Script URL
// @route   POST /api/sheets/config
// @access  Private/Admin
const updateSheetConfig = async (req, res) => {
    try {
        const { scriptUrl } = req.body;
        const cleanUrl = typeof scriptUrl === 'string' ? scriptUrl.trim() : '';

        await SiteConfig.findOneAndUpdate(
            { key: 'google_sheet_script_url' },
            { value: cleanUrl, type: 'text' },
            { new: true, upsert: true }
        );

        res.json({
            message: 'Google Sheets Script URL saved successfully',
            scriptUrl: cleanUrl
        });
    } catch (error) {
        console.error('Error saving sheet config:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Test Google Sheets Connection
// @route   POST /api/sheets/test
// @access  Private/Admin
const testConnection = async (req, res) => {
    try {
        const { scriptUrl } = req.body;
        const result = await testSheetConnection(scriptUrl);
        res.json(result);
    } catch (error) {
        console.error('Error testing sheet connection:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Sync Entire MongoDB Atlas Database to Google Sheets
// @route   POST /api/sheets/sync
// @access  Private/Admin
const syncEntireDatabase = async (req, res) => {
    try {
        const result = await syncFullDatabaseToSheet();
        res.json({
            success: true,
            message: 'All MongoDB Atlas collections synchronized to Google Sheets successfully!',
            counts: result.counts,
            data: result.data
        });
    } catch (error) {
        console.error('Error during database sync:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to sync database to Google Sheets'
        });
    }
};

// @desc    Sync Single Collection to Google Sheets
// @route   POST /api/sheets/sync/:collection
// @access  Private/Admin
const syncSingleCollectionController = async (req, res) => {
    try {
        const { collection } = req.params;
        const result = await syncSingleCollection(collection);
        res.json({
            success: true,
            message: `Collection "${collection}" synchronized to Google Sheets!`,
            collection,
            rowCount: result.rowCount
        });
    } catch (error) {
        console.error('Error syncing collection:', error);
        res.status(500).json({
            success: false,
            message: error.message || `Failed to sync collection ${req.params.collection}`
        });
    }
};

// @desc    Get Google Apps Script copy-paste template code
// @route   GET /api/sheets/template
// @access  Private/Admin
const getScriptTemplate = async (req, res) => {
    res.json({
        scriptCode: GOOGLE_APPS_SCRIPT_CODE
    });
};

module.exports = {
    getSheetConfig,
    updateSheetConfig,
    testConnection,
    syncEntireDatabase,
    syncSingleCollection: syncSingleCollectionController,
    getScriptTemplate
};
