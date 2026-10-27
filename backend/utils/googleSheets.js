const axios = require('axios');
const mongoose = require('mongoose');
const SiteConfig = require('../models/SiteConfig');
const Event = require('../models/Event');
const Pass = require('../models/Pass');
const Department = require('../models/Department');
const CulturalSubcategory = require('../models/CulturalSubcategory');
const Club = require('../models/Club');
const PastEvent = require('../models/PastEvent');
const Admin = require('../models/Admin');

/**
 * Retrieve the active Google Apps Script Web App URL.
 * Prioritizes DB SiteConfig (key: 'google_sheet_script_url'), then falls back to process.env.GOOGLE_SCRIPT_URL.
 */
const getGoogleSheetUrl = async () => {
    try {
        if (SiteConfig && typeof SiteConfig.findOne === 'function') {
            const config = await SiteConfig.findOne({ key: 'google_sheet_script_url' });
            if (config && config.value && config.value.trim().length > 0) {
                return config.value.trim();
            }
        }
    } catch (err) {
        // Fallback to env on DB lookup failure
    }
    return (process.env.GOOGLE_SCRIPT_URL || '').trim();
};

const extractGoogleScriptError = (data) => {
    if (typeof data === 'string' && (data.includes('<title>Error</title>') || data.includes('errorMessage') || data.includes('ReferenceError'))) {
        const match = data.match(/<div style="text-align:center;font-family:monospace[^>]*>(.*?)<\/div>/s) ||
                      data.match(/<div class="errorMessage"[^>]*>(.*?)<\/div>/s);
        if (match) {
            return match[1].replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/<[^>]+>/g, '').trim();
        }
        return 'Google Apps Script runtime error (check Code.gs in Google Sheets)';
    }
    return null;
};

/**
 * Test Google Sheets connection via GET or POST action: 'test'
 */
const testSheetConnection = async (customUrl = null) => {
    const scriptUrl = customUrl ? customUrl.trim() : await getGoogleSheetUrl();
    if (!scriptUrl) {
        return { success: false, message: 'Google Apps Script URL is empty. Please enter your Web App URL.' };
    }

    try {
        const response = await axios.post(
            scriptUrl,
            { action: 'test' },
            {
                timeout: 20000,
                headers: { 'Content-Type': 'application/json' },
                maxRedirects: 5
            }
        );

        const scriptError = extractGoogleScriptError(response.data);
        if (scriptError) {
            return {
                success: false,
                message: `Google Apps Script Error: ${scriptError}. Please copy the updated script from the 4-Step Guide into Code.gs.`
            };
        }

        if (response.data && (response.data.status === 'success' || response.data.spreadsheetTitle)) {
            return {
                success: true,
                message: response.data.message || 'Connected to Google Sheets successfully!',
                spreadsheetTitle: response.data.spreadsheetTitle || 'Connected Spreadsheet',
                totalSheets: response.data.totalSheets || 1,
                sheets: response.data.sheets || []
            };
        }

        return {
            success: true,
            message: 'Connected to Google Sheet Web App (Response received)',
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Failed to reach Google Apps Script'
        };
    }
};

/**
 * Formats all MongoDB Atlas collections into tabular structure for Google Sheets
 */
