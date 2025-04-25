import { useState, useEffect } from "react";
import axios from '../axiosconfig.js';
import "./Home.css";
import UploadClimbCard from "../components/UploadClimbCard.jsx";
const Home = () => {
    const [currentGym, setCurrentGym] = useState();

    useEffect(() => {
      const fetchGym = async () => {
        try {
          const response = await axios.get('/api/getCurrentGym');
          setCurrentGym(response.data);
        } catch (error) {
          console.error("Error getting current gym", error);
        }
      };
    
      fetchGym();
    }, []);

    const updateGym =(gymName)=> {
      axios.post('/api/gym', {gym: gymName})
      .then(setCurrentGym(gymName))
      .catch(err=>console.error("Failed to update gym", err));
    }

    return (
      <>
        <h1 className="home-title">{localStorage.getItem('username')}'s Climbing Log</h1>
        <UploadClimbCard></UploadClimbCard>
      </>
    );
  };
  
  export default Home;