const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const url = process.env.MONGODB_URL;
    if (!url) throw new Error('MONGODB_URL not set in env');
    await mongoose.connect(url);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;

