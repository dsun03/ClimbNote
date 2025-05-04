import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosconfig';
import './EditProfile.css';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    height: '',
    armSpan: '',
    age: ''
  });

  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  function signOut() {
    localStorage.clear();
    navigate('/login');
  }

  // Fetch current user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/users/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
        });
        const { username, email, height, armSpan, age } = res.data;
        setFormData({ username, email, height, armSpan, age });
      } catch (err) {
        setMessage('Failed to load profile.');
        signOut();
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put('/users/me', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Failed to update profile.');
    }
  };

  return (
    <div className="edit-profile-page">
      <h1>Edit Your Profile</h1>
      {message && <p className="message">{message}</p>}
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <label>
          Username:
          <input name="username" value={formData.username} onChange={handleChange} disabled />
        </label>
        <label>
          Email:
          <input name="email" value={formData.email} onChange={handleChange} disabled />
        </label>
        <label>
          Height (inches):
          <input
            type="number"
            name="height"
            placeholder="e.g. 69"
            min="24"
            max="100"
            value={formData.height || ''}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Arm Span (inches):
          <input type = 'number' name="armSpan" value={formData.armSpan || ''} placeholder='e.g. 69' onChange={handleChange} />
        </label>
        <label>
          Age:
          <input name="age" type="number" min='13' max='110' value={formData.age || ''} placeholder='e.g. 69' onChange={handleChange} />
        </label>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;
