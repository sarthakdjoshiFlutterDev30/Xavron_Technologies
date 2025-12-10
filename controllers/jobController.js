const Job = require('../models/Job');

exports.createJob = async (req, res) => {
  try {
    const data = req.body;
    data.category = ['IT', 'Non-IT'].includes(data.category) ? data.category : 'IT';
    data.createdBy = req.user._id;
    const job = await Job.create(data);
    res.status(201).json({ job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.category && !['IT', 'Non-IT'].includes(payload.category)) {
      delete payload.category;
    }
    const job = await Job.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({}).sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.seedDefaultJobs = async () => {
  const defaults = [
    { title: 'HR Manager', role: 'HR Manager', description: 'Lead people ops and talent experience.', skills: ['People Ops', 'Compliance', 'Analytics'], experience: '5+ years', category: 'Non-IT' },
    { title: 'Flutter Developer', role: 'Flutter Developer', description: 'Build sleek mobile experiences.', skills: ['Flutter', 'Dart', 'Animations'], experience: '3+ years', category: 'IT' },
    { title: 'Front Desk Executive', role: 'Front Desk Executive', description: 'Own first impressions and office operations.', skills: ['Communication', 'Coordination'], experience: '2+ years', category: 'Non-IT' }
  ];
  for (const job of defaults) {
    const exists = await Job.findOne({ role: job.role });
    if (!exists) await Job.create(job);
  }
  console.log('Default jobs ensured');
};

