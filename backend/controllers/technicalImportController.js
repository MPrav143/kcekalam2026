const xlsx = require('xlsx');
const Event = require('../models/Event');
const SiteConfig = require('../models/SiteConfig');
const Department = require('../models/Department');
const Admin = require('../models/Admin');

/**
 * Normalizes Technical Category and Subcategory/Department
 */
const normalizeTechnicalCategory = (catInput, subInput) => {
    const catClean = String(catInput || '').trim().toLowerCase();
    const subClean = String(subInput || '').trim().toLowerCase();

    // Strict Scope check: Detect Cultural terms
    if (
        catClean.includes('cultur') ||
        subClean.includes('cultur') ||
        subClean.includes('onstage') ||
        subClean.includes('offstage') ||
        subClean.includes('on stage') ||
        subClean.includes('off stage')
    ) {
        return { isCultural: true };
    }

    // Determine category
    let category = 'Technical';
    if (catClean.includes('workshop')) category = 'Workshop';
    else if (catClean.includes('non tech') || catClean.includes('non-tech')) category = 'Non Technical';
    else if (catClean.includes('hackathon')) category = 'Hackathon';
    else if (catClean.includes('paper presentation')) category = 'Paper Presentation';
    else if (catClean.includes('project presentation')) category = 'Project Presentation';
    else if (catClean.includes('ideathon')) category = 'Ideathon';

    // Determine eventType and department
    let eventType = 'Normal';
    let department = 'General';
    let subCategory = 'General';

    if (subClean.includes('hack') || catClean.includes('hack')) {
        eventType = 'Hackathon';
        department = 'HACK';
        subCategory = 'HACK';
    } else if (subClean.includes('paper') || catClean.includes('paper')) {
        eventType = 'Paper Presentation';
        department = 'PAPER';
        subCategory = 'PAPER';
    } else if (subClean.includes('project') || catClean.includes('project')) {
        eventType = 'Project Presentation';
        department = 'PROJECT';
        subCategory = 'PROJECT';
    } else if (subClean.includes('idea') || catClean.includes('idea')) {
        eventType = 'Ideathon';
        department = 'IDEA';
        subCategory = 'IDEA';
    } else if (subInput && String(subInput).trim()) {
        const raw = String(subInput).trim();
        // Parse "CODE - Name" format e.g. "HACK - Hackathon" or "CSE - Computer Science"
        const parts = raw.split(/[-–—:]/);
        const code = parts[0].trim().toUpperCase();
        department = code || 'General';
        subCategory = code || 'General';

        if (parts[1]) {
            const name = parts[1].trim().toLowerCase();
            if (name.includes('hack')) eventType = 'Hackathon';
            else if (name.includes('paper')) eventType = 'Paper Presentation';
            else if (name.includes('project')) eventType = 'Project Presentation';
            else if (name.includes('idea')) eventType = 'Ideathon';
            else if (name.includes('workshop')) eventType = 'Workshop';
        }
    }

    return {
        isCultural: false,
        category,
        eventType,
        department,
        subCategory
    };
};

/**
 * Format a Date object or string to YYYY-MM-DD
 */
const formatDateVal = (dateVal) => {
    if (!dateVal) return '';
    try {
        const d = new Date(dateVal);
        if (!isNaN(d.getTime())) {
            return d.toISOString().split('T')[0];
        }
    } catch (e) { }
    return String(dateVal);
};

/**
 * Robust date parser handling Excel serial dates, Date objects, DD/MM/YYYY and ISO strings
 */
const parseExcelDate = (val) => {
    if (!val) return null;
    if (val instanceof Date && !isNaN(val.getTime())) {
        return val.toISOString();
    }
    if (typeof val === 'number') {
        // Excel serial date to JS Date
        const d = new Date(Math.round((val - 25569) * 86400 * 1000));
        if (!isNaN(d.getTime())) return d.toISOString();
    }
    const str = String(val).trim();
    // Match DD/MM/YYYY or DD-MM-YYYY
    const dmy = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (dmy) {
        const day = parseInt(dmy[1], 10);
        const month = parseInt(dmy[2], 10) - 1;
        const year = parseInt(dmy[3], 10);
        const d = new Date(Date.UTC(year, month, day));
        if (!isNaN(d.getTime())) return d.toISOString();
    }
    const d = new Date(str);
    if (!isNaN(d.getTime())) return d.toISOString();
    return null;
};

/**
 * Forgiving fuzzy row-value extractor (handles case, spaces, asterisks, variations)
 */