const formatDatabasePayload = async () => {
    const [events, passes, siteConfigs, departments, culturals, clubs, pastEvents, admins] = await Promise.all([
        Event.find().sort({ createdAt: -1 }),
        Pass.find().sort({ createdAt: -1 }),
        SiteConfig.find().sort({ key: 1 }),
        Department.find().sort({ order: 1 }),
        CulturalSubcategory.find().sort({ order: 1 }),
        Club.find().sort({ createdAt: -1 }),
        PastEvent.find().sort({ createdAt: -1 }),
        Admin.find().select('-password').sort({ createdAt: -1 })
    ]);

    // 1. Events Tab
    const eventsHeaders = [
        "Event ID", "Title", "Category", "Event Type", "Department",
        "Date", "Timings", "Venue", "Fee (₹)", "Prizes",
        "Description", "Rules", "Image URL", "Coordinators", "Created At"
    ];
    const eventsRows = events.map(e => [
        String(e._id || ''),
        e.title || '',
        e.category || '',
        e.eventType || 'Normal',
        e.department || '',
        e.date ? new Date(e.date).toLocaleDateString('en-IN') : '',
        e.timings || `${e.fromTime || ''} - ${e.toTime || ''}`,
        e.venue || '',
        e.registrationFee || 0,
        e.prize || `Winner: ${e.winnerPrize || ''}, Runner: ${e.runnerPrize || ''}`,
        (e.description || '').substring(0, 300),
        Array.isArray(e.rules) ? e.rules.join('; ') : '',
        e.image || '',
        Array.isArray(e.coordinators) ? e.coordinators.map(c => `${c.name || ''} (${c.phone || ''})`).join(', ') : '',
        e.createdAt ? new Date(e.createdAt).toLocaleString('en-IN') : ''
    ]);

    // 2. Passes Tab
    const passesHeaders = [
        "Pass ID", "Pass Name", "Price (₹)", "Type", "Color",
        "Description", "Perks", "Status", "Button Text", "Created At"
    ];
    const passesRows = passes.map(p => [
        String(p._id || ''),
        p.name || '',
        p.price || '',
        p.type || 'Individual',
        p.color || '#6D28D9',
        p.description || '',
        Array.isArray(p.perks) ? p.perks.join('; ') : '',
        p.isActive ? 'Active' : 'Inactive',
        p.buttonText || 'GET MY PASS',
        p.createdAt ? new Date(p.createdAt).toLocaleString('en-IN') : ''
    ]);

    // 3. SiteConfig Tab
    const siteConfigHeaders = [
        "Config Key", "Type", "Content / Value URL", "Last Updated"
    ];
    const siteConfigRows = siteConfigs.map(c => [
        c.key || '',
        c.type || 'text',
        c.value || '',
        c.updatedAt ? new Date(c.updatedAt).toLocaleString('en-IN') : ''
    ]);

    // 4. Departments Tab
    const deptHeaders = ["Code", "Department Name", "Image URL", "Display Order"];
    const deptRows = departments.map(d => [
        d.code || '',
        d.name || '',
        d.image || '',
        d.order || 0
    ]);

    // 5. Cultural Subcategories Tab
    const culturalHeaders = ["Code", "Category Name", "Image URL", "Display Order"];
    const culturalRows = culturals.map(c => [
        c.code || '',
        c.name || '',
        c.image || '',
        c.order || 0
    ]);

    // 6. Clubs Tab
    const clubHeaders = ["Club Name", "Tier", "Logo URL", "Description"];
    const clubRows = clubs.map(c => [
        c.name || '',
        c.tier || 'Silver',
        c.logo || '',
        c.description || ''
    ]);

    // 7. Past Events Tab
    const pastHeaders = ["Title", "Image URL", "Description"];
    const pastRows = pastEvents.map(p => [
        p.title || '',
        p.image || '',
        p.description || ''
    ]);

    // 8. Admins Tab
    const adminHeaders = ["Admin ID", "Username / Email", "Role", "Department", "Created At"];
    const adminRows = admins.map(a => [
        String(a._id || ''),
        a.username || '',
        a.role || 'staff',
        a.department || 'All',
        a.createdAt ? new Date(a.createdAt).toLocaleString('en-IN') : ''
    ]);

    return {
        databaseName: mongoose.connection.name || 'kalam',
        clusterHost: 'kalam.kz35dtp.mongodb.net',
        collections: {
            "Events": { headers: eventsHeaders, rows: eventsRows, count: eventsRows.length },
            "Passes": { headers: passesHeaders, rows: passesRows, count: passesRows.length },
            "SiteConfig": { headers: siteConfigHeaders, rows: siteConfigRows, count: siteConfigRows.length },
            "Departments": { headers: deptHeaders, rows: deptRows, count: deptRows.length },
            "CulturalSubcategories": { headers: culturalHeaders, rows: culturalRows, count: culturalRows.length },
            "Clubs": { headers: clubHeaders, rows: clubRows, count: clubRows.length },
            "PastEvents": { headers: pastHeaders, rows: pastRows, count: pastRows.length },
            "Admins": { headers: adminHeaders, rows: adminRows, count: adminRows.length }
        }
    };
};

