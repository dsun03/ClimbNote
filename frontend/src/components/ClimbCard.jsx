import { useState } from 'react';
import './ClimbCard.css';

const ClimbCard = (props) =>{
    const [flip, setFlip] = useState(false);

    const handleFlip = ()=>{
        setFlip(prev => !prev);
    }
    return(
        
            <div className={`flip-card ${flip? 'flipped' : ''}`} onClick={handleFlip}>
                <div className="flip-card-inner">
                    <div className="flip-card-front">
                    <div className="climb-card">
                        <div className="climb-header">
                        <span className="grade">{props.climbDetails.grade}</span>
                        <span className="gym">{props.climbDetails.gym.replaceAll('_', ' ')}</span>
                        </div>
                        <div className="climb-body">
                        {props.climbDetails.style.map((s, idx) => (
                            <span key={idx} className="style-chip">{s}</span>
                        ))}
                        </div>
                        <div className="climb-footer">
                        <p>{props.climbDetails.username}</p>
                        <span className="climb-date">
                            {new Date(props.climbDetails.date).toLocaleDateString()}
                        </span>
                        </div>
                    </div>
                    </div>

                    <div className="flip-card-back">
                        {props.climbDetails.image && <img src={`${props.climbDetails.image}`} alt="Route" />}
                        {!props.climbDetails.image && <p>No picture ;-;</p>}
                    </div>
                </div>
                </div>
        
    )
}

export default ClimbCard;