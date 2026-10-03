import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const SummaryInsights = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { patientData, summaryData } = location.state || {};

  if (!patientData || !summaryData) {
    return (
      <div className="fade-in">
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h2>No Data Available</h2>
            <p>Please fill out the patient form first.</p>
            <Link to="/patient-form" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Go to Patient Form
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { dischargeSummary, riskPercentage, riskLevel, interactionAlert, followUpDays } = summaryData;

  const getRiskBadgeClass = () => {
    switch (riskLevel) {
      case 'Low': return 'risk-low';
      case 'Medium': return 'risk-medium';
      case 'High': return 'risk-high';
      default: return 'risk-low';
    }
  };

  const getRiskProgressClass = () => {
    switch (riskLevel) {
      case 'Low': return 'low';
      case 'Medium': return 'medium';
      case 'High': return 'high';
      default: return 'low';
    }
  };

  const handleSavePatient = async () => {
    try {
      const axios = (await import('axios')).default;
      await axios.post('http://localhost:5000/api/patients', patientData);
      alert('Patient saved successfully!');
      navigate('/view-patients');
    } catch (error) {
      console.error('Error saving patient:', error);
      alert('Failed to save patient data.');
    }
  };

  return (
    <div className="fade-in">
      <h1 className="page-title">Discharge Summary & Insights</h1>

      <div className="dashboard-grid">
        {/* Patient Info Card */}
        <div className="card">
          <div className="card-header">Patient Information</div>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <p><strong>Name:</strong> {patientData.patientName}</p>
            <p><strong>Age:</strong> {patientData.age} years</p>
            <p><strong>Gender:</strong> {patientData.gender}</p>
            <p><strong>Diagnosis:</strong> {patientData.diagnosis}</p>
            <p><strong>Admission Date:</strong> {patientData.admissionDate}</p>
            <p><strong>Discharge Date:</strong> {patientData.dischargeDate}</p>
          </div>
        </div>

        {/* Risk Assessment Card */}
        <div className="card">
          <div className="card-header">Readmission Risk Assessment</div>
          
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <span className={`risk-badge ${getRiskBadgeClass()}`}>
              {riskLevel} Risk
            </span>
          </div>

          <div className="risk-progress">
            <div className="risk-progress-bar">
              <div 
                className={`risk-progress-fill ${getRiskProgressClass()}`}
                style={{ width: `${riskPercentage}%` }}
              />
            </div>
            <div className="risk-percentage">{riskPercentage}%</div>
          </div>

          <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#757575' }}>
            <strong>Risk Factors Considered:</strong>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem' }}>
              {patientData.age > 60 && <li>Age &gt; 60 years</li>}
              {['Type 2 Diabetes Mellitus', 'Essential Hypertension', 'Bronchial Asthma'].includes(patientData.diagnosis) && (
                <li>Chronic disease diagnosis</li>
              )}
              {patientData.medicines && patientData.medicines.split(',').length > 3 && (
                <li>Multiple medications ({patientData.medicines.split(',').length})</li>
              )}
              {patientData.previousAdmissions === 'Yes' && <li>Previous hospital admissions</li>}
              {patientData.icuStay === 'Yes' && <li>ICU stay required</li>}
            </ul>
          </div>
        </div>

        {/* Follow-up Reminder */}
        <div className="card">
          <div className="card-header">Follow-up Recommendation</div>
          <div className="followup-reminder">
            <div style={{ fontSize: '0.9rem', color: '#757575' }}>
              Recommended follow-up visit within:
            </div>
            <div className="followup-days">{followUpDays} days</div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#757575' }}>
              Please schedule appointment accordingly
            </div>
          </div>
        </div>

        {/* Medicine Interactions */}
        <div className="card">
          <div className="card-header">Medicine Interaction Check</div>
          {interactionAlert ? (
            <div className="alert alert-warning">
              {interactionAlert}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#4CAF50', padding: '1rem' }}>
              ✓ No significant medicine interactions detected
            </div>
          )}
        </div>
      </div>

      {/* Discharge Summary */}
      <div className="card summary-card">
        <div className="card-header">Generated Discharge Summary</div>
        <div className="summary-content">
          {dischargeSummary}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
        <button onClick={handleSavePatient} className="btn btn-primary">
          💾 Save Patient Record
        </button>
        <Link to="/patient-form" className="btn btn-secondary">
          ➕ New Patient
        </Link>
        <Link to="/view-patients" className="btn btn-secondary">
          📋 View All Patients
        </Link>
      </div>
    </div>
  );
};

export default SummaryInsights;
