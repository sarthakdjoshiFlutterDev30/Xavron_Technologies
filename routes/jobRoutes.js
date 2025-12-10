const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJobById);

router.post('/admin', authMiddleware, roleMiddleware('admin'), jobController.createJob);
router.put('/admin/:id', authMiddleware, roleMiddleware('admin'), jobController.updateJob);
router.delete('/admin/:id', authMiddleware, roleMiddleware('admin'), jobController.deleteJob);

module.exports = router;