const getRowVal = (row, ...candidateKeys) => {
    if (!row || typeof row !== 'object') return '';
    // 1. Direct match
    for (const key of candidateKeys) {
        if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== '') {
            return String(row[key]).trim();
        }
    }
    // 2. Normalized match (lowercase alphanumeric only)
    const normalizedRow = {};
    for (const [k, v] of Object.entries(row)) {
        const normKey = String(k).toLowerCase().replace(/[^a-z0-9]/g, '');
        normalizedRow[normKey] = v;
    }
    for (const key of candidateKeys) {
        const normCand = String(key).toLowerCase().replace(/[^a-z0-9]/g, '');
        if (normalizedRow[normCand] !== undefined && normalizedRow[normCand] !== null && String(normalizedRow[normCand]).trim() !== '') {
            return String(normalizedRow[normCand]).trim();
        }
        for (const [nk, nv] of Object.entries(normalizedRow)) {
            if ((nk.includes(normCand) || normCand.includes(nk)) && nv !== undefined && nv !== null && String(nv).trim() !== '') {
                return String(nv).trim();
            }
        }
    }
    return '';
};

/**
 * 1. Download Technical Events Excel (with Current DB Data & Columns)
 * @route GET /api/events/technical/export
 */
const exportTechnicalEvents = async (req, res) => {
    try {
        const events = await Event.find({ category: { $ne: 'Cultural' } }).sort({ date: 1 }).lean();

        const wb = xlsx.utils.book_new();

        // 1. Events sheet with event details unrolled across rows (NOT combined into single cells)
        const eventsData = [];
        events.forEach((e, idx) => {
            const evId = e.eventId || `TECH-${(e.department || 'GEN').slice(0, 4).toUpperCase()}-${String(idx + 1).padStart(3, '0')}`;
            const rounds = Array.isArray(e.rounds) ? e.rounds : [];
            const rules = Array.isArray(e.rules) ? e.rules : [];
            const faculty = Array.isArray(e.facultyCoordinators) ? e.facultyCoordinators : [];
            const student = Array.isArray(e.studentCoordinators) ? e.studentCoordinators : [];
            const prizes = Array.isArray(e.otherPrizes) ? e.otherPrizes : (Array.isArray(e.generalPrize) ? e.generalPrize : []);

            const maxRows = Math.max(1, rounds.length, rules.length, faculty.length, student.length, prizes.length);

            for (let rIdx = 0; rIdx < maxRows; rIdx++) {
                eventsData.push({
                    'Event ID*': evId,
                    'Event Title*': e.title || '',
                    'Category* (Technical / Workshop / Non Technical)': e.category || 'Technical',
                    'Subcategory / Department* (e.g. HACK / PAPER / General)': e.department || e.subCategory || 'General',
                    'Date* (YYYY-MM-DD)': formatDateVal(e.date),
                    'Venue*': e.venue || '',
                    'From Time*': e.fromTime || '',
                    'To Time': e.toTime || '',
                    'Winner Prize': e.winnerPrize || '',
                    'Runner Prize': e.runnerPrize || '',
                    'Image URL': e.image || '',
                    'PPT Template URL': e.pptTemplateUrl || '',
                    'Themes / Topics': Array.isArray(e.theme) ? e.theme.join(', ') : (e.theme || ''),
                    'Description*': e.description || e.eventDescription || '',
                    'Round Title': rounds[rIdx]?.name || '',
                    'Round Description': rounds[rIdx]?.description || '',
                    'Rule': typeof rules[rIdx] === 'string' ? rules[rIdx] : (rules[rIdx]?.text || ''),
                    'Faculty Coordinator Name': faculty[rIdx]?.name || '',
                    'Faculty Coordinator Phone': faculty[rIdx]?.phone || '',
                    'Student Coordinator Name': student[rIdx]?.name || '',
                    'Student Coordinator Phone': student[rIdx]?.phone || '',
                    'Other Prize': prizes[rIdx] || ''
                });
            }
        });

        // 2. Rounds sheet
        const roundsData = [];
        events.forEach(e => {
            const evId = e.eventId || e.title;
            if (Array.isArray(e.rounds)) {
                e.rounds.forEach((r, idx) => {
                    roundsData.push({
                        'Event ID*': evId,
                        'Round Number*': idx + 1,
                        'Round Title*': r.name || `Round ${idx + 1}`,
                        'Description': r.description || ''
                    });
                });
            }
        });

        // 3. Rules sheet
        const rulesData = [];
        events.forEach(e => {
            const evId = e.eventId || e.title;
            if (Array.isArray(e.rules)) {
                e.rules.forEach((rl, idx) => {
                    rulesData.push({
                        'Event ID*': evId,
                        'Rule Number*': idx + 1,
                        'Rule Text*': typeof rl === 'string' ? rl : String(rl)
                    });
                });
            }
        });

        // 4. OtherPrizes sheet
        const prizesData = [];
        events.forEach(e => {
            const evId = e.eventId || e.title;
            const prizes = e.otherPrizes || e.generalPrize || [];
            prizes.forEach(p => {
                prizesData.push({
                    'Event ID*': evId,
                    'Prize Description*': p
                });
            });
        });

        // 5. FacultyCoordinators sheet
        const facultyData = [];
        events.forEach(e => {
            const evId = e.eventId || e.title;
            (e.facultyCoordinators || []).forEach(c => {
                facultyData.push({
                    'Event ID*': evId,
                    'Name*': c.name || '',
                    'Phone Number': c.phone || ''
                });
            });
        });

        // 6. StudentCoordinators sheet
        const studentData = [];
        events.forEach(e => {
            const evId = e.eventId || e.title;
            (e.studentCoordinators || []).forEach(c => {
                studentData.push({
                    'Event ID*': evId,
                    'Name*': c.name || '',
                    'Phone Number': c.phone || ''
                });
            });
        });

        const fallbackEventRow = [{
            'Event ID*': 'TECH-HACK-001',
            'Event Title*': 'CodeStorm 24-Hour National Hackathon',
            'Category* (Technical / Workshop / Non Technical)': 'Technical',
            'Subcategory / Department* (e.g. HACK / PAPER / General)': 'HACK - Hackathon',
            'Date* (YYYY-MM-DD)': '2026-10-28',
            'Venue*': 'High Performance Computing Lab A',
            'From Time*': '09:00 AM',
            'To Time': '05:00 PM',
            'Winner Prize': '₹25,000',
            'Runner Prize': '₹15,000',
            'Image URL': 'https://ik.imagekit.io/kalam/sample-hackathon.jpg',
            'PPT Template URL': '',
            'Themes / Topics (comma-separated)': 'AI & ML, Web3',
            'Description*': 'Flagship technical hackathon competition.'
        }];

        const wsEvents = xlsx.utils.json_to_sheet(eventsData.length > 0 ? eventsData : fallbackEventRow);
        const wsRounds = xlsx.utils.json_to_sheet(roundsData.length > 0 ? roundsData : [{ 'Event ID*': 'TECH-HACK-001', 'Round Number*': 1, 'Round Title*': 'Idea Pitch', 'Description': '5-minute pitch' }]);
        const wsRules = xlsx.utils.json_to_sheet(rulesData.length > 0 ? rulesData : [{ 'Event ID*': 'TECH-HACK-001', 'Rule Number*': 1, 'Rule Text*': 'Teams of 2 to 4' }]);
        const wsPrizes = xlsx.utils.json_to_sheet(prizesData.length > 0 ? prizesData : [{ 'Event ID*': 'TECH-HACK-001', 'Prize Description*': 'Best UI/UX Award' }]);
        const wsFaculty = xlsx.utils.json_to_sheet(facultyData.length > 0 ? facultyData : [{ 'Event ID*': 'TECH-HACK-001', 'Name*': 'Dr. Senthil Kumar', 'Phone Number': '9842112233' }]);
        const wsStudent = xlsx.utils.json_to_sheet(studentData.length > 0 ? studentData : [{ 'Event ID*': 'TECH-HACK-001', 'Name*': 'Arun Prasad', 'Phone Number': '9123412341' }]);

        // Auto-fit column widths
        const setWidths = (ws) => {
            const range = xlsx.utils.decode_range(ws['!ref'] || 'A1:R1');
            const colWidths = [];
            for (let c = range.s.c; c <= range.e.c; ++c) {
                colWidths.push({ wch: 28 });
            }
            ws['!cols'] = colWidths;
        };
        [wsEvents, wsRounds, wsRules, wsPrizes, wsFaculty, wsStudent].forEach(setWidths);

        xlsx.utils.book_append_sheet(wb, wsEvents, 'Events');
        xlsx.utils.book_append_sheet(wb, wsRounds, 'Rounds');
        xlsx.utils.book_append_sheet(wb, wsRules, 'Rules');
        xlsx.utils.book_append_sheet(wb, wsPrizes, 'OtherPrizes');
        xlsx.utils.book_append_sheet(wb, wsFaculty, 'FacultyCoordinators');
        xlsx.utils.book_append_sheet(wb, wsStudent, 'StudentCoordinators');

        const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
        res.setHeader('Content-Disposition', 'attachment; filename="KALAM_2026_Technical_Events.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        return res.send(buffer);
    } catch (error) {
        console.error('[TechnicalExport] Export error:', error);
        return res.status(500).json({ message: 'Failed to export technical events', error: error.message });
    }
};

/**
 * 2. Download Official Technical Excel Template
 * @route GET /api/events/technical/template
 */
const downloadTechnicalTemplate = exportTechnicalEvents;

/**
 * Helper to parse and extract relational items from a workbook sheet
 */
const extractRelationalSheet = (wb, sheetName, keyCol, valCols) => {
    const sheet = wb.Sheets[sheetName];
    if (!sheet) return {};
    const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });
    const map = {};

    rows.forEach((row) => {
        const rawEventId = getRowVal(row, keyCol, 'Event ID', 'Event ID*', 'event_id', 'eventId', 'ID', 'Id');
        if (!rawEventId) return;
        const eventId = String(rawEventId).trim().toUpperCase();

        if (!map[eventId]) map[eventId] = [];

        if (typeof valCols === 'function') {
            const item = valCols(row);
            if (item) map[eventId].push(item);
        } else if (typeof valCols === 'string') {
            const val = getRowVal(row, valCols, 'Prize Description*', 'Prize Description', 'Rule Text*', 'Rule Text', 'Rule', 'rule', 'Prize', 'prize');
            if (val) map[eventId].push(val);
        }
    });

    return map;
};

