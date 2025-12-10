const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  resumeUrl: { type: String, required: true },
  consoleUrl: { type: String },
  coverLetter: { type: String },
  candidateName: { type: String, trim: true },
  contactNo: { type: String },
  candidateContact: { type: String, trim: true },
  status: { type: String, enum: ['Pending', 'Reviewed', 'Selected', 'Rejected'], default: 'Pending' },
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema);

