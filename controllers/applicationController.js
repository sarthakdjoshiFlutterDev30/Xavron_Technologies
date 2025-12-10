const Application = require('../models/Application');
const Job = require('../models/Job');
const Employee = require('../models/Employee');
const Visitor = require('../models/Visitor');
const User = require('../models/User');
const { uploadToCloudinary } = require('../middleware/upload');
const fs = require('fs');

exports.applyJob = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    const { jobId, coverLetter } = req.body;
    if (!jobId) return res.status(400).json({ message: 'jobId required' });

    const job = await Job.findById(jobId);
    if (!job || !job.isActive) return res.status(404).json({ message: 'Job not found or not active' });

    if (!req.file) return res.status(400).json({ message: 'Resume file is required' });

    const result = await uploadToCloudinary(req.file.path);

    try { fs.unlinkSync(req.file.path); } catch (e) {}

    const application = await Application.create({
      userId: req.user._id,
      jobId,
      resumeUrl: result.webContentLink || result.webViewLink,
      consoleUrl: result.consoleUrl,
      coverLetter,
      candidateName: req.user.name || undefined,
      contactNo: req.user.contactNo || undefined,
      candidateContact: req.user.contactNo || undefined,
      status: 'Pending'
    });

    res.status(201).json({ application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id }).populate('jobId');
    res.json({ applications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.withdrawMyApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Application.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Application not found' });
    res.json({ message: 'Application withdrawn' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find({}).populate('jobId').populate('userId', '-password');
    res.json({ applications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['Pending', 'Reviewed', 'Selected', 'Rejected'];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });
    
    // Get the application with populated user and job data
    const app = await Application.findById(id).populate('userId', 'name email contactNo').populate('jobId');
    if (!app) return res.status(404).json({ message: 'Application not found' });

    // Update application status
    app.status = status;
    await app.save();

    // If status is "Selected", create Employee record and update User data
    if (status === 'Selected') {
      try {
        // First, ensure User model has all the latest data from application
        const user = await User.findById(app.userId._id);
        if (user) {
          // Update user data with application data if available
          let userUpdated = false;
          if (app.candidateName && app.candidateName !== user.name) {
            user.name = app.candidateName;
            userUpdated = true;
          }
          if (app.candidateContact && app.candidateContact !== user.contactNo) {
            user.contactNo = app.candidateContact;
            userUpdated = true;
          }
          if (app.contactNo && app.contactNo !== user.contactNo) {
            user.contactNo = app.contactNo;
            userUpdated = true;
          }
          if (userUpdated) {
            await user.save();
            console.log(`Updated User ${user._id} with application data`);
          }
        }

        // Check if employee already exists for this user
        const existingEmployee = await Employee.findOne({ userId: app.userId._id });
        
        if (!existingEmployee) {
          // Generate employee ID (EMP + timestamp last 6 digits)
          let employeeId = `EMP${Date.now().toString().slice(-6)}`;
          
          // Ensure uniqueness
          let isUnique = false;
          let attempts = 0;
          while (!isUnique && attempts < 10) {
            const exists = await Employee.findOne({ employeeId });
            if (!exists) {
              isUnique = true;
            } else {
              employeeId = `EMP${Date.now().toString().slice(-6)}${attempts}`;
              attempts++;
            }
          }

          // Create employee record with all available data
          const employeeData = {
            userId: app.userId._id,
            employeeId: employeeId,
            department: app.jobId?.category || app.jobId?.department || '',
            designation: app.jobId?.title || '',
            isActive: true,
            isSelected: true // Automatically selected for attendance management
          };

          const newEmployee = await Employee.create(employeeData);
          console.log(`✅ Created Employee record:`, {
            employeeId: newEmployee.employeeId,
            userId: newEmployee.userId,
            department: newEmployee.department,
            designation: newEmployee.designation,
            isSelected: newEmployee.isSelected,
            isActive: newEmployee.isActive
          });
        } else {
          // Update existing employee to be selected and update department/designation if needed
          let employeeUpdated = false;
          if (app.jobId?.category && app.jobId.category !== existingEmployee.department) {
            existingEmployee.department = app.jobId.category;
            employeeUpdated = true;
          }
          if (app.jobId?.title && app.jobId.title !== existingEmployee.designation) {
            existingEmployee.designation = app.jobId.title;
            employeeUpdated = true;
          }
          if (!existingEmployee.isSelected) {
            existingEmployee.isSelected = true;
            employeeUpdated = true;
          }
          if (!existingEmployee.isActive) {
            existingEmployee.isActive = true;
            employeeUpdated = true;
          }
          if (employeeUpdated) {
            await existingEmployee.save();
            console.log(`✅ Updated Employee record:`, {
              employeeId: existingEmployee.employeeId,
              department: existingEmployee.department,
              designation: existingEmployee.designation,
              isSelected: existingEmployee.isSelected,
              isActive: existingEmployee.isActive
            });
          } else {
            console.log(`ℹ️ Employee ${existingEmployee.employeeId} already has correct data`);
          }
        }
      } catch (empErr) {
        console.error('❌ Error creating/updating employee:', empErr);
        console.error('Application ID:', app._id);
        console.error('User ID:', app.userId?._id);
        // Don't fail the request if employee creation fails
      }
    }

    // If status is "Reviewed", create Visitor record (but don't check in - only frontdesk can do that)
    if (status === 'Reviewed') {
      try {
        // Check if visitor record already exists for this application
        const existingVisitor = await Visitor.findOne({
          name: app.candidateName || app.userId?.name,
          phone: app.candidateContact || app.contactNo || app.userId?.contactNo,
          notes: { $regex: `Application ID: ${app._id}`, $options: 'i' }
        });

        if (!existingVisitor) {
          // Create visitor record with pending status (frontdesk will check them in)
          await Visitor.create({
            name: app.candidateName || app.userId?.name || 'Unknown',
            email: app.userId?.email || '',
            phone: app.candidateContact || app.contactNo || app.userId?.contactNo || '',
            company: '',
            purpose: `Interview for ${app.jobId?.title || 'Position'}`,
            status: 'pending', // Set to pending - frontdesk will check them in
            registeredBy: req.user._id,
            notes: `Application ID: ${app._id}. Status: Reviewed - Awaiting frontdesk check-in.`
          });
        }
      } catch (visitorErr) {
        console.error('Error creating visitor:', visitorErr);
        // Don't fail the request if visitor creation fails
      }
    }

    res.json({ application: app });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

