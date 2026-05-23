const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incident');

router.post('/incidents', incidentController.createIncident);
router.get('/incidents', incidentController.getAttentionDashboard);
router.delete('/incidents/:id', incidentController.softDeleteIncident);
router.put('/incidents/acknowledge', incidentController.acknowledgeAllCritical);
router.put('/incidents/:id/resolve', incidentController.resolveIncident);
router.get('/incidents/archived/deleted', incidentController.getDeletedIncidents);
router.get('/audit-trails', incidentController.getAuditTrails);

module.exports = router;