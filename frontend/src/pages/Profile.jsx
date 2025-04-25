import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../axiosconfig';
import './Profile.css';

const Profile = () => {
  const { username } = useParams();
  const [totalClimbs, setTotalClimbs] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    height: '',
    armSpan: '',
    age: ''
  });
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
        setUserInfo({ username, email, height, armSpan, age });
      } catch (err) {
        if (err.response?.status === 404) {
          setError('User not found.');
        } else {
          setError('Something went wrong. Please try again later.');
          handleSignOut();
        }
        console.error('Error fetching climb count:', err);
      }
    };
    fetchProfile();
  }, []);
  useEffect(() => {
    const fetchClimbCount = async () => {
      try {
        const response = await axios.get('/climbs/count', {
          params: { username }
        });
        setTotalClimbs(response.data.total);
        setError(null);
      } catch (err) {
        if (err.response?.status === 404) {
            setError('User not found.');
          } else {
            setError('Something went wrong. Please try again later.');
          }
        console.error('Error fetching climb count:', err);
      }
    };
  
    if (username) fetchClimbCount();
  }, [username]);
  

  function handleSignOut() {
    localStorage.clear();
    navigate('/login');
  }

  function editProfile(){
    navigate('/edit-profile');
  }


  if (error) {
    return (<>
      <div className="profile-error">
        <h1>⚠️ Error</h1>
        <p>{error}</p>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
      </>
    );}

  return (
    <div className="profile-page">
      <h1>{username}'s Profile</h1>
      {userInfo.height && <h2>Height: {userInfo.height}</h2>}
      {userInfo.armSpan &&<h2>Arm Span: {userInfo.armSpan}</h2>}
      {userInfo.age && <h3>Age: {userInfo.age}</h3>}
      <p></p>
      <p>Total Climbs Logged: <strong>{totalClimbs}</strong></p>
      {userInfo.username==username && 
        <div>
          <button onClick={editProfile}>Edit Profile</button>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      } 
    </div>
  );
};

export default Profile;