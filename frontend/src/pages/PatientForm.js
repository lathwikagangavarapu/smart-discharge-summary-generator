import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PatientForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    gender: '',
    admissionDate: '',
    dischargeDate: '',
    diagnosis: '',
    treatment: '',
    medicines: '',
    previousAdmissions: '',
    icuStay: '',
    bloodPressure: '',
    bloodSugar: ''
  });

  const diagnoses = [
    'Type 2 Diabetes Mellitus',
    'Essential Hypertension',
    'Pneumonia',
    'Acute Appendicitis',
    'Bronchial Asthma'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Send data to backend
      const response = await axios.post('http://localhost:5000/api/generate-summary', formData);
      
      // Navigate to summary page with data
      navigate('/summary', { 
        state: { 
          patientData: formData,
          summaryData: response.data
        } 
      });
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.error || 'Failed to generate summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:5000/api/patients', formData);
      alert('Patient saved successfully!');
      navigate('/view-patients');
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.error || 'Failed to save patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <h1 className="page-title">Patient Admission Form</h1>
      
      <div className="card form-container">
        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="card-header">Patient Information</div>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Patient Name *</label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                placeholder="Enter patient name"
                required
              />
            </div>

            <div className="form-group">
              <label>Age *</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter age"
                min="0"
                max="150"
                required
              />
            </div>

            <div className="form-group">
              <label>Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Admission Date *</label>
              <input
                type="date"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Discharge Date *</label>
              <input
                type="date"
                name="dischargeDate"
                value={formData.dischargeDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Diagnosis *</label>
              <select
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                required
              >
                <option value="">Select diagnosis</option>
                {diagnoses.map(diag => (
                  <option key={diag} value={diag}>{diag}</option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label>Treatment Given</label>
              <textarea
                name="treatment"
                value={formData.treatment}
                onChange={handleChange}
                placeholder="Describe the treatment provided..."
              />
            </div>

            <div className="form-group full-width">
              <label>Medicines Prescribed (comma separated)</label>
              <input
                type="text"
                name="medicines"
                value={formData.medicines}
                onChange={handleChange}
                placeholder="e.g., Metformin, Aspirin, Lisinopril"
              />
            </div>

            <div className="form-group">
              <label>Previous Admissions</label>
              <select
                name="previousAdmissions"
                value={formData.previousAdmissions}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="form-group">
              <label>ICU Stay</label>
              <select
                name="icuStay"
                value={formData.icuStay}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="form-group">
              <label>Blood Pressure (mmHg)</label>
              <input
                type="text"
                name="bloodPressure"
                value={formData.bloodPressure}
                onChange={handleChange}
                placeholder="e.g., 120/80"
              />
            </div>

            <div className="form-group">
              <label>Blood Sugar Level (mg/dL)</label>
              <input
                type="text"
                name="bloodSugar"
                value={formData.bloodSugar}
                onChange={handleChange}
                placeholder="e.g., 140"
              />
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Summary'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleSave}
              disabled={loading}
            >
              Save Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
