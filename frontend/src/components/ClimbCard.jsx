import { useState } from 'react';
import './ClimbCard.css';
import Modal from 'react-modal';

const ClimbCard = ({ climbDetails , onViewImage}) => {
  const [flip, setFlip] = useState(false);
  const handleFlip = () => setFlip(prev => !prev);

  const formattedDate = new Date(climbDetails.date).toLocaleDateString();


  return (<>
    <div className={`climb-card-container ${flip ? 'flipped' : ''}`}>
      <div className="climb-card">
        <div className="card-header">
          <div className="user-info">
            <div className="avatar">{climbDetails.username.slice(0, 2).toUpperCase()}</div>
            <div className="meta">
              <div className="username">@{climbDetails.username}</div>
              <div className="date">{formattedDate}</div>
            </div>
          </div>
          <div className="badge">{climbDetails.grade}</div>
        </div>

        <div className="card-content">
          <h3 className="title">{climbDetails.title || 'Climbing Session'}</h3>
          <div className="image-preview">
            {climbDetails.image ? (
              <img src={climbDetails.image} alt="Route" />
            ) : (
              <div className="placeholder">No picture ;-;</div>
            )}
            {climbDetails.image && <button className="view-button" onClick={()=>onViewImage(climbDetails.image)}>View Image</button>}
          </div>

          <div className="location"><strong>Gym:</strong> {climbDetails.gym.replaceAll('_', ' ')}</div>

          <div className="styles">
            {climbDetails.style.map((s, idx) => (
              <span key={idx} className="style-chip">{s}</span>
            ))}
          </div>
        </div>

        <div className="card-footer">
          <button className="flip-button" onClick={handleFlip}>Flip to View Comments</button>
        </div>
      </div>

      <div className="card-back">
        <div className="comments-section">
          <h4>Comments</h4>
          {(climbDetails.comments || []).length > 0 ? (
            climbDetails.comments.map((comment, i) => (
              <div key={i} className="comment">
                <strong>@{comment.username}</strong>
                <p>{comment.content}</p>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
          <button onClick={handleFlip}>← Back</button>
        </div>
      </div>
    </div>
    </>
  );
};

export default ClimbCard;