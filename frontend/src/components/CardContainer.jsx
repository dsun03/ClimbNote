import { useEffect } from "react"
import ClimbCard from "./ClimbCard";
import '../pages/Climb.css';

const CardContainer=({climbDetails, handleOpenModal})=>{

    useEffect(() => {
        console.log(climbDetails);
      }, [climbDetails]);
    return(

        <div className="climbing-card-container">
                {climbDetails.length === 0 ? (
                    <p className="no-climbs-message">No climbs match your filters.</p>
                ) : (
                    climbDetails.map((climb, index) => (
                    <ClimbCard key={index} indivClimb={climb} onViewImage = {handleOpenModal} />
                    ))
                )}

            </div>
    )

}
export default CardContainer