/**
 * 3. Preview & Validate Technical Events Excel Workbook
 * @route POST /api/events/technical/import/preview
 */
const previewTechnicalImport = async (req, res) => {
    try {
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ message: 'Please upload a valid .xlsx or .xls file.' });
        }

        const wb = xlsx.read(req.file.buffer, { type: 'buffer', cellDates: true });
        if (!wb.SheetNames || wb.SheetNames.length === 0) {
            return res.status(400).json({ message: 'Workbook is empty or contains no valid worksheets.' });
        }

        // Locate main Events sheet (or first sheet)
        const eventsSheetName = wb.SheetNames.find(s => s.toLowerCase() === 'events') || wb.SheetNames[0];
        const rawRows = xlsx.utils.sheet_to_json(wb.Sheets[eventsSheetName], { defval: '' });

        if (!rawRows || rawRows.length === 0) {
            return res.status(400).json({ message: `The '${eventsSheetName}' worksheet does not contain any data rows.` });
        }

        // Extract nested sheets if present
        const roundsMap = extractRelationalSheet(wb, 'Rounds', 'Event ID*', (r) => {
            const name = getRowVal(r, 'Round Title*', 'Round Title', 'Round Name', 'title', 'Round');
            const desc = getRowVal(r, 'Description', 'desc', 'Round Description');
            return name ? { name, description: desc } : null;
        });

        const rulesMap = extractRelationalSheet(wb, 'Rules', 'Event ID*', (r) => {
            const rule = getRowVal(r, 'Rule Text*', 'Rule Text', 'Rule', 'rule');
            return rule || null;
        });

        const prizesMap = extractRelationalSheet(wb, 'OtherPrizes', 'Event ID*', (r) => {
            const prize = getRowVal(r, 'Prize Description*', 'Prize Description', 'Prize', 'prize');
            return prize || null;
        });

        const facultyMap = extractRelationalSheet(wb, 'FacultyCoordinators', 'Event ID*', (r) => {
            const name = getRowVal(r, 'Name*', 'Name', 'Faculty Name');
            const phone = getRowVal(r, 'Phone Number', 'Phone', 'Mobile');
            return name ? { name, phone } : null;
        });

        const studentMap = extractRelationalSheet(wb, 'StudentCoordinators', 'Event ID*', (r) => {
            const name = getRowVal(r, 'Name*', 'Name', 'Student Name');
            const phone = getRowVal(r, 'Phone Number', 'Phone', 'Mobile');
            return name ? { name, phone } : null;
        });

        // Fetch all existing events from DB for matching & conflict detection
        const existingEvents = await Event.find({}).lean();

        const parsedEvents = [];
        const errors = [];
        const conflicts = [];
        const seenEventIds = new Set();

        let newCount = 0;
        let updateCount = 0;
        let conflictCount = 0;

        // 1. Group consecutive/matching rows belonging to the same specified event
        const eventGroups = [];
        let currentGroup = null;

        for (let idx = 0; idx < rawRows.length; idx++) {
            const row = rawRows[idx];
            const rowNum = idx + 2;

            const rowEventId = getRowVal(row, 'Event ID*', 'Event ID', 'eventId', 'event_id', 'ID', 'Id');
            const rowTitle = getRowVal(row, 'Event Title*', 'Event Title', 'Title', 'title', 'Event Name', 'Name');

            // A row is a continuation of currentGroup if:
            // 1. currentGroup exists AND:
            //    a) rowEventId matches currentGroup.rawEventId (case-insensitive) OR
            //    b) (rowEventId is empty AND rowTitle matches currentGroup.title) OR
            //    c) (rowEventId is empty AND rowTitle is empty) -> continuation row for current event!
            const isSameId = currentGroup && rowEventId && currentGroup.rawEventId &&
                rowEventId.trim().toUpperCase() === currentGroup.rawEventId.trim().toUpperCase();

            const isSameTitle = currentGroup && !rowEventId && rowTitle && currentGroup.title &&
                rowTitle.trim().toLowerCase() === currentGroup.title.trim().toLowerCase();

            const isBlankContinuation = currentGroup && !rowEventId && !rowTitle;

            if (currentGroup && (isSameId || isSameTitle || isBlankContinuation)) {
                currentGroup.rows.push({ row, rowNum });
            } else {
                currentGroup = {
                    firstRowNum: rowNum,
                    rawEventId: rowEventId.trim(),
                    title: rowTitle.trim(),
                    rows: [{ row, rowNum }]
                };
                eventGroups.push(currentGroup);
            }
        }

        // 2. Process each event group and aggregate multi-row details
        for (const group of eventGroups) {
            const firstRow = group.rows[0].row;
            const rowNum = group.firstRowNum;
            const rowErrors = [];

            // Primary metadata from first row (fallback to other rows if missing)
            const rawEventId = group.rawEventId || getRowVal(firstRow, 'Event ID*', 'Event ID', 'eventId', 'event_id', 'ID', 'Id');
            const title = group.title || getRowVal(firstRow, 'Event Title*', 'Event Title', 'Title', 'title', 'Event Name', 'Name');

            let rawCat = '', rawSub = '', rawDate = '', venue = '', fromTime = '', toTime = '';
            let winnerPrize = '', runnerPrize = '', imageUrl = '', pptTemplateUrl = '', description = '', rawThemes = '';

            for (const rItem of group.rows) {
                const r = rItem.row;
                if (!rawCat) rawCat = getRowVal(r, 'Category* (Technical / Workshop / Non Technical)', 'Category*', 'Category', 'category');
                if (!rawSub) rawSub = getRowVal(r, 'Subcategory / Department* (e.g. HACK / PAPER / General)', 'Subcategory / Department*', 'Subcategory', 'Department', 'department', 'subCategory');
                if (!rawDate) rawDate = r['Date* (YYYY-MM-DD)'] || r['Date'] || r['date'] || getRowVal(r, 'Date');
                if (!venue) venue = getRowVal(r, 'Venue*', 'Venue', 'venue', 'Location');
                if (!fromTime) fromTime = getRowVal(r, 'From Time*', 'From Time', 'fromTime', 'Start Time', 'From', 'Timing');
                if (!toTime) toTime = getRowVal(r, 'To Time', 'toTime', 'End Time', 'To');
                if (!winnerPrize) winnerPrize = getRowVal(r, 'Winner Prize', 'winnerPrize', 'First Prize', '1st Prize');
                if (!runnerPrize) runnerPrize = getRowVal(r, 'Runner Prize', 'runnerPrize', 'Second Prize', '2nd Prize');
                if (!imageUrl) imageUrl = getRowVal(r, 'Image URL', 'image', 'imageUrl', 'Photo');
                if (!pptTemplateUrl) pptTemplateUrl = getRowVal(r, 'PPT Template URL', 'pptTemplateUrl', 'PPT URL');
                if (!description) description = getRowVal(r, 'Description*', 'Description', 'description', 'Desc', 'About Event');
                if (!rawThemes) rawThemes = getRowVal(r, 'Themes / Topics (comma-separated)', 'Themes / Topics', 'Themes', 'theme', 'Topics');
            }

            rawCat = rawCat || 'Technical';

            // Scope & Normalization check
            const normResult = normalizeTechnicalCategory(rawCat, rawSub);
            if (normResult.isCultural) {
                const msg = `Cultural events and subcategories (On Stage / Off Stage) are strictly forbidden in Technical Event Import. Please use the Cultural Event Importer.`;
                rowErrors.push(msg);
            }

            // Required field validations
            if (!title) {
                rowErrors.push('Event Title is required.');
            }

            const parsedDate = parseExcelDate(rawDate);
            if (!parsedDate) {
                rowErrors.push(`Date is required (YYYY-MM-DD or DD/MM/YYYY). Received: "${rawDate || ''}"`);
            }

            if (!venue) {
                rowErrors.push('Venue is required.');
            }

            if (!description) {
                rowErrors.push('Description is required.');
            }

            const effectiveDept = normResult.department || 'General';
            const eventId = String(rawEventId).trim() || `TECH-${effectiveDept.slice(0, 4).toUpperCase()}-${String(parsedEvents.length + 1).padStart(3, '0')}`;

            // Check duplicate eventId across different event groups
            if (seenEventIds.has(eventId.toUpperCase())) {
                rowErrors.push(`Duplicate Event ID "${eventId}" found across separate events in uploaded spreadsheet.`);
            } else {
                seenEventIds.add(eventId.toUpperCase());
            }

            // Match against existing database events
            const normTitle = title.toLowerCase().replace(/\s+/g, '');
            const matchedExisting = existingEvents.find(e =>
                (e.eventId && e.eventId.toUpperCase() === eventId.toUpperCase()) ||
                (rawEventId && e._id.toString() === rawEventId) ||
                (e.title && e.title.toLowerCase().replace(/\s+/g, '') === normTitle)
            );

            let status = 'NEW';
            let matchedId = null;

            if (matchedExisting) {
                matchedId = matchedExisting._id.toString();
                if (matchedExisting.category === 'Cultural') {
                    const conflictMsg = `CRITICAL SCOPE CONFLICT: Matching event "${matchedExisting.title}" belongs to the "Cultural" department. Cultural events cannot be overwritten or modified via Technical Event Import.`;
                    conflicts.push({ rowNumber: rowNum, eventId, title, message: conflictMsg });
                    rowErrors.push(conflictMsg);
                    conflictCount++;
                    status = 'CONFLICT_CULTURAL';
                } else {
                    status = 'UPDATE';
                    updateCount++;
                }
            } else {
                status = 'NEW';
                newCount++;
            }

            // Collect rounds, rules, coordinators, and prizes from ALL rows of this specified event!
            const rounds = [];
            const rules = [];
            const facultyCoordinators = [];
            const studentCoordinators = [];
            const otherPrizes = [];

            for (const rItem of group.rows) {
                const r = rItem.row;

                // Round from this row
                const rTitle = getRowVal(r, 'Round Title', 'Round Name', 'RoundTitle', 'Round');
                const rDesc = getRowVal(r, 'Round Description', 'Round Desc', 'RoundDescription');
                if (rTitle && !rounds.some(rd => rd.name.trim().toLowerCase() === rTitle.trim().toLowerCase())) {
                    rounds.push({ name: rTitle, description: rDesc || '' });
                }

                // Rule from this row
                const ruleVal = getRowVal(r, 'Rule', 'Rule Text', 'Rules', 'rule');
                if (ruleVal) {
                    ruleVal.split('\n').map(s => s.trim()).filter(Boolean).forEach(rl => {
                        if (!rules.includes(rl)) rules.push(rl);
                    });
                }

                // Faculty Coord from this row
                const fcName = getRowVal(r, 'Faculty Coordinator Name', 'Faculty Coordinator', 'Faculty Name', 'FacultyCoord');
                const fcPhone = getRowVal(r, 'Faculty Coordinator Phone', 'Faculty Phone', 'Faculty Mobile');
                if (fcName && !facultyCoordinators.some(c => c.name.trim().toLowerCase() === fcName.trim().toLowerCase())) {
                    facultyCoordinators.push({ name: fcName, phone: fcPhone || '' });
                }

                // Student Coord from this row
                const scName = getRowVal(r, 'Student Coordinator Name', 'Student Coordinator', 'Student Name', 'StudentCoord');
                const scPhone = getRowVal(r, 'Student Coordinator Phone', 'Student Phone', 'Student Mobile');
                if (scName && !studentCoordinators.some(c => c.name.trim().toLowerCase() === scName.trim().toLowerCase())) {
                    studentCoordinators.push({ name: scName, phone: scPhone || '' });
                }

                // Other prize from this row
                const prizeVal = getRowVal(r, 'Other Prize', 'Other Prizes', 'Prize Description', 'Special Prize');
                if (prizeVal && !otherPrizes.includes(prizeVal)) {
                    otherPrizes.push(prizeVal);
                }
            }

            // Fall back to separate relational sheets ONLY if main sheet did not provide these details
            const eventIdUpper = eventId.toUpperCase();
            if (rounds.length === 0 && roundsMap[eventIdUpper]?.length) {
                rounds.push(...roundsMap[eventIdUpper]);
            }
            if (rules.length === 0 && rulesMap[eventIdUpper]?.length) {
                rules.push(...rulesMap[eventIdUpper]);
            }
            if (facultyCoordinators.length === 0 && facultyMap[eventIdUpper]?.length) {
                facultyCoordinators.push(...facultyMap[eventIdUpper]);
            }
            if (studentCoordinators.length === 0 && studentMap[eventIdUpper]?.length) {
                studentCoordinators.push(...studentMap[eventIdUpper]);
            }
            if (otherPrizes.length === 0 && prizesMap[eventIdUpper]?.length) {
                otherPrizes.push(...prizesMap[eventIdUpper]);
            }

            const themeList = rawThemes
                ? rawThemes.split(',').map(t => t.trim()).filter(Boolean)
                : [];

            const rowNumbers = group.rows.map(r => r.rowNum);
            const rowRange = rowNumbers.length > 1
                ? `Rows ${rowNumbers[0]}-${rowNumbers[rowNumbers.length - 1]}`
                : `Row ${rowNumbers[0]}`;

            const eventItem = {
                rowNumber: rowNum,
                rowNumbers,
                rowRange,
                totalEventRows: group.rows.length,
                eventId,
                title,
                category: normResult.category,
                subCategory: normResult.subCategory,
                department: normResult.department,
                eventType: normResult.eventType,
                date: parsedDate,
                dateFormatted: formatDateVal(parsedDate),
                venue,
                fromTime,
                toTime,
                timings: fromTime && toTime ? `${fromTime} - ${toTime}` : fromTime,
                winnerPrize,
                runnerPrize,
                imageUrl,
                pptTemplateUrl,
                theme: themeList,
                description,
                rounds,
                rules,
                otherPrizes,
                facultyCoordinators,
                studentCoordinators,
                status,
                matchedExistingId: matchedId,
                isValid: rowErrors.length === 0,
                errors: rowErrors
            };

            if (rowErrors.length > 0) {
                errors.push({ rowNumber: rowNum, rowRange, eventId, title, errors: rowErrors });
            }

            parsedEvents.push(eventItem);
        }

        const validRowsCount = parsedEvents.filter(e => e.isValid).length;
        const invalidRowsCount = parsedEvents.length - validRowsCount;

        return res.json({
            success: true,
            fileName: req.file.originalname,
            fileSize: req.file.size,
            fileSizeFormatted: `${(req.file.size / 1024).toFixed(1)} KB`,
            sheets: wb.SheetNames,
            summary: {
                totalRows: parsedEvents.length,
                validRows: validRowsCount,
                invalidRows: invalidRowsCount,
                newCount,
                updateCount,
                conflictCount
            },
            events: parsedEvents,
            errors,
            conflicts,
            canImport: validRowsCount > 0 && conflictCount === 0
        });
    } catch (error) {
        console.error('[TechnicalImport] Preview error:', error);
        return res.status(500).json({ message: 'Failed to process and validate Excel workbook', error: error.message });
    }
};

