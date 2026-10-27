const mongoose = require('mongoose');

const passSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'Individual'
    },
    perks: [{
        type: String
    }],
    color: {
        type: String,
        default: '#6D28D9'
    },
    description: {
        type: String,
        default: 'FULL FESTIVAL ENTRY • ALL OFFICIAL PERKS INCLUDED',
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    currency: {
        type: String,
        default: '₹',
        trim: true
    },
    eventName: {
        type: String,
        default: 'KALAM',
        trim: true
    },
    eventYear: {
        type: String,
        default: '2026',
        trim: true
    },
    buttonText: {
        type: String,
        default: 'GET MY PASS',
        trim: true
    },
    registrationUrl: {
        type: String,
        default: '',
        trim: true
    },
    customLogo: {
        type: String,
        default: ''
    },
    themeConfig: {
        type: Object,
        default: {}
    }
}, { timestamps: true });

passSchema.index({ isActive: 1, createdAt: -1 });

if (mongoose.models.Pass) {
    delete mongoose.models.Pass;
}

module.exports = mongoose.model('Pass', passSchema);
