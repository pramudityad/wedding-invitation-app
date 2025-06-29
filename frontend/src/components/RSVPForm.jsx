import React, { useState } from 'react';

function RSVPForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attending: 'yes',
    guests: 1,
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Connect to backend API
    console.log('RSVP submitted:', formData);
    alert('Thank you for your RSVP!');
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={styles.formTitle}>RSVP</h3>

      <div style={styles.formGroup}>
        <label style={styles.label}>Will you be attending?</label>
        <select
          name="attending"
          value={formData.attending}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="yes">Yes, I'll be there</option>
          <option value="no">No, I can't make it</option>
        </select>
      </div>

      <button type="submit" style={styles.submitButton}>
        Submit RSVP
      </button>
    </form>
  );
}

const styles = {
  form: {
    marginTop: '3rem',
    padding: '3rem',
    backgroundColor: '#f9f9f7',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  formTitle: {
    marginBottom: '2rem',
    color: '#333',
    textAlign: 'center',
    fontSize: '1.8rem',
    fontWeight: '300',
    letterSpacing: '0.5px',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.75rem',
    fontWeight: '400',
    color: '#555',
    fontSize: '0.95rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    fontSize: '1rem',
    backgroundColor: 'white',
    transition: 'border-color 0.2s',
    '&:focus': {
      outline: 'none',
      borderColor: '#999',
    }
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    fontSize: '1rem',
    backgroundColor: 'white',
    transition: 'border-color 0.2s',
    '&:focus': {
      outline: 'none',
      borderColor: '#999',
    }
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    fontSize: '1rem',
    minHeight: '120px',
    backgroundColor: 'white',
    transition: 'border-color 0.2s',
    '&:focus': {
      outline: 'none',
      borderColor: '#999',
    }
  },
  submitButton: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1.5rem',
    transition: 'all 0.2s',
    fontWeight: '400',
    letterSpacing: '0.5px',
    '&:hover': {
      backgroundColor: '#444',
    }
  }
};

export default RSVPForm;