/**
 * 4. Execute Confirmed Technical Events Import (One-Click Save to MongoDB)
 * @route POST /api/events/technical/import/execute
 */
const executeTechnicalImport = async (req, res) => {
    try {
        const { events, mode = 'upsert', fileName = 'Technical_Upload.xlsx' } = req.body;

        if (!Array.isArray(events) || events.length === 0) {
            return res.status(400).json({ message: 'No event records provided for import execution.' });
        }

        const importMode = ['create_only', 'update_only', 'upsert'].includes(mode) ? mode : 'upsert';

        let insertedCount = 0;
        let updatedCount = 0;
        let skippedCount = 0;
        const executionErrors = [];
        const processedEvents = [];

        let defaultAdmin = await Admin.findOne({ role: 'admin' });
        if (!defaultAdmin) defaultAdmin = await Admin.findOne({});
        const adminId = req.admin?._id || defaultAdmin?._id;

        for (const item of events) {
            try {
                // Backend Scope Enforcement: Must NOT be Cultural
                if (item.category === 'Cultural') {
                    skippedCount++;
                    executionErrors.push(`Event "${item.title}": Skipped because category is Cultural.`);
                    continue;
                }

                // Check for match in DB
                let existing = null;
                if (item.matchedExistingId) {
                    existing = await Event.findById(item.matchedExistingId);
                } else {
                    existing = await Event.findOne({
                        $or: [
                            { eventId: item.eventId },
                            { title: new RegExp(`^${item.title.trim()}$`, 'i') },
                            { slug: item.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').trim() }
                        ]
                    });
                }

                // Mandatory Cultural Event Protection: Never overwrite Cultural events!
                if (existing && existing.category === 'Cultural') {
                    skippedCount++;
                    executionErrors.push(`CRITICAL: Skipped "${item.title}" because matching document is a Cultural event.`);
                    continue;
                }

                // Apply Mode Rules
                if (importMode === 'create_only' && existing) {
                    skippedCount++;
                    continue;
                }

                if (importMode === 'update_only' && !existing) {
                    skippedCount++;
                    continue;
                }

                // UPDATE MODE (Preserves unsupplied fields & blank cells)
                if (existing) {
                    existing.title = item.title || existing.title;
                    if (item.eventId) existing.eventId = item.eventId;

                    if (item.category && item.category !== 'Cultural') existing.category = item.category;
                    if (item.department && item.department !== '[CLEAR]') existing.department = item.department;
                    if (item.subCategory && item.subCategory !== '[CLEAR]') existing.subCategory = item.subCategory;
                    if (item.eventType && item.eventType !== '[CLEAR]') existing.eventType = item.eventType;

                    if (item.description && item.description !== '[CLEAR]') existing.description = item.description;
                    if (item.venue && item.venue !== '[CLEAR]') existing.venue = item.venue;
                    if (item.date) existing.date = new Date(item.date);

                    if (item.fromTime !== undefined && item.fromTime !== '') existing.fromTime = item.fromTime === '[CLEAR]' ? '' : item.fromTime;
                    if (item.toTime !== undefined && item.toTime !== '') existing.toTime = item.toTime === '[CLEAR]' ? '' : item.toTime;
                    if (existing.fromTime || existing.toTime) {
                        existing.timings = `${existing.fromTime || ''} - ${existing.toTime || ''}`.trim();
                    }

                    if (item.winnerPrize !== undefined && item.winnerPrize !== '') existing.winnerPrize = item.winnerPrize === '[CLEAR]' ? '' : item.winnerPrize;
                    if (item.runnerPrize !== undefined && item.runnerPrize !== '') existing.runnerPrize = item.runnerPrize === '[CLEAR]' ? '' : item.runnerPrize;
                    if (item.imageUrl !== undefined && item.imageUrl !== '') existing.image = item.imageUrl === '[CLEAR]' ? '' : item.imageUrl;
                    if (item.pptTemplateUrl !== undefined && item.pptTemplateUrl !== '') existing.pptTemplateUrl = item.pptTemplateUrl === '[CLEAR]' ? '' : item.pptTemplateUrl;

                    if (Array.isArray(item.rounds) && item.rounds.length > 0) existing.rounds = item.rounds;
                    if (Array.isArray(item.rules) && item.rules.length > 0) existing.rules = item.rules;
                    if (Array.isArray(item.otherPrizes) && item.otherPrizes.length > 0) {
                        existing.otherPrizes = item.otherPrizes;
                        existing.generalPrize = item.otherPrizes;
                    }
                    if (Array.isArray(item.facultyCoordinators) && item.facultyCoordinators.length > 0) existing.facultyCoordinators = item.facultyCoordinators;
                    if (Array.isArray(item.studentCoordinators) && item.studentCoordinators.length > 0) existing.studentCoordinators = item.studentCoordinators;
                    if (Array.isArray(item.theme) && item.theme.length > 0) existing.theme = item.theme;

                    existing.version = (existing.version || 1) + 1;
                    existing.lastImportedAt = new Date();

                    await existing.save();
                    updatedCount++;
                    processedEvents.push({ id: existing._id, title: existing.title, eventId: existing.eventId, action: 'UPDATED' });
                } else {
                    // CREATE MODE
                    const newEvent = new Event({
                        eventId: item.eventId,
                        title: item.title,
                        description: item.description,
                        category: item.category || 'Technical',
                        subCategory: item.subCategory || 'General',
                        department: item.department || 'General',
                        eventType: item.eventType || 'Normal',
                        date: new Date(item.date),
                        venue: item.venue,
                        fromTime: item.fromTime || '',
                        toTime: item.toTime || '',
                        timings: item.fromTime && item.toTime ? `${item.fromTime} - ${item.toTime}` : (item.fromTime || ''),
                        winnerPrize: item.winnerPrize || '',
                        runnerPrize: item.runnerPrize || '',
                        otherPrizes: item.otherPrizes || [],
                        generalPrize: item.otherPrizes || [],
                        image: item.imageUrl || '',
                        pptTemplateUrl: item.pptTemplateUrl || '',
                        theme: item.theme || [],
                        rounds: item.rounds || [],
                        rules: item.rules || [],
                        facultyCoordinators: item.facultyCoordinators || [],
                        studentCoordinators: item.studentCoordinators || [],
                        registrationFee: 0,
                        createdBy: adminId,
                        lastImportedAt: new Date()
                    });

                    await newEvent.save();
                    insertedCount++;
                    processedEvents.push({ id: newEvent._id, title: newEvent.title, eventId: newEvent.eventId, action: 'INSERTED' });
                }
            } catch (err) {
                console.error(`[TechnicalImport] Row error on "${item.title}":`, err);
                executionErrors.push(`Event "${item.title}": ${err.message}`);
                skippedCount++;
            }
        }

        // Record Last Successful Technical Import metadata in SiteConfig
        const importRecord = {
            timestamp: new Date().toISOString(),
            fileName,
            mode: importMode,
            insertedCount,
            updatedCount,
            skippedCount,
            totalRows: events.length,
            adminEmail: req.admin?.email || 'admin'
        };

        await SiteConfig.findOneAndUpdate(
            { key: 'last_technical_events_import' },
            { value: JSON.stringify(importRecord), type: 'text' },
            { upsert: true, new: true }
        );

        return res.json({
            success: true,
            message: `Successfully saved ${insertedCount + updatedCount} Technical events to MongoDB Atlas (${insertedCount} new, ${updatedCount} updated, ${skippedCount} skipped).`,
            summary: {
                mode: importMode,
                totalRows: events.length,
                insertedCount,
                updatedCount,
                skippedCount,
                errors: executionErrors
            },
            processedEvents,
            lastImport: importRecord
        });
    } catch (error) {
        console.error('[TechnicalImport] Execute error:', error);
        return res.status(500).json({ message: 'Failed to execute event import', error: error.message });
    }
};

/**
 * 5. Get Last Technical Events Import Stats & Timestamp
 * @route GET /api/events/technical/import/last
 */
const getLastTechnicalImport = async (req, res) => {
    try {
        const config = await SiteConfig.findOne({ key: 'last_technical_events_import' });
        if (!config || !config.value) {
            return res.json({ success: true, lastImport: null });
        }
        let parsed = null;
        try {
            parsed = JSON.parse(config.value);
        } catch (e) {
            parsed = { raw: config.value };
        }
        return res.json({ success: true, lastImport: parsed });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to retrieve last import stats', error: error.message });
    }
};

/**
 * 6. Get All Technical Events
 * @route GET /api/technical-events
 */
const getTechnicalEvents = async (req, res) => {
    try {
        const events = await Event.find({ category: { $ne: 'Cultural' } }).sort({ date: 1 }).lean();
        res.set('Cache-Control', 'public, max-age=120, s-maxage=300, stale-while-revalidate=600');
        return res.json(events);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    exportTechnicalEvents,
    downloadTechnicalTemplate,
    previewTechnicalImport,
    executeTechnicalImport,
    getLastTechnicalImport,
    getTechnicalEvents
};
