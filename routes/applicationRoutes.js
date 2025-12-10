const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { upload } = require('../middleware/upload');

router.post('/apply', authMiddleware, upload.single('resume'), applicationController.applyJob);
router.get('/me', authMiddleware, applicationController.getMyApplications);
router.delete('/me/:id', authMiddleware, applicationController.withdrawMyApplication);
router.get('/admin', authMiddleware, roleMiddleware('admin'), applicationController.getAllApplications);
router.put('/admin/:id/status', authMiddleware, roleMiddleware('admin'), applicationController.updateApplicationStatus);

module.exports = router;

