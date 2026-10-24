const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    rounds: [{
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
        }
    }],
    category: {
        type: String,
        enum: ['Technical', 'Cultural', 'Workshop', 'Non Technical', 'Non-Technical', 'Ideathon', 'Paper Presentation', 'Project Presentation', 'Hackathon'],
        required: true,
    },
    eventType: {
        type: String, // 'Normal', 'Hackathon', 'Workshop', 'Hands-on', 'Ideathon', 'Paper Presentation', 'Project Presentation', 'OnStage', 'OffStage'
        default: 'Normal'
    },
    timings: {
        type: String, // E.g., "10:00 AM - 4:00 PM" (Legacy/Fallback)
    },
    fromTime: {
        type: String, // E.g., "10:00 AM"
    },
    toTime: {
        type: String, // E.g., "04:00 PM"
    },
    prize: {
        type: String, // E.g., "Winner: ₹5000, Runner: ₹3000"
    },
    winnerPrize: {
        type: String, // E.g., "₹5000"
    },
    runnerPrize: {
        type: String, // E.g., "₹3000"
    },
    generalPrize: [{
        type: String,
    }],
    rules: [{
        type: String,
    }],
    pptTemplateUrl: {
        type: String,
    },
    resourcePerson: {
        type: String,
    },
    resourcePersonPosition: {
        type: String,
    },
    resourcePersonCompany: {
        type: String,
    },
    club: {
        type: String, // E.g., "CSEA", "Dance Club"
        required: false, // Not required for Technical events
    },
    theme: [{
        type: String,
    }],
    department: {
        type: String, // E.g., "CSE", "ECE"
    },
    date: {
        type: Date,
        required: true,
    },
    venue: {
        type: String,
        required: true,
    },
    image: {
        type: String, // URL to image
    },
    registrationFee: {
        type: Number,
        default: 0,
    },
    coordinators: [{
        name: String,
        phone: String,
    }],
    facultyCoordinators: [{
        name: String,
        phone: String,
    }],
    studentCoordinators: [{
        name: String,
        phone: String,
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
    slug: {
        type: String,
        unique: true,
    }
}, { timestamps: true });

// Generate slug from title before saving
eventSchema.pre('save', async function () {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(/-+/g, '-') // Replace multiple - with single -
            .trim();
    }
});

module.exports = mongoose.model('Event', eventSchema);
