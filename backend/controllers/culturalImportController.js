const xlsx = require('xlsx');
const Event = require('../models/Event');
const SiteConfig = require('../models/SiteConfig');
const Admin = require('../models/Admin');

/**
 * Normalizes Cultural Subcategories to exact database values: 'OnStage' or 'OffStage'
 */
const normalizeCulturalSubcategory = (input) => {
    if (!input || typeof input !== 'string') return null;
    const clean = input.trim().toLowerCase().replace(/[\s\-_]+/g, '');
    if (clean === 'onstage' || clean === 'stage' || clean === 'on') {
        return 'OnStage';
    }
    if (clean === 'offstage' || clean === 'off') {
        return 'OffStage';
    }
    return null;
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
        const d = new Date(Math.round((val - 25569) * 86400 * 1000));
        if (!isNaN(d.getTime())) return d.toISOString();
    }
    const str = String(val).trim();
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
 * Forgiving fuzzy row-value extractor
 */
const getRowVal = (row, ...candidateKeys) => {
    if (!row || typeof row !== 'object') return '';
    for (const key of candidateKeys) {
        if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== '') {
            return String(row[key]).trim();
        }
    }
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
 * 1. Download Cultural Events Excel (with Current DB Data & Columns)
 * @route GET /api/events/cultural/export
 */
