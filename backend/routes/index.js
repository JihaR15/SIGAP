const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incident');

router.post('/incidents', incidentController.createIncident);
router.get('/incidents', incidentController.getAttentionDashboard);
router.delete('/incidents/:id', incidentController.softDeleteIncident);
router.put('/incidents/acknowledge', incidentController.acknowledgeAllCritical);

module.exports = router;