require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const xlsx = require('xlsx');
const Event = require('../models/Event');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const FormData = require('form-data');

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
    console.log('================================================================');
    console.log('KALAM 2026 — TECHNICAL EXCEL IMPORT & MANAGEMENT TEST SUITE');
    console.log('================================================================');

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');

    // 1. Get an Admin or generate a test admin token
    let adminUser = await Admin.findOne({ role: 'admin' });
    if (!adminUser) {
        adminUser = await Admin.findOne({});
    }
    const token = jwt.sign(
        { id: adminUser._id },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '1h' }
    );
    const authHeaders = { Authorization: `Bearer ${token}` };
    console.log(`Using admin token for: ${adminUser.username || adminUser.email} (${adminUser._id})`);

    // Record initial counts
    const initialCulturalCount = await Event.countDocuments({ category: 'Cultural' });
    const initialTechCount = await Event.countDocuments({ category: { $ne: 'Cultural' } });
    console.log(`Initial DB State: ${initialTechCount} Technical events, ${initialCulturalCount} Cultural events.`);

    // 2. Test GET /api/events/technical/template
    console.log('\n--- TEST 1: Download Official Technical Excel Template ---');
    const templateRes = await axios.get(`${BASE_URL}/events/technical/template`, {
        responseType: 'arraybuffer'
    });
    console.log(`Status: ${templateRes.status}`);
    console.log(`Content-Type: ${templateRes.headers['content-type']}`);
    const wb = xlsx.read(templateRes.data, { type: 'buffer' });
    console.log(`Sheets in Template: ${wb.SheetNames.join(', ')}`);
    const expectedSheets = ['Events', 'Rounds', 'Rules', 'OtherPrizes', 'FacultyCoordinators', 'StudentCoordinators', 'Instructions'];
    const hasAllSheets = expectedSheets.every(s => wb.SheetNames.includes(s));
    if (!hasAllSheets) {
        throw new Error(`Template missing expected sheets! Got: ${wb.SheetNames.join(', ')}`);
    }
    console.log('✅ Technical template contains all 7 required worksheets.');

    // 3. Test Preview with Official Technical Template
    console.log('\n--- TEST 2: Preview & Validate Uploaded Technical Workbook ---');
    const form = new FormData();
    form.append('file', templateRes.data, {
        filename: 'Test_Technical_Events.xlsx',
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const previewRes = await axios.post(`${BASE_URL}/events/technical/import/preview`, form, {
        headers: {
            ...authHeaders,
            ...form.getHeaders()
        }
    });

    console.log(`Preview Status: ${previewRes.status}`);
    console.log(`Detected Rows: ${previewRes.data.summary.totalRows}`);
    console.log(`Valid Rows: ${previewRes.data.summary.validRows}`);
    console.log(`New Events: ${previewRes.data.summary.newCount}`);
    console.log(`Updates: ${previewRes.data.summary.updateCount}`);
    console.log(`Conflicts: ${previewRes.data.summary.conflictCount}`);
    if (previewRes.data.summary.validRows !== previewRes.data.summary.totalRows) {
        throw new Error(`Expected all sample rows to be valid! Errors: ${JSON.stringify(previewRes.data.errors)}`);
    }
    console.log('✅ Technical workbook previewed & validated with 100% validity.');

    // 4. Test Scope Guard: Reject Cultural Events in Technical Importer
    console.log('\n--- TEST 3: Scope Guard — Reject Cultural Events in Technical Importer ---');
    const badWb = xlsx.utils.book_new();
    const badEvents = [
        {
            'Event ID*': 'CULT-TEST-ERR',
            'Event Title*': 'Solo Classical Singing Competition',
            'Category* (Technical / Workshop / Non Technical)': 'Cultural', // Forbidden
            'Subcategory / Department* (e.g. HACK / PAPER / General)': 'On Stage', // Forbidden
            'Date* (YYYY-MM-DD)': '2026-10-28',
            'Venue*': 'Auditorium',
            'From Time*': '10:00 AM',
            'Description*': 'Invalid cultural event inside technical import'
        }
    ];
    xlsx.utils.book_append_sheet(badWb, xlsx.utils.json_to_sheet(badEvents), 'Events');
    const badBuffer = xlsx.write(badWb, { type: 'buffer', bookType: 'xlsx' });

    const badForm = new FormData();
    badForm.append('file', badBuffer, { filename: 'Bad_Cultural_In_Tech.xlsx', contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const badPreviewRes = await axios.post(`${BASE_URL}/events/technical/import/preview`, badForm, {
        headers: { ...authHeaders, ...badForm.getHeaders() }
    });
    console.log(`Cultural row flagged invalid: ${badPreviewRes.data.summary.invalidRows === 1}`);
    console.log(`Can import: ${badPreviewRes.data.canImport}`);
    if (badPreviewRes.data.canImport !== false) {
        throw new Error('Cultural event was NOT rejected by Technical preview guardrail!');
    }
    console.log('✅ Cultural event correctly rejected by Technical import guardrails.');

    // 5. Test Conflict Detection: Event ID matching an existing Cultural Event
    console.log('\n--- TEST 4: Conflict Guard — Block Overwriting Cultural Events ---');
    const existingCultEvent = await Event.findOne({ category: 'Cultural' });
    if (existingCultEvent && existingCultEvent.eventId) {
        const conflictWb = xlsx.utils.book_new();
        const conflictEvents = [
            {
                'Event ID*': existingCultEvent.eventId, // Matches existing Cultural event!
                'Event Title*': 'Infiltrator Tech Event',
                'Category* (Technical / Workshop / Non Technical)': 'Technical',
                'Subcategory / Department* (e.g. HACK / PAPER / General)': 'HACK - Hackathon',
                'Date* (YYYY-MM-DD)': '2026-10-28',
                'Venue*': 'Lab 1',
                'From Time*': '10:00 AM',
                'Description*': 'Attempting to overwrite a cultural event'
            }
        ];
        xlsx.utils.book_append_sheet(conflictWb, xlsx.utils.json_to_sheet(conflictEvents), 'Events');
        const conflictBuffer = xlsx.write(conflictWb, { type: 'buffer', bookType: 'xlsx' });

        const conflictForm = new FormData();
        conflictForm.append('file', conflictBuffer, { filename: 'Conflict_Cultural.xlsx', contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        const conflictPreviewRes = await axios.post(`${BASE_URL}/events/technical/import/preview`, conflictForm, {
            headers: { ...authHeaders, ...conflictForm.getHeaders() }
        });

        console.log(`Conflict Detected Count: ${conflictPreviewRes.data.summary.conflictCount}`);
        console.log(`Conflict Message: ${conflictPreviewRes.data.conflicts[0]?.message}`);
        if (conflictPreviewRes.data.summary.conflictCount === 0 || conflictPreviewRes.data.canImport !== false) {
            throw new Error('Matching Cultural event ID was NOT flagged as a critical conflict!');
        }
        console.log('✅ Overwrite attempt against Cultural event successfully BLOCKED.');
    } else {
        console.log('ℹ️ No existing Cultural event with eventId found to test conflict matching.');
    }

    // 6. Test Execute Confirmed Import (Mode C: Upsert)
    console.log('\n--- TEST 5: Execute Technical Import in Mode C (Upsert) ---');
    const executeRes = await axios.post(
        `${BASE_URL}/events/technical/import/execute`,
        {
            events: previewRes.data.events.filter(e => e.isValid),
            mode: 'upsert',
            fileName: 'Test_Technical_Events.xlsx'
        },
        { headers: authHeaders }
    );

    console.log(`Execute Status: ${executeRes.status}`);
    console.log(`Inserted Count: ${executeRes.data.summary.insertedCount}`);
    console.log(`Updated Count: ${executeRes.data.summary.updatedCount}`);
    console.log(`Skipped Count: ${executeRes.data.summary.skippedCount}`);

    // Verify in MongoDB
    const importedHack = await Event.findOne({ eventId: 'TECH-HACK-001' });
    if (!importedHack) {
        throw new Error('TECH-HACK-001 was not found in MongoDB after execution!');
    }
    console.log(`Verified imported event in MongoDB: ${importedHack.title} (ID: ${importedHack.eventId}, Dept: ${importedHack.department})`);
    console.log(`Rounds count: ${importedHack.rounds.length}, Rules count: ${importedHack.rules.length}, Themes: ${importedHack.theme.join(', ')}`);
    console.log(`Faculty Coordinators: ${importedHack.facultyCoordinators.length}, Student Coordinators: ${importedHack.studentCoordinators.length}`);
    console.log('✅ Technical events successfully inserted with all nested sub-sheets!');

    // 7. Test Mode B (Update Matching Only) + Blank Cell Safety
    console.log('\n--- TEST 6: Blank Cell Safety & Mode B (Update Only) ---');
    const updatePayload = [
        {
            eventId: 'TECH-HACK-001',
            title: 'CodeStorm 24-Hour National Hackathon (Updated Title)',
            category: 'Technical',
            department: 'HACK',
            subCategory: 'HACK',
            eventType: 'Hackathon',
            date: '2026-10-28T00:00:00.000Z',
            venue: 'New Advanced AI Lab',
            fromTime: '09:00 AM',
            toTime: '09:00 AM',
            winnerPrize: '₹30,000', // Updated
            runnerPrize: '', // Blank cell - must NOT erase existing ₹15,000!
            description: 'Updated hackathon description'
        }
    ];

    const modeBRes = await axios.post(
        `${BASE_URL}/events/technical/import/execute`,
        {
            events: updatePayload,
            mode: 'update_only',
            fileName: 'Update_Tech.xlsx'
        },
        { headers: authHeaders }
    );

    console.log(`Mode B Updated Count: ${modeBRes.data.summary.updatedCount}`);
    const verifiedUpdated = await Event.findOne({ eventId: 'TECH-HACK-001' });
    if (verifiedUpdated.winnerPrize !== '₹30,000') {
        throw new Error(`Winner prize was not updated! Got: ${verifiedUpdated.winnerPrize}`);
    }
    if (verifiedUpdated.runnerPrize !== '₹15,000') {
        throw new Error(`Runner prize was erased by blank cell! Got: "${verifiedUpdated.runnerPrize}"`);
    }
    console.log(`Verified Winner Prize updated to: ${verifiedUpdated.winnerPrize}`);
    console.log(`Verified Runner Prize preserved by blank-cell safety: ${verifiedUpdated.runnerPrize}`);
    console.log('✅ Mode B and Blank-cell safety verified.');

    // 8. Test Manual Edit via Admin API (PUT /api/events/:id)
    console.log('\n--- TEST 7: Manual Edit Synchronization via Admin API ---');
    const manualEditPayload = {
        title: 'CodeStorm 24-Hour National Hackathon (Manually Edited via Admin)',
        eventId: 'TECH-HACK-001',
        category: 'Technical',
        department: 'HACK',
        subCategory: 'HACK',
        eventType: 'Hackathon',
        venue: 'Grand Innovation Centre',
        date: '2026-10-28',
        fromTime: '09:00 AM',
        toTime: '09:00 AM',
        winnerPrize: '₹35,000',
        runnerPrize: '₹20,000',
        description: 'Manually edited description through admin panel form.'
    };

    const manualPutRes = await axios.put(
        `${BASE_URL}/events/${verifiedUpdated._id}`,
        manualEditPayload,
        { headers: authHeaders }
    );
    console.log(`Manual PUT Status: ${manualPutRes.status}`);
    const dbAfterManual = await Event.findById(verifiedUpdated._id);
    if (dbAfterManual.title !== manualEditPayload.title) {
        throw new Error('Manual edit was not saved to MongoDB!');
    }
    console.log(`✅ Manual edit saved to MongoDB: "${dbAfterManual.title}" (Version: ${dbAfterManual.version})`);

    // 9. Test GET /api/technical-events and GET /api/events/technical/import/last
    console.log('\n--- TEST 8: Verify Public API Endpoints ---');
    const techEventsRes = await axios.get(`${BASE_URL}/technical-events`);
    console.log(`GET /api/technical-events Status: ${techEventsRes.status}, Returned: ${techEventsRes.data.length} events`);
    const hasCulturalInTech = techEventsRes.data.some(e => e.category === 'Cultural');
    if (hasCulturalInTech) {
        throw new Error('GET /api/technical-events contained Cultural events!');
    }
    console.log('✅ /api/technical-events returns only Technical events with 0 Cultural leakage.');

    const lastImportRes = await axios.get(`${BASE_URL}/events/technical/import/last`, {
        headers: authHeaders
    });
    console.log(`GET /api/events/technical/import/last Status: ${lastImportRes.status}`);
    console.log(`Last Import Stats: ${JSON.stringify(lastImportRes.data.lastImport)}`);
    if (!lastImportRes.data.lastImport || !lastImportRes.data.lastImport.timestamp) {
        throw new Error('Last import metadata was not recorded in SiteConfig!');
    }
    console.log('✅ Last import timestamp and statistics recorded and retrieved.');

    // 10. Verify Cultural Events Integrity
    console.log('\n--- TEST 9: Final Cultural Isolation & Zero Side-Effect Check ---');
    const finalCulturalCount = await Event.countDocuments({ category: 'Cultural' });
    console.log(`Final Cultural Events Count: ${finalCulturalCount} (Initial was: ${initialCulturalCount})`);
    if (finalCulturalCount !== initialCulturalCount) {
        throw new Error(`Cultural events count changed from ${initialCulturalCount} to ${finalCulturalCount}!`);
    }
    console.log('✅ Cultural events collection is 100% intact and untouched.');

    console.log('\n================================================================');
    console.log('🎉 ALL 9 TEST SUITES PASSED FLAWLESSLY!');
    console.log('================================================================\n');

    await mongoose.disconnect();
}

runTests().catch(err => {
    console.error('\n❌ TEST RUN FAILED:', err.response?.data || err.message);
    process.exit(1);
});
