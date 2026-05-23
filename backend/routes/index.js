const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incident');
const userController = require('../controllers/user');

router.post('/incidents', incidentController.createIncident);
router.get('/incidents', incidentController.getAttentionDashboard);
router.delete('/incidents/:id', incidentController.softDeleteIncident);
router.put('/incidents/:id/acknowledge', incidentController.acknowledgeSingle);
router.put('/incidents/acknowledge', incidentController.acknowledgeAllCritical);
router.put('/incidents/:id/resolve', incidentController.resolveIncident);
router.get('/incidents/archived/deleted', incidentController.getDeletedIncidents);
router.get('/audit-trails', incidentController.getAuditTrails);
router.put('/incidents/:id/restore', incidentController.restoreIncident);

router.get('/users', userController.getAllUsers);

module.exports = router;