import { useState } from 'react';
import './UploadClimbCard.css';
import axios from '../axiosconfig.js'
import {jwtDecode} from 'jwt-decode';


const UploadClimbCard = ()=>{
    const [gym, setGym] = useState('')
    const [grade, setGrade] = useState('');
    const [styles, setStyles] = useState([]);
    const [file, setFile] = useState(null);
    const [image, setImage] = useState();

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        console.log('handleSubmit', decodedToken.username)
      
        try {
          const formData = new FormData();
          formData.append('gym', gym);
          formData.append('grade', grade);
          formData.append('userId', localStorage.getItem('userId'));
          formData.append('image', image); // 👈 this is your file
          formData.append('username', decodedToken.username);
          formData.append('style', styles);

          console.log(formData);
      
          const response = await axios.post('/upload-climb', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
      
          console.log('Climb logged: ', response.data);
      
          // Reset form
          setGym('');
          setGrade('');
          setStyles([]);
          setFile(null);
          setImage(null);
      
        } catch (error) {
          console.error('Error logging climb:', error.response?.data || error.message);
        }
      };
    const handleImagePreview = (e)=>{
        console.log(e.target.value);
        const l = e.target.files[0];
        const url = URL.createObjectURL(l);
        setImage(l);
        console.log('1', image);
        setFile(url)
    }

    return(<>
        <div className='upload-climb-card'>
            <form className="upload-climb-form" onSubmit = {handleSubmit}>
                <label>
                    Choose a gym: 
                    <select name="gyms" value = {gym} id="gyms" onChange={(e)=> setGym(e.target.value)}>
                        <option value="">-- Select a Gym --</option>
                        <option value = "Brooklyn_Boulders">Brooklyn Boulders</option>
                        <option value = "Brooklyn_Bouldering_Project">Brooklyn Bouldering Project</option>
                        <option value = "CRG_Chelsea">CRG Chelsea</option>
                        <option value = "CRG_Riverside">CRG Riverside</option>
                        <option value = "GP81">GP81</option>
                        <option value = "Movement_Harlem">Movement Harlem</option>
                        <option value = "Movement_Gowanus">Movement Gowanus</option>
                        <option value = "Movement_LIC">Movement LIC</option>
                        <option value = "Vital_Harlem">Vital Harlem</option>
                        <option value = "Vital_LES">Vital LES</option>
                        <option value = "Vital_Brooklyn">Vital Brooklyn</option>
                    </select>
                </label>
                <label>
                    Select Grade:
                    <select value={grade} onChange={(e) => setGrade(e.target.value)}>
                        <option value="">-- Select a grade --</option>
                        <option value="V0">V0</option>
                        <option value="V1">V1</option>
                        <option value="V2">V2</option>
                        <option value="V3">V3</option>
                        <option value="V4">V4</option>
                        <option value="V5">V5</option>
                        <option value="V6">V6</option>
                        <option value="V7">V7</option>
                        <option value="V8">V8</option>
                        <option value="V9">V9</option>
                        <option value="V10+">V10+</option>
                    </select>
                </label>
                <label>Select Climbing Style(s):
                <div className="styleToggleGroup">
                    {[
                        'Crimpy',
                        'Slabby',
                        'Overhang',
                        'Dyno',
                        'Compression',
                        'Techy',
                        'Mantle',
                        'Power',
                    ].map((style) => (
                        <button
                        key={style}
                        type="button"
                        className={`styleChip ${styles.includes(style) ? 'selected' : ''}`}
                        onClick={() => {
                            console.log('changing style', styles)
                            setStyles((prev) =>
                            prev.includes(style)
                                ? prev.filter((s) => s !== style)
                                : [...prev, style]
                            );
                        }}
                        >
                        {style}
                        </button>
                    ))}
                    </div>
                    </label>
                    <label className='file-upload-label'>
                        Choose image of route
                        <input className="file-upload-input" type = 'file' accept="image/*" onChange={handleImagePreview}></input>
                    </label>
                    {file && <img className='upload-image-preview' src = {file} alt = 'preview'></img>}
                    <button className="upload-climb-submit-button" type="submit">Submit</button>
                

            </form>
        </div>
    </>)
}

export default UploadClimbCard;