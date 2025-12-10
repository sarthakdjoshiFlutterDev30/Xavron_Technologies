require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { seedAdmin, seedFrontdesk } = require('./controllers/authController');
const { seedDefaultJobs } = require('./controllers/jobController');

const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const contactRoutes = require('./routes/contactRoutes');
const frontdeskRoutes = require('./routes/frontdeskRoutes');

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// CORS
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/frontdesk', frontdeskRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

// Seed admin and frontdesk users
seedAdmin().catch(err => console.error('Seed admin error:', err));
seedFrontdesk().catch(err => console.error('Seed frontdesk error:', err));
seedDefaultJobs().catch(err => console.error('Seed jobs error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

