require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./app');
const connectDB = require('./config/db');

// Connect to database (reusing warm connection in serverless or local)
const connectDatabase = async () => {
    if (!mongoose.connection || mongoose.connection.readyState < 1) {
        try {
            await connectDB();
            console.log('MongoDB connected');
        } catch (error) {
            console.error('Database connection failed:', error.message);
            throw error;
        }
    }
};

// Export serverless function
module.exports = async (req, res) => {
    await connectDatabase();
    return app(req, res);
};

// Start server if run directly (Local Development)
if (require.main === module) {
    connectDatabase().then(() => {
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }).catch(err => {
        console.error('Initial server startup connection error:', err);
    });
}
