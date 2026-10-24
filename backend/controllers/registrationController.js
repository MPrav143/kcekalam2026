const Registration = require('../models/Registration');
const Event = require('../models/Event');
const axios = require('axios');
const { Parser } = require('json2csv');
const { sendRegistrationEmail } = require('../utils/email');

// @desc    Register for an event
// @route   POST /api/registrations
// @access  Public
// @desc    Register for a Pass with selected Events
// @route   POST /api/registrations
// @access  Public
const registerForEvent = async (req, res) => {
    try {
        const { passId, eventIds, studentName, rollNumber, email, phone, department, year, college, district } = req.body;

        // 1. Fetch Pass
        const Pass = require('../models/Pass');
        const pass = await Pass.findById(passId);
        if (!pass) {
            return res.status(404).json({ message: 'Pass not found' });
        }

        // 2. Fetch Selected Events
        const events = await Event.find({ _id: { $in: eventIds } });
        if (events.length !== eventIds.length) {
            return res.status(400).json({ message: 'One or more invalid event IDs found' });
        }

        // 3. Generate Custom Ticket ID
        let prefix = 'K'; // Default
        const passName = pass.name.toLowerCase();

        if (passName.includes('standard')) prefix = 'ST';
        else if (passName.includes('elite')) prefix = 'E';
        else if (passName.includes('pro')) prefix = 'P';
        else if (passName.includes('kalam')) prefix = 'K';
        else if (passName.includes('cultural')) prefix = 'C';

        const randomNum = Math.floor(100000 + Math.random() * 900000); // 6 digit random number
        const ticketId = `${prefix}${randomNum}`;

        // 4. Generate QR Code
        const QRCode = require('qrcode');
        const qrCodeData = await QRCode.toDataURL(ticketId);

        // 5. Determine Amount
        let amountToPay = pass.price;

        // 6. Check Payment Status
        const enablePayment = process.env.ENABLE_PAYMENT === 'true';
        const initialStatus = enablePayment ? 'Pending' : 'Completed';

        // 7. Create Registration
        const registration = new Registration({
            pass: passId,
            events: eventIds,
            studentName,
            rollNumber,
            email,
            phone,
            department,
            year,
            college,
            district,
            amount: amountToPay,
            paymentStatus: initialStatus,
            ticketId: ticketId,
            qrCode: qrCodeData
        });

        const savedRegistration = await registration.save();

        // 6. Log to Google Sheet (if payment bypassed)
        if (!enablePayment) {
            const { logToSheet } = require('../utils/googleSheets');
            await logToSheet({
                email,
                studentName,
                rollNumber,
                year,
                department,
                phone,
                college,
                district,
                passName: pass.name,
                passId: passId,
                amount: amountToPay,
                paymentStatus: 'Bypassed/Completed',
                ticketId: ticketId,
                qrCode: qrCodeData
            });
        }

        res.status(201).json({
            message: enablePayment ? 'Registration initiated' : 'Registration Completed',
            registrationId: savedRegistration._id,
            ticketId: savedRegistration.ticketId,
            amount: savedRegistration.amount,
            paymentStatus: initialStatus
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Export Registrations to CSV
// @route   GET /api/registrations/export
// @access  Private/Admin
const exportRegistrations = async (req, res) => {
    try {
        // Fetch all registrations regardless of payment status
        const registrations = await Registration.find().populate('pass', 'name price').sort({ createdAt: -1 });

        // Convert to CSV friendly JSON
        const data = registrations.map(reg => ({
            TicketID: reg.ticketId || 'N/A',
            PassName: reg.pass?.name || 'N/A',
            PassID: reg.pass?._id || 'N/A',
            Student: reg.studentName,
            RollNo: reg.rollNumber,
            Email: reg.email,
            Phone: reg.phone,
            Dept: reg.department,
            Year: reg.year,
            Amount: reg.amount,
            Status: reg.paymentStatus,
            Attended: reg.attended ? 'Yes' : 'No',
            PaymentID: reg.paymentId || 'N/A',
            Date: reg.createdAt.toISOString().split('T')[0]
        }));

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(data);

        res.header('Content-Type', 'text/csv');
        res.attachment('all_registrations.csv');
        res.send(csv);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get All Registrations (for Admin Dashboard)
// @route   GET /api/registrations/all
// @access  Private/Admin
const getAllRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find()
            .populate('pass', 'name price')
            .sort({ createdAt: -1 });
        res.json(registrations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Trigger Report Generation (Send to n8n)
// @route   POST /api/registrations/trigger-report
// @access  Private/Admin
// const triggerReport = async (req, res) => {
//     try {
//         const { type } = req.body; // 'HOD' or 'Club'

//         // Fetch data
//         const registrations = await Registration.find().populate('event');

//         // In a real scenario, we might batch this or save to a file and send URL
//         // Sending payload to n8n

//         const n8nUrl = process.env.N8N_WEBHOOK_URL_REPORT;

//         if (n8nUrl) {
//             // Non-blocking call or await? Await to confirm triggered
//             await axios.post(n8nUrl, {
//                 type,
//                 timestamp: new Date(),
//                 registrations: registrations.slice(0, 100) // Limit payload size for safety
//             });
//             res.json({ message: 'Report generation triggered via n8n' });
//         } else {
//             res.status(503).json({ message: 'n8n Webhook URL not configured' });
//         }

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

// @desc    Get registrations for a specific event
// @route   GET /api/registrations/events/:eventId
// @access  Private/Admin/HOD/Principal
const getEventRegistrations = async (req, res) => {
    try {
        const { eventId } = req.params;
        const registrations = await Registration.find({ events: eventId })
            .populate('pass', 'name')
            .select('studentName rollNumber email phone department year college district pass amount paymentStatus attended createdAt');

        res.json(registrations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Export registrations for a specific event to CSV
// @route   GET /api/registrations/events/:eventId/export
// @access  Private/Admin/HOD/Principal
const exportEventRegistrations = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const registrations = await Registration.find({ events: eventId })
            .populate('pass', 'name')
            .select('studentName rollNumber email phone department year college district pass amount paymentStatus attended createdAt');

        const data = registrations.map(reg => ({
            Student: reg.studentName,
            RollNo: reg.rollNumber,
            Email: reg.email,
            Phone: reg.phone,
            Dept: reg.department,
            Year: reg.year,
            College: reg.college,
            District: reg.district,
            Pass: reg.pass?.name || 'N/A',
            Status: reg.paymentStatus,
            Attended: reg.attended ? 'Yes' : 'No',
            RegisteredAt: reg.createdAt.toISOString().split('T')[0]
        }));

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(data);

        res.header('Content-Type', 'text/csv');
        res.attachment(`${event.title}_participants.csv`);
        res.send(csv);

    } catch (error) {
        console.error(error);
        // If header sent, we can't send json error, but usually we catch early errors
        if (!res.headersSent) res.status(500).json({ message: error.message });
    }
};

// @desc    Pre-register for an event (Interest/Coming Soon)
// @route   POST /api/registrations/pre-register
// @access  Public
const preRegister = async (req, res) => {
    try {
        const { passId, eventIds, studentName, rollNumber, email, phone, department, year, college, district } = req.body;

        const Pass = require('../models/Pass');
        const pass = await Pass.findById(passId);

        const ticketId = `PRE${Math.floor(1000 + Math.random() * 9000)}`;

        // Log to Google Sheet
        const { logToSheet } = require('../utils/googleSheets');
        await logToSheet({
            email,
            studentName,
            year,
            department,
            phone,
            college,
            district,
            passName: pass ? pass.name : 'N/A',
            passId: passId,
            amount: pass ? pass.price : '0',
            paymentStatus: 'Pre-Registered',
            ticketId: ticketId,
            qrCode: '' // No QR code for pre-registrations
        });

        res.status(201).json({ message: 'Interest registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify and mark attendance via Ticket ID (QR Scan)
// @route   GET /api/registrations/verify/:ticketId
// @access  Private/Admin
const verifyAttendance = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const registration = await Registration.findOne({ ticketId })
            .populate('pass', 'name')
            .populate('events', 'title department category');

        if (!registration) {
            return res.status(404).json({ message: 'Invalid Ticket ID' });
        }

        const wasAlreadyMarked = registration.attended;
        registration.attended = true;
        await registration.save();

        res.json({
            message: wasAlreadyMarked ? 'Already marked as attended' : 'Attendance marked successfully',
            registration,
            alreadyAttended: wasAlreadyMarked
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

//Original exports plus new ones
module.exports = {
    registerForEvent,
    preRegister,
    exportRegistrations, // Global export
    getAllRegistrations, // New endpoint for dashboard
    getEventRegistrations,
    exportEventRegistrations,
    verifyAttendance
};
