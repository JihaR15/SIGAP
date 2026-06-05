const express = require('express');
const router = express.Router();

const incidentController = require('../controllers/incident');
const userController = require('../controllers/user');
const authController = require('../controllers/auth');

const { verifyToken, isManager } = require('../middleware/auth');

router.post('/login', authController.login);

router.post('/incidents', verifyToken, incidentController.createIncident);
router.get('/incidents', verifyToken, incidentController.getAttentionDashboard);
router.put('/users/profile', verifyToken, userController.updateProfile);

router.get('/users', verifyToken, isManager, userController.getAllUsers);
router.post('/users/batch', verifyToken, isManager, userController.importUsers);
router.post('/users', verifyToken, isManager, userController.createUser);
router.put('/users/:id', verifyToken, isManager, userController.updateUser);
router.delete('/users/:id', verifyToken, isManager, userController.deleteUser);
router.put('/users/:id/restore', verifyToken, isManager, userController.restoreUser);

router.delete('/incidents/:id', verifyToken, incidentController.softDeleteIncident);
router.put('/incidents/:id/acknowledge', verifyToken, isManager, incidentController.acknowledgeSingle);
router.put('/incidents/acknowledge', verifyToken, isManager, incidentController.acknowledgeAllCritical);
router.put('/incidents/:id/resolve', verifyToken, isManager, incidentController.resolveIncident);
router.get('/incidents/archived/deleted', verifyToken, isManager, incidentController.getDeletedIncidents);
router.get('/audit-trails', verifyToken, isManager, incidentController.getAuditTrails);
router.put('/incidents/:id/restore', verifyToken, isManager, incidentController.restoreIncident);

module.exports = router;