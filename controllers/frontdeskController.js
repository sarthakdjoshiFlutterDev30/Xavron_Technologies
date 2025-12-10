const Visitor = require('../models/Visitor');
const User = require('../models/User');

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [todayVisitors, activeVisitors, pendingVisitors] = await Promise.all([
      Visitor.countDocuments({
        checkIn: { $gte: today, $lt: tomorrow }
      }),
      Visitor.countDocuments({ status: 'checked-in' }),
      Visitor.countDocuments({ status: 'pending' })
    ]);

    res.json({
      todayVisitors,
      activeVisitors,
      pendingVisitors
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Visitor Management

// Create visitor entry
exports.createVisitor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      purpose,
      idProof,
      idProofNumber,
      notes
    } = req.body;

    if (!name || !phone || !purpose) {
      return res.status(400).json({ message: 'Name, phone, and purpose are required' });
    }

    const visitor = await Visitor.create({
      name,
      email,
      phone,
      company,
      purpose,
      idProof,
      idProofNumber,
      notes,
      registeredBy: req.user._id,
      status: 'pending' // Don't check in automatically - frontdesk will check them in manually
    });

    res.status(201).json({ message: 'Visitor registered successfully', visitor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all visitors
exports.getVisitors = async (req, res) => {
  try {
    const { status, startDate, endDate, search } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (startDate && endDate) {
      query.checkIn = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const visitors = await Visitor.find(query)
      .populate('registeredBy', 'name email')
      .sort({ checkIn: -1 })
      .limit(100);

    res.json({ visitors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search visitors by name (for autocomplete)
exports.searchVisitors = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name || name.length < 2) {
      return res.json({ visitors: [] });
    }

    // Find the most recent visit for each unique visitor name
    const visitors = await Visitor.find({
      name: { $regex: name, $options: 'i' }
    })
      .sort({ checkIn: -1 })
      .limit(10);

    // Group by name and get the most recent entry for each visitor
    const visitorMap = new Map();
    visitors.forEach(visitor => {
      const key = visitor.name.toLowerCase();
      if (!visitorMap.has(key) || new Date(visitor.checkIn) > new Date(visitorMap.get(key).checkIn)) {
        visitorMap.set(key, visitor);
      }
    });

    const uniqueVisitors = Array.from(visitorMap.values());

    res.json({ visitors: uniqueVisitors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check in visitor
exports.checkInVisitor = async (req, res) => {
  try {
    const { visitorId } = req.params;
    const visitor = await Visitor.findById(visitorId);

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    if (visitor.status === 'checked-in') {
      return res.status(400).json({ message: 'Visitor already checked in' });
    }

    visitor.checkIn = new Date();
    visitor.status = 'checked-in';
    await visitor.save();

    res.json({ message: 'Visitor checked in successfully', visitor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Check out visitor
exports.checkOutVisitor = async (req, res) => {
  try {
    const { visitorId } = req.params;
    const visitor = await Visitor.findById(visitorId);

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    if (visitor.status === 'checked-out') {
      return res.status(400).json({ message: 'Visitor already checked out' });
    }

    if (!visitor.checkIn) {
      return res.status(400).json({ message: 'Visitor must be checked in first' });
    }

    visitor.checkOut = new Date();
    visitor.status = 'checked-out';
    await visitor.save();

    res.json({ message: 'Visitor checked out successfully', visitor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get visitor by ID
exports.getVisitor = async (req, res) => {
  try {
    const { visitorId } = req.params;
    const visitor = await Visitor.findById(visitorId)
      .populate('registeredBy', 'name email');

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    res.json({ visitor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update visitor
exports.updateVisitor = async (req, res) => {
  try {
    const { visitorId } = req.params;
    const visitor = await Visitor.findById(visitorId);

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    Object.assign(visitor, req.body);
    await visitor.save();

    res.json({ message: 'Visitor updated successfully', visitor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

