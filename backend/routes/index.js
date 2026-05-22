const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incident');

// Endpoint untuk frontend / alat eksternal
router.post('/incidents', incidentController.createIncident);
router.get('/incidents', incidentController.getAttentionDashboard);

module.exports = router;