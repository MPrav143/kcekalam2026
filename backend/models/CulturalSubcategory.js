const mongoose = require('mongoose');

const culturalSubcategorySchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1514525253361-bee8a48790c3?auto=format&fit=crop&w=800&q=80'
    },
    order: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('CulturalSubcategory', culturalSubcategorySchema);
