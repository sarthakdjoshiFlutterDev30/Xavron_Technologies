const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  getDashboardStats,
  createVisitor,
  getVisitors,
  searchVisitors,
  checkInVisitor,
  checkOutVisitor,
  getVisitor,
  updateVisitor
} = require('../controllers/frontdeskController');

// All routes require frontdesk role
router.use(authMiddleware);
router.use(roleMiddleware('frontdesk'));

// Dashboard stats
router.get('/dashboard/stats', getDashboardStats);

// Visitor management
router.post('/visitors', createVisitor);
router.get('/visitors', getVisitors);
router.get('/visitors/search', searchVisitors);
router.get('/visitors/:visitorId', getVisitor);
router.put('/visitors/:visitorId', updateVisitor);
router.post('/visitors/:visitorId/checkin', checkInVisitor);
router.post('/visitors/:visitorId/checkout', checkOutVisitor);

module.exports = router;

