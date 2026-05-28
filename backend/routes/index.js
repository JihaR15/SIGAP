const express = require('express');
const router = express.Router();

const incidentController = require('../controllers/incident');
const userController = require('../controllers/user');
const authController = require('../controllers/auth');

const { verifyToken, isManager } = require('../middleware/auth');

router.post('/login', authController.login);

router.post('/incidents', verifyToken, incidentController.createIncident);
router.get('/incidents', verifyToken, incidentController.getAttentionDashboard);
router.get('/users', verifyToken, userController.getAllUsers);

router.delete('/incidents/:id', verifyToken, isManager, incidentController.softDeleteIncident);
router.put('/incidents/:id/acknowledge', verifyToken, isManager, incidentController.acknowledgeSingle);
router.put('/incidents/acknowledge', verifyToken, isManager, incidentController.acknowledgeAllCritical);
router.put('/incidents/:id/resolve', verifyToken, isManager, incidentController.resolveIncident);
router.get('/incidents/archived/deleted', verifyToken, isManager, incidentController.getDeletedIncidents);
router.get('/audit-trails', verifyToken, isManager, incidentController.getAuditTrails);
router.put('/incidents/:id/restore', verifyToken, isManager, incidentController.restoreIncident);

module.exports = router;