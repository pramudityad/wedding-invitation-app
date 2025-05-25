import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const InvitationHandler = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkInvitation = async () => {
      try {
        const response = await axios.get(`/api/invite/${code}`);
        if (response.data.valid) {
          if (response.data.protected) {
            setIsValid(false);
            setError('Password required');
          } else {
            setIsValid(true);
          }
        } else {
          navigate('/404');
        }
      } catch (err) {
        navigate('/404');
      } finally {
        setLoading(false);
      }
    };
    checkInvitation();
  }, [code, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/invite/${code}`, { password });
      if (response.data.valid) {
        setIsValid(true);
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Error verifying password');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!isValid) return (
    <div className="password-prompt">
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter invitation password"
        />
        <button type="submit">Submit</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
  return (
    <div className="invitation-content">
      {/* Your invitation content here */}
    </div>
  );
};

export default InvitationHandler;
