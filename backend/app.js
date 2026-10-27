const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
// Live API Request/Response Logger for terminal visibility
app.use((req, res, next) => {
    const start = Date.now();
    const time = new Date().toLocaleTimeString();
    console.log(`\x1b[36m[API IN]\x1b[0m  \x1b[33m${req.method.padEnd(6)}\x1b[0m ${req.originalUrl || req.url} \x1b[90m(${time})\x1b[0m`);

    res.on('finish', () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        const color = status >= 500 ? '\x1b[31m' : status >= 400 ? '\x1b[33m' : status >= 300 ? '\x1b[36m' : '\x1b[32m';
        console.log(`\x1b[36m[API OUT]\x1b[0m ${color}${status}\x1b[0m \x1b[33m${req.method.padEnd(6)}\x1b[0m ${req.originalUrl || req.url} \x1b[90m(${duration}ms)\x1b[0m`);
    });
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [
    'https://kcedhruva-orpin.vercel.app',
    'https://www.kcedhruva.in',
    'https://www.kcekalam.in',
    'https://kcekalam2026-kce3.onrender.com',
    'https://praveenmurugan.me/kalam2026/'
];

if (process.env.CLIENT_URL) {
    allowedOrigins.push(process.env.CLIENT_URL);
    // Add version without trailing slash if it exists
    if (process.env.CLIENT_URL.endsWith('/')) {
        allowedOrigins.push(process.env.CLIENT_URL.slice(0, -1));
    }
}

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        const isAllowed = allowedOrigins.includes(origin) ||
            (typeof origin === 'string' && (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) || origin.endsWith('.kcekalam.in') || origin.endsWith('.kcedhruva.in') || origin.endsWith('.onrender.com')));

        if (isAllowed) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
}));
app.use(morgan('dev'));
app.use(cookieParser());

// Routes
// Routes
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const passRoutes = require('./routes/passRoutes');
const dynamicContentRoutes = require('./routes/dynamicContentRoutes');
const sheetRoutes = require('./routes/sheetRoutes');
const path = require('path');

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/technical-events', (req, res) => require('./controllers/technicalImportController').getTechnicalEvents(req, res));
app.use('/api/registrations', registrationRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/passes', passRoutes);
app.use('/api/content', dynamicContentRoutes);
app.use('/api/sheets', sheetRoutes);

// Make uploads folder static
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send('Secure KALAM 2026 API is running');
});

module.exports = app;
