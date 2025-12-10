const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  role: { type: String, required: true },
  description: { type: String, default: '' },
  responsibilities: { type: Array, default: [] },
  skills: { type: [String], default: [] },
  experience: { type: String, default: '' },
  category: { type: String, enum: ['IT', 'Non-IT'], default: 'IT' },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);

