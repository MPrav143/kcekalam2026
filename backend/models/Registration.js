const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    pass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pass',
        required: true
    },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    studentName: {
        type: String,
        required: true,
    },
    rollNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    year: {
        type: String, // 1st, 2nd, 3rd, 4th
    },
    college: {
        type: String,
    },
    district: {
        type: String,
    },
    paymentId: {
        type: String,
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Pre-Registered'],
        default: 'Pending',
    },
    amount: {
        type: String, // Changed to String to support "500/1000" format
        required: true,
    },
    ticketId: {
        type: String,
        unique: true,
    },
    qrCode: {
        type: String, // Base64 string of the QR code
    },
    attended: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Optimized indexes for lookup, idempotency verification, and admin aggregation
registrationSchema.index({ email: 1, pass: 1 });
registrationSchema.index({ events: 1 });
registrationSchema.index({ paymentStatus: 1, createdAt: -1 });
registrationSchema.index({ rollNumber: 1 });

module.exports = mongoose.model('Registration', registrationSchema);
