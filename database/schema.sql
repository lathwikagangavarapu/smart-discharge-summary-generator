-- Smart Discharge Summary Generator - Database Schema
-- This database is designed for academic demonstration purposes only

CREATE DATABASE IF NOT EXISTS discharge_summary_db;
USE discharge_summary_db;

-- Drop table if exists for clean setup
DROP TABLE IF EXISTS patients;

-- Create patients table
CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    admission_date DATE NOT NULL,
    discharge_date DATE NOT NULL,
    diagnosis VARCHAR(255) NOT NULL,
    treatment TEXT,
    medicines TEXT,
    previous_admissions BOOLEAN DEFAULT FALSE,
    icu_stay BOOLEAN DEFAULT FALSE,
    blood_pressure VARCHAR(50),
    blood_sugar VARCHAR(50),
    discharge_summary TEXT,
    risk_percentage INT DEFAULT 0,
    risk_level VARCHAR(50) DEFAULT 'Low',
    interaction_alert TEXT,
    follow_up_days INT DEFAULT 7,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample data for testing
INSERT INTO patients (patient_name, age, gender, admission_date, discharge_date, diagnosis, treatment, medicines, previous_admissions, icu_stay, blood_pressure, blood_sugar, discharge_summary, risk_percentage, risk_level, interaction_alert, follow_up_days) 
VALUES 
('John Smith', 65, 'Male', '2026-01-01', '2026-01-10', 'Type 2 Diabetes Mellitus', 'Insulin therapy, dietary counseling, blood glucose monitoring', 'Metformin,Glipizide,Aspirin', TRUE, FALSE, '140/90', '180', 'Patient admitted with uncontrolled diabetes. Treated with insulin and oral hypoglycemics. Blood sugar stabilized before discharge.', 40, 'Medium', NULL, 14),
('Mary Johnson', 45, 'Female', '2026-01-15', '2026-01-22', 'Essential Hypertension', 'Blood pressure monitoring, lifestyle modifications, medication adjustment', 'Lisinopril,Amlodipine', FALSE, FALSE, '160/100', '110', 'Patient presented with elevated blood pressure. Started on combination therapy. BP controlled at discharge.', 20, 'Low', NULL, 7);

-- Verify data
SELECT * FROM patients;
