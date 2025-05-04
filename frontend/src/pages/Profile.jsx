import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../axiosconfig';
import './Profile.css';
import CardContainer from '../components/CardContainer';
import Modal from 'react-modal';

const Profile = () => {
  const { username } = useParams();
  const [totalClimbs, setTotalClimbs] = useState(0);
  const [myClimbs, setMyClimbs] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    height: '',
    armSpan: '',
    age: ''
  });
  const [showFilterModal, setShowFilterModal] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [showClimbs, setShowClimbs] = useState(false);

  const handleOpenModal = (imgUrl) => {
    setSelectedImage(imgUrl);
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false)
  }
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
        console.error('Error fetching user:', err);
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

  useEffect(()=>{
    const fetchMyClimbs = async()=>{
      try{
        const response = await axios.get('/myclimbs',{
          params: {username}
        });
        setMyClimbs(response.data);
      } catch(err){
          if (err.response?.status === 404) {
            setError('User not found.');
          } else {
            setError('Something went wrong. Please try again later.');
          }
          console.error('Error fetching climb count:', err);
      }
    };
    if (username) fetchMyClimbs();
  },[username])
  

  function handleSignOut() {
    localStorage.clear();
    navigate('/login');
  }

  function editProfile(){
    navigate('/edit-profile');
  }

  function handleShowClimbs(){
    setShowClimbs(true);
  }
  function handleViewProfile(){
    setShowClimbs(false);
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

  return (<>
    <div className='profile-view'>
    <div className="profile-page">
      <div className="profile-banner" />
      <div className="profile-content">
        <div className="profile-avatar">
          <img src="/placeholder.svg" alt="User avatar" />
        </div>
        <h1 className="username">{username}'s Profile</h1>
        <p className="handle">@{username}</p>

        <div className="stats">
          {userInfo.height && <div className="stat"><strong>Height:</strong> {userInfo.height}</div>}
          {userInfo.armSpan && <div className="stat"><strong>Arm Span:</strong> {userInfo.armSpan}</div>}
          {userInfo.age && <div className="stat"><strong>Age:</strong> {userInfo.age}</div>}
          <div className="stat"><strong>Total Climbs Logged:</strong> {totalClimbs}</div>
        </div>
        <div className="profile-actions">
          <button className="profile-actions"onClick={handleShowClimbs}>History</button>
        </div>
        {userInfo.username === username && (
          <div className="profile-actions">
            <button onClick={editProfile}>Edit Profile</button>
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        )}
      </div>
    </div>

      <Modal
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
          >
              <img src={selectedImage} alt="Route" />
              <button onClick={closeModal}>✖️</button>
      </Modal>
      {showClimbs && 
        <div>
          <CardContainer climbDetails = {myClimbs} handleOpenModal = {handleOpenModal}></CardContainer>
          <button className='handle-view-profile' onClick={handleViewProfile}>← Back</button>
        </div>
        }
      </div>
    </>
  );
};

export default Profile;