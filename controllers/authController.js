const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const COOKIE_NAME = process.env.COOKIE_NAME || 'xavron_token';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, contactNo } = req.body;
    if (!name || !email || !password || !contactNo) return res.status(400).json({ message: 'All fields required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hash, contactNo, role: 'user' });
    const token = generateToken(user);

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    res.status(201).json({ message: 'User created', user: { id: user._id, name: user.name, email: user.email, contactNo: user.contactNo, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'All fields required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user);

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    res.json({ message: 'Logged in', user: { id: user._id, name: user.name, email: user.email, contactNo: user.contactNo, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  res.json({ message: 'Logged out' });
};

exports.me = async (req, res) => {
  try {
    const token = req.cookies && req.cookies[COOKIE_NAME];
    if (!token) return res.status(200).json({ user: null });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(200).json({ user: null });
  }
};

// seed admin - call on server start
exports.seedAdmin = async () => {
  const adminEmail = 'admin@xavron.com';
  const exists = await User.findOne({ email: adminEmail });
  if (exists) {
    console.log('Admin already exists');
    return;
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('Admin@123', salt);
  const admin = await User.create({ name: 'Xavron Admin', email: adminEmail, password: hash, contactNo: process.env.ADMIN_CONTACT_NO || '8799196162', role: 'admin' });
  console.log('Seeded admin:', admin.email);
};

// seed frontdesk - call on server start
exports.seedFrontdesk = async () => {
  const frontdeskEmail = 'frontdesk@xavron.com';
  const exists = await User.findOne({ email: frontdeskEmail });
  if (exists) {
    console.log('Frontdesk user already exists');
    return;
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('Frontdesk@123', salt);
  const frontdesk = await User.create({ name: 'Frontdesk Executive', email: frontdeskEmail, password: hash, contactNo: '8799196162', role: 'frontdesk' });
  console.log('Seeded frontdesk:', frontdesk.email);
};

