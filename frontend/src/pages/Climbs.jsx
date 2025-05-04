import { useState, useEffect, useRef } from "react";
import axios from '../axiosconfig.js'
import ClimbCard from "../components/ClimbCard.jsx";
import './Climb.css';
import Modal from 'react-modal';
import CardContainer from '../components/CardContainer.jsx'

const Climbs = () =>{
    const [filterGym, setFilterGym] = useState('')
    const [filterGrade, setFilterGrade] = useState('');
    const [filterStyles, setFilterStyles] = useState([]);
    const [climbs, setClimbs] = useState([]);
    const [showFilterModal, setShowFilterModal] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)

    useEffect(() => {
        const fetchFilteredClimbs = async () => {
          const response = await axios.get('/climbs', {
            params: {
              gym: filterGym,
              grade: filterGrade,
              styles: filterStyles, // array
            }
          });
          setClimbs([...response.data]);
          console.log(climbs);
        };
      
        fetchFilteredClimbs();
      }, [filterGym, filterGrade, filterStyles]);

      const handleOpenModal = (imgUrl) => {
        setSelectedImage(imgUrl);
        setModalIsOpen(true);
      };
      const closeModal = () => {
        setModalIsOpen(false)
      }
    
    
      return(
        <>

            {!showFilterModal && <button className="open-filter-button" onClick={() => setShowFilterModal(true)}>
            ☰ Filter
            </button>}

            {showFilterModal && (
            <div className="filter-modal">
                <div className="filter-modal-content">
                <button className="close-button" onClick={() => setShowFilterModal(false)}>×</button>

                <h2>Filter Climbs</h2>

                <label>Choose a gym:</label>
                <select value={filterGym} onChange={(e) => setFilterGym(e.target.value)}>
                    <option value="">-- Select a gym --</option>
                    <option value="crg_riverside">CRG Riverside</option>
                    <option value="movementlic">Movement LIC</option>
                </select>

                <label>Select Grade:</label>
                <select value={filterGrade} onChange={(e) => setFilterGrade(e.target.value)}>
                    <option value="">-- Select a grade --</option>
                    {["V0","V1","V2","V3","V4","V5","V6","V7","V8","V9","V10+"].map(v => (
                    <option key={v} value={v}>{v}</option>
                    ))}
                </select>

                <label>Climbing Style(s):</label>
                <div className="styleToggleGroup">
                    {[
                    'Crimpy', 'Slabby', 'Overhang', 'Dyno',
                    'Compression', 'Techy', 'Mantle', 'Power',
                    ].map(style => (
                    <button
                        key={style}
                        type="button"
                        className={`styleChip ${filterStyles.includes(style) ? 'selected' : ''}`}
                        onClick={() =>
                        setFilterStyles(prev =>
                            prev.includes(style)
                            ? prev.filter(s => s !== style)
                            : [...prev, style]
                        )
                        }
                    >
                        {style}
                    </button>
                    ))}
                </div>

                <button
                    className="apply-filter-button"
                    onClick={() => setShowFilterModal(false)}
                >
                    Apply Filters
                </button>
                </div>
            </div>
            )}
            <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                >
                    <img src={selectedImage} alt="Route" />
                    <button onClick={closeModal}>✖️</button>
            </Modal>
            <CardContainer climbDetails = {climbs} handleOpenModal = {handleOpenModal}></CardContainer>
        </>
    )
}
export default Climbs;