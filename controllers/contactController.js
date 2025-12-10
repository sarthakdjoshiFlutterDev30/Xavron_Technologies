const Contact = require('../models/Contact');

exports.submit = async (req, res) => {
  try {
    const { name, email, phone, message, type } = req.body;
    if (!name || !email) return res.status(400).json({ message: 'Name and email required' });
    await Contact.create({ name, email, phone, message, type });
    res.status(201).json({ message: 'Received' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

