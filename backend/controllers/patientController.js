const { pool } = require('../db');

// Diagnosis treatment mappings
const diagnosisTreatments = {
    'Type 2 Diabetes Mellitus': 'Insulin therapy, dietary counseling, blood glucose monitoring, lifestyle modifications',
    'Essential Hypertension': 'Blood pressure monitoring, lifestyle modifications, medication adjustment, salt restriction',
    'Pneumonia': 'Antibiotic therapy, oxygen support, respiratory physiotherapy, hydration',
    'Acute Appendicitis': 'Surgical appendectomy (if indicated), antibiotic therapy, post-operative care',
    'Bronchial Asthma': 'Bronchodilator therapy, corticosteroid treatment, inhaler technique education, trigger avoidance'
};

// Chronic diseases that increase risk
const chronicDiseases = ['Type 2 Diabetes Mellitus', 'Essential Hypertension', 'Bronchial Asthma'];

// Medicine interaction rules
const medicineInteractions = [
    {
        medicines: ['aspirin', 'warfarin'],
        alert: '⚠️ HIGH RISK: Aspirin + Warfarin significantly increases bleeding risk. Monitor for signs of bleeding.'
    },
    {
        medicines: ['metformin', 'contrast dye'],
        alert: '⚠️ Kidney Risk: Metformin + Contrast Dye can cause lactic acidosis. Ensure adequate hydration and monitor kidney function.'
    },
    {
        medicines: ['salbutamol', 'propranolol'],
        alert: '⚠️ Reduced Efficacy: Salbutamol + Propranolol reduces bronchodilator effect. Consider alternative beta-blocker.'
    },
    {
        medicines: ['metformin', 'aspirin'],
        alert: '⚠️ Moderate Risk: Combined use may increase hypoglycemia risk. Monitor blood glucose levels closely.'
    },
    {
        medicines: ['lisinopril', 'potassium'],
        alert: '⚠️ Hyperkalemia Risk: ACE inhibitors + Potassium supplements can cause high potassium levels.'
    }
];

// Generate discharge summary
const generateDischargeSummary = (patientData) => {
    const { patientName, diagnosis, treatment, admissionDate, dischargeDate, bloodPressure, bloodSugar, icuStay } = patientData;
    
    const treatmentText = diagnosisTreatments[diagnosis] || treatment;
    const admissionDateObj = new Date(admissionDate);
    const dischargeDateObj = new Date(dischargeDate);
    const daysAdmitted = Math.ceil((dischargeDateObj - admissionDateObj) / (1000 * 60 * 60 * 24));
    
    let summary = `
DISCHARGE SUMMARY
==================

Patient Name: ${patientName}
Admission Date: ${admissionDate}
Discharge Date: ${dischargeDate}
Duration of Stay: ${daysAdmitted} days

DIAGNOSIS
---------
${diagnosis}

TREATMENT PROVIDED
------------------
${treatmentText}

CLINICAL NOTES
--------------
• Blood Pressure: ${bloodPressure || 'Not recorded'}
• Blood Sugar Level: ${bloodSugar || 'Not recorded'}
${icuStay === 'Yes' ? '• ICU Stay: Yes - Required intensive monitoring' : '• ICU Stay: No'}

DISCHARGE INSTRUCTIONS
----------------------
1. Continue all prescribed medications as directed
2. Follow up in outpatient department as scheduled
3. Report any unusual symptoms immediately
4. Maintain healthy lifestyle and diet
5. Keep emergency contact numbers handy

Thank you for choosing our facility for your healthcare needs.
    `.trim();
    
    return summary;
};

// Calculate readmission risk
const calculateRisk = (patientData) => {
    let riskPercentage = 0;
    const { age, diagnosis, medicines, previousAdmissions, icuStay } = patientData;
    
    // Age > 60 → +20%
    if (age > 60) {
        riskPercentage += 20;
    }
    
    // Chronic disease → +25%
    if (chronicDiseases.includes(diagnosis)) {
        riskPercentage += 25;
    }
    
    // More than 3 medicines → +15%
    const medicineList = medicines.split(',').map(m => m.trim());
    if (medicineList.length > 3) {
        riskPercentage += 15;
    }
    
    // Previous admission = Yes → +20%
    if (previousAdmissions === 'Yes') {
        riskPercentage += 20;
    }
    
    // ICU Stay = Yes → +30%
    if (icuStay === 'Yes') {
        riskPercentage += 30;
    }
    
    // Cap at 100%
    if (riskPercentage > 100) {
        riskPercentage = 100;
    }
    
    // Determine risk level
    let riskLevel = 'Low';
    if (riskPercentage > 30 && riskPercentage <= 60) {
        riskLevel = 'Medium';
    } else if (riskPercentage > 60) {
        riskLevel = 'High';
    }
    
    return { riskPercentage, riskLevel };
};

