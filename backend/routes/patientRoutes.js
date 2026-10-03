const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// POST /generate-summary - Generate discharge summary without saving
router.post('/generate-summary', patientController.generateSummary);

// POST /patients - Save patient data with generated summary
router.post('/patients', patientController.savePatient);

// GET /patients - Get all patients
router.get('/patients', patientController.getAllPatients);

// GET /patients/:id - Get single patient by ID
router.get('/patients/:id', patientController.getPatientById);

module.exports = router;
