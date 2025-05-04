import { useState } from 'react';
import './ClimbCard.css';
import Modal from 'react-modal';

const ClimbCard = ({ indivClimb , onViewImage}) => {
  const [flip, setFlip] = useState(false);
  const handleFlip = () => setFlip(prev => !prev);

  const formattedDate = new Date(indivClimb.date).toLocaleDateString();


  return (<>
    <div className={`climb-card-container ${flip ? 'flipped' : ''}`}>
      <div className="climb-card">
        <div className="card-header">
          <div className="user-info">
            <div className="avatar">{indivClimb.username.slice(0, 2).toUpperCase()}</div>
            <div className="meta">
              <div className="username">@{indivClimb.username}</div>
              <div className="date">{formattedDate}</div>
            </div>
          </div>
          <div className="badge">{indivClimb.grade}</div>
        </div>

        <div className="card-content">
          <h3 className="title">{indivClimb.title || 'Climbing Session'}</h3>
          <div className="image-preview">
            {indivClimb.image ? (
              <img src={indivClimb.image} alt="Route" />
            ) : (
              <div className="placeholder">No picture ;-;</div>
            )}
            {indivClimb.image && <button className="view-button" onClick={()=>onViewImage(indivClimb.image)}>View Image</button>}
          </div>

          <div className="location"><strong>Gym:</strong> {indivClimb.gym.replaceAll('_', ' ')}</div>

          <div className="styles">
            {indivClimb.style.map((s, idx) => (
              <span key={idx} className="style-chip">{s}</span>
            ))}
          </div>
        </div>

        <div className="card-footer">
          <button className="flip-button" onClick={handleFlip}>Flip to View Notes</button>
        </div>
      </div>

      <div className="card-back">
        <div className="comments-section">
          <h4>Comments</h4>
          {indivClimb.notes? (
            <p>{indivClimb.notes}</p>
          ) : (
            <p>No notes for this climb!</p>
          )}
          <button onClick={handleFlip}>← Back</button>
        </div>
      </div>
    </div>
    </>
  );
};

export default ClimbCard;