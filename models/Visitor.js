const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true },
  phone: { type: String, required: true, trim: true },
  company: { type: String, trim: true },
  purpose: { type: String, required: true, trim: true },
  visitingEmployeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  visitingEmployeeName: { type: String, trim: true },
  checkIn: { type: Date },
  checkOut: { type: Date },
  status: { type: String, enum: ['checked-in', 'checked-out', 'pending'], default: 'pending' },
  idProof: { type: String, trim: true },
  idProofNumber: { type: String, trim: true },
  notes: { type: String, trim: true },
  registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// Index for efficient queries
visitorSchema.index({ checkIn: -1 });
visitorSchema.index({ status: 1 });

module.exports = mongoose.model('Visitor', visitorSchema);

