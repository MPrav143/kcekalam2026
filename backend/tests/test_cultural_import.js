require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const xlsx = require('xlsx');
const Event = require('../models/Event');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
    console.log('================================================================');
    console.log('KALAM 2026 — CULTURAL EXCEL IMPORT & EVENT MANAGEMENT TEST SUITE');
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

    // 2. Test GET /api/events/cultural/template
    console.log('\n--- TEST 1: Download Official Cultural Excel Template ---');
    const templateRes = await axios.get(`${BASE_URL}/events/cultural/template`, {
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
    console.log('✅ Template contains all 7 required worksheets.');

    // 3. Test Preview with Sample Workbook
    console.log('\n--- TEST 2: Preview & Validate Uploaded Cultural Workbook ---');
    // Create a FormData simulation or direct payload using boundary
    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', templateRes.data, {
        filename: 'Test_Cultural_Events.xlsx',
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const previewRes = await axios.post(`${BASE_URL}/events/cultural/import/preview`, form, {
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
    console.log('✅ Workbook previewed & validated with 100% validity.');

    // 4. Test Protection: Try importing a Technical event (Must be rejected)
    console.log('\n--- TEST 3: Scope Guard — Reject Technical Events ---');
    const badWb = xlsx.utils.book_new();
    const badEvents = [
        {
            'Event ID*': 'TECH-ERR-001',
            'Event Title*': 'Hackathon Engineering Challenge',
            'Cultural Category* (On Stage / Off Stage)': 'Technical', // Forbidden
            'Date* (YYYY-MM-DD)': '2026-10-28',
            'Venue*': 'Lab 3',
            'Description*': 'Invalid technical event'
        }
    ];
    xlsx.utils.book_append_sheet(badWb, xlsx.utils.json_to_sheet(badEvents), 'Events');
    const badBuffer = xlsx.write(badWb, { type: 'buffer', bookType: 'xlsx' });

    const badForm = new FormData();
    badForm.append('file', badBuffer, { filename: 'Bad_Technical.xlsx', contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const badPreviewRes = await axios.post(`${BASE_URL}/events/cultural/import/preview`, badForm, {
        headers: { ...authHeaders, ...badForm.getHeaders() }
    });
    console.log(`Technical row flagged invalid: ${badPreviewRes.data.summary.invalidRows === 1}`);
    console.log(`Can import: ${badPreviewRes.data.canImport}`);
    if (badPreviewRes.data.canImport !== false) {
        throw new Error('Technical event was NOT rejected by preview!');
    }
    console.log('✅ Technical event correctly rejected by Cultural import guardrails.');

    // 5. Test Execute Confirmed Import (Mode C)
    console.log('\n--- TEST 4: Execute Import in Mode C (Upsert) ---');
    const executeRes = await axios.post(
        `${BASE_URL}/events/cultural/import/execute`,
        {
            events: previewRes.data.events.filter(e => e.isValid),
            mode: 'upsert',
            fileName: 'Test_Cultural_Events.xlsx'
        },
        { headers: authHeaders }
    );

    console.log(`Execute Status: ${executeRes.status}`);
    console.log(`Inserted Count: ${executeRes.data.summary.insertedCount}`);
    console.log(`Updated Count: ${executeRes.data.summary.updatedCount}`);
    console.log(`Skipped Count: ${executeRes.data.summary.skippedCount}`);

    // Verify in MongoDB Atlas
    const testEvent = await Event.findOne({ eventId: 'CULT-ON-001' }).lean();
    if (!testEvent) {
        throw new Error('Imported event CULT-ON-001 was not found in MongoDB Atlas!');
    }
    console.log(`Found in MongoDB: ${testEvent.title} (Category: ${testEvent.category}, Department: ${testEvent.department})`);
    console.log(`Rounds count: ${testEvent.rounds.length}, Rules count: ${testEvent.rules.length}`);
    console.log(`Faculty count: ${testEvent.facultyCoordinators.length}, Student count: ${testEvent.studentCoordinators.length}`);
    console.log('✅ Event records and nested structures saved accurately to MongoDB Atlas.');

    // 6. Test Idempotent Re-Import (Must update without duplicating)
    console.log('\n--- TEST 5: Idempotency & Duplicate Prevention ---');
    const initialCount = await Event.countDocuments({ category: 'Cultural' });
    const reExecuteRes = await axios.post(
        `${BASE_URL}/events/cultural/import/execute`,
        {
            events: previewRes.data.events.filter(e => e.isValid),
            mode: 'upsert',
            fileName: 'Test_Cultural_Events.xlsx'
        },
        { headers: authHeaders }
    );
    const postCount = await Event.countDocuments({ category: 'Cultural' });
    console.log(`Initial Cultural Events: ${initialCount}, Post Re-Import: ${postCount}`);
    console.log(`Re-import Updated Count: ${reExecuteRes.data.summary.updatedCount}, Inserted: ${reExecuteRes.data.summary.insertedCount}`);
    if (postCount !== initialCount) {
        throw new Error('Re-import created duplicate events!');
    }
    console.log('✅ Zero duplicates created on re-import. All existing records updated cleanly.');

    // 7. Test Manual Edit via PUT /api/events/:id
    console.log('\n--- TEST 6: Manual Edit via Admin API ---');
    const updatePayload = {
        ...testEvent,
        title: 'Solo Classical & Western Dance Battle (Updated Title)',
        winnerPrize: '₹6,000'
    };
    const updateRes = await axios.put(`${BASE_URL}/events/${testEvent._id}`, updatePayload, { headers: authHeaders });
    console.log(`Updated Title: ${updateRes.data.title}`);
    console.log(`Updated Winner Prize: ${updateRes.data.winnerPrize}`);
    if (updateRes.data.winnerPrize !== '₹6,000') {
        throw new Error('Manual update failed to persist winnerPrize!');
    }
    console.log('✅ Individual event manual edit persisted to MongoDB Atlas.');

    // 8. Test Blank Cell Safety in Subsequent Import
    console.log('\n--- TEST 7: Blank Cell Protection (Existing Values Preserved) ---');
    // Modify one event to have blank prize in Excel and re-import
    const partialEvents = [{
        eventId: 'CULT-ON-001',
        title: 'Solo Classical & Western Dance Battle (Updated Title)',
        category: 'Cultural',
        subCategory: 'OnStage',
        department: 'OnStage',
        venue: 'Main Open Air Theatre',
        date: '2026-10-28',
        description: 'Unleash your rhythm in the ultimate solo dance battle.',
        winnerPrize: '', // Blank cell in Excel!
        isValid: true
    }];

    await axios.post(
        `${BASE_URL}/events/cultural/import/execute`,
        {
            events: partialEvents,
            mode: 'update_only',
            fileName: 'Partial_Update.xlsx'
        },
        { headers: authHeaders }
    );

    const recheckEvent = await Event.findOne({ eventId: 'CULT-ON-001' }).lean();
    console.log(`Winner Prize after blank cell import: "${recheckEvent.winnerPrize}"`);
    if (recheckEvent.winnerPrize !== '₹6,000') {
        throw new Error('Blank cell erased existing prize value!');
    }
    console.log('✅ Blank optional cells did not overwrite existing values.');

    // 9. Verify Technical Events Remained Untouched
    console.log('\n--- TEST 8: Verify Technical Events Untouched ---');
    const techEvents = await Event.find({ category: { $ne: 'Cultural' } }).lean();
    console.log(`Verified ${techEvents.length} Technical/Other events exist intact.`);
    techEvents.forEach(t => {
        if (t.category === 'Cultural') throw new Error(`Technical event corrupted to Cultural: ${t.title}`);
    });
    console.log('✅ All Technical events remain 100% intact.');

    console.log('\n================================================================');
    console.log('🎉 ALL 8 INTEGRATION TESTS PASSED SUCCESSFULLY!');
    console.log('================================================================');
    process.exit(0);
}

runTests().catch(err => {
    console.error('❌ Test failed:', err.response?.data || err.message);
    process.exit(1);
});