// Check medicine interactions
const checkMedicineInteractions = (medicines) => {
    const medicineList = medicines.toLowerCase().split(',').map(m => m.trim());
    const alerts = [];
    
    for (const interaction of medicineInteractions) {
        const matchedMedicines = interaction.medicines.filter(m => 
            medicineList.some(med => med.includes(m))
        );
        
        if (matchedMedicines.length >= 2) {
            alerts.push(interaction.alert);
        }
    }
    
    return alerts.length > 0 ? alerts.join('\n\n') : null;
};

// Calculate follow-up days based on risk and diagnosis
const calculateFollowUpDays = (patientData) => {
    const { diagnosis, riskPercentage, icuStay } = patientData;
    let followUpDays = 7; // Default
    
    // Higher risk = sooner follow-up
    if (riskPercentage > 60) {
        followUpDays = 3;
    } else if (riskPercentage > 30) {
        followUpDays = 5;
    }
    
    // ICU stay requires sooner follow-up
    if (icuStay === 'Yes') {
        followUpDays = Math.min(followUpDays, 3);
    }
    
    // Chronic diseases need regular follow-up
    if (chronicDiseases.includes(diagnosis)) {
        followUpDays = Math.min(followUpDays, 7);
    }
    
    return followUpDays;
};

// Controller functions
const generateSummary = async (req, res) => {
    try {
        const patientData = req.body;
        
        // Validate required fields
        const requiredFields = ['patientName', 'age', 'gender', 'admissionDate', 'dischargeDate', 'diagnosis'];
        for (const field of requiredFields) {
            if (!patientData[field]) {
                return res.status(400).json({ error: `${field} is required` });
            }
        }
        
        // Generate summary
        const dischargeSummary = generateDischargeSummary(patientData);
        
        // Calculate risk
        const { riskPercentage, riskLevel } = calculateRisk(patientData);
        
        // Check interactions
        const interactionAlert = patientData.medicines ? checkMedicineInteractions(patientData.medicines) : null;
        
        // Calculate follow-up
        const followUpDays = calculateFollowUpDays({ ...patientData, riskPercentage });
        
        res.json({
            dischargeSummary,
            riskPercentage,
            riskLevel,
            interactionAlert,
            followUpDays
        });
    } catch (error) {
        console.error('Error generating summary:', error);
        res.status(500).json({ error: 'Failed to generate summary' });
    }
};

const savePatient = async (req, res) => {
    try {
        const patientData = req.body;
        
        // Generate summary first
        const dischargeSummary = generateDischargeSummary(patientData);
        const { riskPercentage, riskLevel } = calculateRisk(patientData);
        const interactionAlert = patientData.medicines ? checkMedicineInteractions(patientData.medicines) : null;
        const followUpDays = calculateFollowUpDays({ ...patientData, riskPercentage });
        
        const query = `
            INSERT INTO patients (
                patient_name, age, gender, admission_date, discharge_date,
                diagnosis, treatment, medicines, previous_admissions, icu_stay,
                blood_pressure, blood_sugar, discharge_summary, risk_percentage,
                risk_level, interaction_alert, follow_up_days
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const values = [
            patientData.patientName,
            patientData.age,
            patientData.gender,
            patientData.admissionDate,
            patientData.dischargeDate,
            patientData.diagnosis,
            patientData.treatment,
            patientData.medicines,
            patientData.previousAdmissions === 'Yes',
            patientData.icuStay === 'Yes',
            patientData.bloodPressure,
            patientData.bloodSugar,
            dischargeSummary,
            riskPercentage,
            riskLevel,
            interactionAlert,
            followUpDays
        ];
        
        const [result] = await pool.execute(query, values);
        
        res.status(201).json({
            message: 'Patient saved successfully',
            patientId: result.insertId
        });
    } catch (error) {
        console.error('Error saving patient:', error);
        res.status(500).json({ error: 'Failed to save patient data' });
    }
};

const getAllPatients = async (req, res) => {
    try {
        const [patients] = await pool.execute('SELECT * FROM patients ORDER BY created_at DESC');
        res.json(patients);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ error: 'Failed to fetch patients' });
    }
};

const getPatientById = async (req, res) => {
    try {
        const { id } = req.params;
        const [patients] = await pool.execute('SELECT * FROM patients WHERE id = ?', [id]);
        
        if (patients.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        
        res.json(patients[0]);
    } catch (error) {
        console.error('Error fetching patient:', error);
        res.status(500).json({ error: 'Failed to fetch patient data' });
    }
};

module.exports = {
    generateSummary,
    savePatient,
    getAllPatients,
    getPatientById
};
