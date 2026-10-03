import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ViewPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/patients');
      setPatients(response.data);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('Failed to load patient records. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeClass = (riskLevel) => {
    switch (riskLevel) {
      case 'Low': return 'risk-low';
      case 'Medium': return 'risk-medium';
      case 'High': return 'risk-high';
      default: return 'risk-low';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="fade-in">
        <h1 className="page-title">All Patients</h1>
        <div className="card">
          <div className="loading">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <h1 className="page-title">All Patients</h1>

      {/* Dashboard Stats */}
      <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="card stat-card">
          <div className="stat-value">{patients.length}</div>
          <div className="stat-label">Total Patients</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: '#F44336' }}>
            {patients.filter(p => p.risk_level === 'High').length}
          </div>
          <div className="stat-label">High Risk</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: '#FF9800' }}>
            {patients.filter(p => p.risk_level === 'Medium').length}
          </div>
          <div className="stat-label">Medium Risk</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: '#4CAF50' }}>
            {patients.filter(p => p.risk_level === 'Low').length}
          </div>
          <div className="stat-label">Low Risk</div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div className="card-header" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>
            Patient Records
          </div>
          <Link to="/patient-form" className="btn btn-primary">
            ➕ Add New Patient
          </Link>
        </div>

        {patients.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <h2>No Patients Found</h2>
            <p>Start by adding a new patient record.</p>
            <Link to="/patient-form" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Add First Patient
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Age/Gender</th>
                  <th>Diagnosis</th>
                  <th>Admission</th>
                  <th>Risk Level</th>
                  <th>Follow-up</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id}>
                    <td>#{patient.id}</td>
                    <td><strong>{patient.patient_name}</strong></td>
                    <td>{patient.age} / {patient.gender}</td>
                    <td>{patient.diagnosis}</td>
                    <td>{formatDate(patient.admission_date)}</td>
                    <td>
                      <span className={`risk-badge ${getRiskBadgeClass(patient.risk_level)}`}>
                        {patient.risk_level}
                      </span>
                    </td>
                    <td>{patient.follow_up_days} days</td>
                    <td>
                      <button 
                        className="btn btn-secondary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                        onClick={() => setSelectedPatient(selectedPatient?.id === patient.id ? null : patient)}
                      >
                        {selectedPatient?.id === patient.id ? 'Hide' : 'View'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Selected Patient Detail Modal */}
      {selectedPatient && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <div className="card-header">
            Patient Details - {selectedPatient.patient_name}
          </div>
          
          <div className="dashboard-grid">
            <div>
              <h4 style={{ marginBottom: '0.5rem' }}>Basic Information</h4>
              <p><strong>Name:</strong> {selectedPatient.patient_name}</p>
              <p><strong>Age:</strong> {selectedPatient.age} years</p>
              <p><strong>Gender:</strong> {selectedPatient.gender}</p>
              <p><strong>Admission Date:</strong> {formatDate(selectedPatient.admission_date)}</p>
              <p><strong>Discharge Date:</strong> {formatDate(selectedPatient.discharge_date)}</p>
            </div>
            <div>
              <h4 style={{ marginBottom: '0.5rem' }}>Clinical Data</h4>
              <p><strong>Diagnosis:</strong> {selectedPatient.diagnosis}</p>
              <p><strong>Treatment:</strong> {selectedPatient.treatment || '-'}</p>
              <p><strong>Medicines:</strong> {selectedPatient.medicines || '-'}</p>
              <p><strong>Blood Pressure:</strong> {selectedPatient.blood_pressure || '-'}</p>
              <p><strong>Blood Sugar:</strong> {selectedPatient.blood_sugar || '-'}</p>
            </div>
            <div>
              <h4 style={{ marginBottom: '0.5rem' }}>Risk Assessment</h4>
              <p><strong>Risk Level:</strong> <span className={`risk-badge ${getRiskBadgeClass(selectedPatient.risk_level)}`}>{selectedPatient.risk_level}</span></p>
              <p><strong>Risk Percentage:</strong> {selectedPatient.risk_percentage}%</p>
              <p><strong>Previous Admissions:</strong> {selectedPatient.previous_admissions ? 'Yes' : 'No'}</p>
              <p><strong>ICU Stay:</strong> {selectedPatient.icu_stay ? 'Yes' : 'No'}</p>
              <p><strong>Follow-up:</strong> {selectedPatient.follow_up_days} days</p>
            </div>
            {selectedPatient.interaction_alert && (
              <div>
                <h4 style={{ marginBottom: '0.5rem' }}>Medicine Alerts</h4>
                <div className="alert alert-warning">
                  {selectedPatient.interaction_alert}
                </div>
              </div>
            )}
          </div>

          {selectedPatient.discharge_summary && (
            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>Discharge Summary</h4>
              <div className="summary-content">
                {selectedPatient.discharge_summary}
              </div>
            </div>
          )}

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => setSelectedPatient(null)}
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPatients;