const exportCulturalEvents = async (req, res) => {
    try {
        const events = await Event.find({ category: 'Cultural' }).sort({ date: 1 }).lean();

        const wb = xlsx.utils.book_new();

        // 1. Events sheet with event details unrolled across rows (NOT combined into single cells)
        const eventsData = [];
        events.forEach((e, idx) => {
            const evId = e.eventId || `CULT-${((e.subCategory || 'ON').slice(0, 2)).toUpperCase()}-${String(idx + 1).padStart(3, '0')}`;
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
                    'Cultural Category* (On Stage / Off Stage)': e.subCategory === 'OffStage' ? 'Off Stage' : 'On Stage',
                    'Date* (YYYY-MM-DD)': formatDateVal(e.date),
                    'Venue*': e.venue || '',
                    'From Time': e.fromTime || '',
                    'To Time': e.toTime || '',
                    'Winner Prize': e.winnerPrize || '',
                    'Runner Prize': e.runnerPrize || '',
                    'Artist Name': e.artistName || '',
                    'Club Name': e.club || '',
                    'Image URL': e.image || '',
                    'PPT Template URL': e.pptTemplateUrl || '',
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

        const fallbackEvents = [{
            'Event ID*': 'CULT-ON-001',
            'Event Title*': 'Solo Classical & Western Dance Battle',
            'Cultural Category* (On Stage / Off Stage)': 'On Stage',
            'Date* (YYYY-MM-DD)': '2026-10-28',
            'Venue*': 'Main Open Air Theatre',
            'From Time': '10:00 AM',
            'To Time': '01:00 PM',
            'Winner Prize': '₹5,000',
            'Runner Prize': '₹3,000',
            'Club Name': 'Dance Club',
            'Image URL': 'https://ik.imagekit.io/kalam/sample-dance.jpg',
            'PPT Template URL': '',
            'Description*': 'Unleash your rhythm in the ultimate solo dance battle.'
        }];

        const wsEvents = xlsx.utils.json_to_sheet(eventsData.length > 0 ? eventsData : fallbackEvents);
        const wsRounds = xlsx.utils.json_to_sheet(roundsData.length > 0 ? roundsData : [{ 'Event ID*': 'CULT-ON-001', 'Round Number*': 1, 'Round Title*': 'Prelims', 'Description': 'Solo performance' }]);
        const wsRules = xlsx.utils.json_to_sheet(rulesData.length > 0 ? rulesData : [{ 'Event ID*': 'CULT-ON-001', 'Rule Number*': 1, 'Rule Text*': 'Time limit strictly 3 minutes' }]);
        const wsPrizes = xlsx.utils.json_to_sheet(prizesData.length > 0 ? prizesData : [{ 'Event ID*': 'CULT-ON-001', 'Prize Description*': 'Best Costume Trophy' }]);
        const wsFaculty = xlsx.utils.json_to_sheet(facultyData.length > 0 ? facultyData : [{ 'Event ID*': 'CULT-ON-001', 'Name*': 'Dr. S. Meenakshi', 'Phone Number': '9876543210' }]);
        const wsStudent = xlsx.utils.json_to_sheet(studentData.length > 0 ? studentData : [{ 'Event ID*': 'CULT-ON-001', 'Name*': 'R. Vignesh', 'Phone Number': '9123456780' }]);

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
        res.setHeader('Content-Disposition', 'attachment; filename="KALAM_2026_Cultural_Events.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        return res.send(buffer);
    } catch (error) {
        console.error('[CulturalExport] Export error:', error);
        return res.status(500).json({ message: 'Failed to export cultural events', error: error.message });
    }
};

/**
 * 2. Download Official Cultural Events Excel Template
 * @route GET /api/events/cultural/template
 */
const downloadCulturalTemplate = exportCulturalEvents;

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
 * 3. Preview & Validate Cultural Events Excel Workbook
 * @route POST /api/events/cultural/import/preview
 */
const previewCulturalImport = async (req, res) => {
    try {
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ message: 'Please upload a valid .xlsx or .xls file.' });
        }

        const wb = xlsx.read(req.file.buffer, { type: 'buffer', cellDates: true });
        if (!wb.SheetNames || wb.SheetNames.length === 0) {
            return res.status(400).json({ message: 'Workbook is empty or contains no valid worksheets.' });
        }

        const eventsSheetName = wb.SheetNames.find(s => s.toLowerCase() === 'events') || wb.SheetNames[0];
        const rawRows = xlsx.utils.sheet_to_json(wb.Sheets[eventsSheetName], { defval: '' });

        if (!rawRows || rawRows.length === 0) {
            return res.status(400).json({ message: `The '${eventsSheetName}' worksheet does not contain any data rows.` });
        }

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

        const existingEvents = await Event.find({}).lean();

        const parsedEvents = [];
        const errors = [];
        const conflicts = [];
        const seenEventIds = new Set();

        let newCount = 0;
        let updateCount = 0;
        let conflictCount = 0;

        // 1. Group consecutive/matching rows belonging to the same specified cultural event
        const eventGroups = [];
        let currentGroup = null;

        for (let idx = 0; idx < rawRows.length; idx++) {
            const row = rawRows[idx];
            const rowNum = idx + 2;

            const rowEventId = getRowVal(row, 'Event ID*', 'Event ID', 'eventId', 'event_id', 'ID', 'Id');
            const rowTitle = getRowVal(row, 'Event Title*', 'Event Title', 'Title', 'title', 'Event Name', 'Name');

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

        // 2. Process each cultural event group and aggregate multi-row details
        for (const group of eventGroups) {
            const firstRow = group.rows[0].row;
            const rowNum = group.firstRowNum;
            const rowErrors = [];

            const rawEventId = group.rawEventId || getRowVal(firstRow, 'Event ID*', 'Event ID', 'eventId', 'event_id', 'ID', 'Id');
            const title = group.title || getRowVal(firstRow, 'Event Title*', 'Event Title', 'Title', 'title', 'Event Name', 'Name');

            let rawSub = '', rawDate = '', venue = '', fromTime = '', toTime = '';
            let winnerPrize = '', runnerPrize = '', clubName = '', imageUrl = '', pptTemplateUrl = '', description = '', artistName = '';

            for (const rItem of group.rows) {
                const r = rItem.row;
                if (!rawSub) rawSub = getRowVal(r, 'Cultural Category* (On Stage / Off Stage)', 'Cultural Category*', 'Cultural Category', 'Category', 'subCategory', 'department');
                if (!rawDate) rawDate = r['Date* (YYYY-MM-DD)'] || r['Date'] || r['date'] || getRowVal(r, 'Date');
                if (!venue) venue = getRowVal(r, 'Venue*', 'Venue', 'venue', 'Location');
                if (!fromTime) fromTime = getRowVal(r, 'From Time', 'From Time*', 'fromTime', 'Start Time', 'From');
                if (!toTime) toTime = getRowVal(r, 'To Time', 'toTime', 'End Time', 'To');
                if (!winnerPrize) winnerPrize = getRowVal(r, 'Winner Prize', 'winnerPrize', 'First Prize');
                if (!runnerPrize) runnerPrize = getRowVal(r, 'Runner Prize', 'runnerPrize', 'Second Prize');
                if (!artistName) artistName = getRowVal(r, 'Artist Name', 'Artist', 'artistName');
                if (!clubName) clubName = getRowVal(r, 'Club Name', 'Club', 'club');
                if (!imageUrl) imageUrl = getRowVal(r, 'Image URL', 'image', 'imageUrl', 'Photo');
                if (!pptTemplateUrl) pptTemplateUrl = getRowVal(r, 'PPT Template URL', 'pptTemplateUrl', 'PPT URL');
                if (!description) description = getRowVal(r, 'Description*', 'Description', 'description', 'Desc');

                const explicitCategory = String(getRowVal(r, 'Category', 'Department')).toLowerCase();
                if (explicitCategory && explicitCategory.includes('tech') && !explicitCategory.includes('non')) {
                    rowErrors.push('Technical events are forbidden in Cultural Event Import.');
                }
            }

            if (!title) {
                rowErrors.push('Event Title is required.');
            }

            const subCategory = normalizeCulturalSubcategory(String(rawSub)) || 'OnStage';

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

            const eventId = String(rawEventId).trim() || `CULT-${(subCategory || 'ON').slice(0, 2).toUpperCase()}-${String(parsedEvents.length + 1).padStart(3, '0')}`;

            if (seenEventIds.has(eventId.toUpperCase())) {
                rowErrors.push(`Duplicate Event ID "${eventId}" found across separate events in uploaded spreadsheet.`);
            } else {
                seenEventIds.add(eventId.toUpperCase());
            }

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

                if (matchedExisting.category !== 'Cultural') {
                    const conflictMsg = `CRITICAL SCOPE CONFLICT: Matching event "${matchedExisting.title}" belongs to the "${matchedExisting.category}" department. Technical events cannot be overwritten or modified via Cultural Event Import.`;
                    conflicts.push({ rowNumber: rowNum, eventId, title, message: conflictMsg });
                    rowErrors.push(conflictMsg);
                    conflictCount++;
                    status = 'CONFLICT_TECHNICAL';
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

                const rTitle = getRowVal(r, 'Round Title', 'Round Name', 'RoundTitle', 'Round');
                const rDesc = getRowVal(r, 'Round Description', 'Round Desc', 'RoundDescription');
                if (rTitle && !rounds.some(rd => rd.name.trim().toLowerCase() === rTitle.trim().toLowerCase())) {
                    rounds.push({ name: rTitle, description: rDesc || '' });
                }

                const ruleVal = getRowVal(r, 'Rule', 'Rule Text', 'Rules', 'rule');
                if (ruleVal) {
                    ruleVal.split('\n').map(s => s.trim()).filter(Boolean).forEach(rl => {
                        if (!rules.includes(rl)) rules.push(rl);
                    });
                }

                const fcName = getRowVal(r, 'Faculty Coordinator Name', 'Faculty Coordinator', 'Faculty Name', 'FacultyCoord');
                const fcPhone = getRowVal(r, 'Faculty Coordinator Phone', 'Faculty Phone', 'Faculty Mobile');
                if (fcName && !facultyCoordinators.some(c => c.name.trim().toLowerCase() === fcName.trim().toLowerCase())) {
                    facultyCoordinators.push({ name: fcName, phone: fcPhone || '' });
                }

                const scName = getRowVal(r, 'Student Coordinator Name', 'Student Coordinator', 'Student Name', 'StudentCoord');
                const scPhone = getRowVal(r, 'Student Coordinator Phone', 'Student Phone', 'Student Mobile');
                if (scName && !studentCoordinators.some(c => c.name.trim().toLowerCase() === scName.trim().toLowerCase())) {
                    studentCoordinators.push({ name: scName, phone: scPhone || '' });
                }

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
                category: 'Cultural',
                subCategory: subCategory || 'OnStage',
                department: subCategory || 'OnStage',
                eventType: subCategory || 'OnStage',
                date: parsedDate,
                dateFormatted: formatDateVal(parsedDate),
                venue,
                fromTime,
                toTime,
                winnerPrize,
                runnerPrize,
                artistName,
                clubName,
                imageUrl,
                pptTemplateUrl,
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
        console.error('[CulturalImport] Preview error:', error);
        return res.status(500).json({ message: 'Failed to process and validate Excel workbook', error: error.message });
    }
};

/**
 * 4. Execute Confirmed Cultural Events Import (One-Click Save to MongoDB)
 * @route POST /api/events/cultural/import/execute
 */
const executeCulturalImport = async (req, res) => {
    try {
        const { events, mode = 'upsert', fileName = 'Cultural_Upload.xlsx' } = req.body;

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
                if (item.category && item.category !== 'Cultural') {
                    skippedCount++;
                    executionErrors.push(`Event "${item.title}": Skipped because category is not Cultural.`);
                    continue;
                }

                const subCategory = normalizeCulturalSubcategory(item.subCategory || item.department) || 'OnStage';

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

                if (existing && existing.category !== 'Cultural') {
                    skippedCount++;
                    executionErrors.push(`CRITICAL: Skipped "${item.title}" because matching document is a Technical event (${existing.category}).`);
                    continue;
                }

                if (importMode === 'create_only' && existing) {
                    skippedCount++;
                    continue;
                }

                if (importMode === 'update_only' && !existing) {
                    skippedCount++;
                    continue;
                }

                // UPDATE MODE
                if (existing) {
                    existing.title = item.title || existing.title;
                    if (item.eventId) existing.eventId = item.eventId;
                    existing.category = 'Cultural';
                    existing.department = subCategory;
                    existing.subCategory = subCategory;
                    existing.eventType = subCategory;

                    if (item.description && item.description !== '[CLEAR]') existing.description = item.description;
                    if (item.venue && item.venue !== '[CLEAR]') existing.venue = item.venue;
                    if (item.date) existing.date = new Date(item.date);

                    if (item.fromTime !== undefined && item.fromTime !== '') existing.fromTime = item.fromTime === '[CLEAR]' ? '' : item.fromTime;
                    if (item.toTime !== undefined && item.toTime !== '') existing.toTime = item.toTime === '[CLEAR]' ? '' : item.toTime;
                    if (item.winnerPrize !== undefined && item.winnerPrize !== '') existing.winnerPrize = item.winnerPrize === '[CLEAR]' ? '' : item.winnerPrize;
                    if (item.runnerPrize !== undefined && item.runnerPrize !== '') existing.runnerPrize = item.runnerPrize === '[CLEAR]' ? '' : item.runnerPrize;
                    if (item.clubName !== undefined && item.clubName !== '') existing.club = item.clubName === '[CLEAR]' ? '' : item.clubName;
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
                        category: 'Cultural',
                        subCategory: subCategory,
                        department: subCategory,
                        eventType: subCategory,
                        date: new Date(item.date),
                        venue: item.venue,
                        fromTime: item.fromTime || '',
                        toTime: item.toTime || '',
                        timings: item.fromTime && item.toTime ? `${item.fromTime} - ${item.toTime}` : (item.fromTime || ''),
                        winnerPrize: item.winnerPrize || '',
                        runnerPrize: item.runnerPrize || '',
                        club: item.clubName || '',
                        otherPrizes: item.otherPrizes || [],
                        generalPrize: item.otherPrizes || [],
                        image: item.imageUrl || '',
                        pptTemplateUrl: item.pptTemplateUrl || '',
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
                console.error(`[CulturalImport] Row error on "${item.title}":`, err);
                executionErrors.push(`Event "${item.title}": ${err.message}`);
                skippedCount++;
            }
        }

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
            { key: 'last_cultural_events_import' },
            { value: JSON.stringify(importRecord), type: 'text' },
            { upsert: true, new: true }
        );

        return res.json({
            success: true,
            message: `Successfully saved ${insertedCount + updatedCount} Cultural events to MongoDB Atlas (${insertedCount} new, ${updatedCount} updated, ${skippedCount} skipped).`,
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
        console.error('[CulturalImport] Execute error:', error);
        return res.status(500).json({ message: 'Failed to execute event import', error: error.message });
    }
};

/**
 * 5. Get Last Cultural Events Import Stats & Timestamp
 * @route GET /api/events/cultural/import/last
 */
const getLastCulturalImport = async (req, res) => {
    try {
        const config = await SiteConfig.findOne({ key: 'last_cultural_events_import' });
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

module.exports = {
    exportCulturalEvents,
    downloadCulturalTemplate,
    previewCulturalImport,
    executeCulturalImport,
    getLastCulturalImport
};