/**
 * Bulk sync the entire MongoDB Atlas database to Google Sheets
 */
const syncFullDatabaseToSheet = async () => {
    const scriptUrl = await getGoogleSheetUrl();
    if (!scriptUrl) {
        throw new Error('Google Apps Script URL is not configured. Please set it in Admin Dashboard or .env');
    }

    const payload = await formatDatabasePayload();

    try {
        const response = await axios.post(
            scriptUrl,
            {
                action: 'sync_database',
                databaseName: payload.databaseName,
                clusterHost: payload.clusterHost,
                collections: payload.collections
            },
            {
                timeout: 60000,
                headers: { 'Content-Type': 'application/json' },
                maxRedirects: 5
            }
        );
        const scriptError = extractGoogleScriptError(response.data);
        if (scriptError) {
            throw new Error(`Google Apps Script Error: ${scriptError}. Please update Code.gs in Google Sheets.`);
        }

        return {
            success: true,
            data: response.data,
            counts: Object.keys(payload.collections).reduce((acc, key) => {
                acc[key] = payload.collections[key].count;
                return acc;
            }, {})
        };
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to sync database to Google Sheets');
    }
};

/**
 * Sync an individual collection from MongoDB Atlas to Google Sheets
 */
const syncSingleCollection = async (collectionName) => {
    const scriptUrl = await getGoogleSheetUrl();
    if (!scriptUrl) {
        throw new Error('Google Apps Script URL is not configured.');
    }

    const payload = await formatDatabasePayload();
    const colData = payload.collections[collectionName];
    if (!colData) {
        throw new Error(`Collection "${collectionName}" not found in MongoDB database.`);
    }

    try {
        const response = await axios.post(
            scriptUrl,
            {
                action: 'sync_collection',
                collection: collectionName,
                headers: colData.headers,
                rows: colData.rows
            },
            {
                timeout: 30000,
                headers: { 'Content-Type': 'application/json' },
                maxRedirects: 5
            }
        );

        const scriptError = extractGoogleScriptError(response.data);
        if (scriptError) {
            throw new Error(`Google Apps Script Error: ${scriptError}. Please update Code.gs in Google Sheets.`);
        }

        return {
            success: true,
            collection: collectionName,
            rowCount: colData.count,
            data: response.data
        };
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || `Failed to sync collection ${collectionName}`);
    }
};

/**
 * Log individual registration to Google Sheet via Web App action
 */
const logToSheet = async (data) => {
    try {
        const scriptUrl = await getGoogleSheetUrl();
        if (!scriptUrl) {
            console.warn('[GoogleSheets] Google Script URL not configured, skipping sheet sync');
            return { success: false, message: 'Google Script URL not configured' };
        }

        const response = await axios.post(
            scriptUrl,
            { action: 'log_registration', ...data },
            {
                timeout: 10000,
                headers: { 'Content-Type': 'application/json' },
                maxRedirects: 5
            }
        );

        return { success: true, data: response.data };
    } catch (error) {
        console.error('[GoogleSheets] logToSheet error:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = {
    getGoogleSheetUrl,
    testSheetConnection,
    formatDatabasePayload,
    syncFullDatabaseToSheet,
    syncSingleCollection,
    logToSheet
};
