import mongoose from 'mongoose';

const ClimbSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
    },
    username: {
        type: String,
        required: true
    },
    gym: String,
    grade: String,
    style: [],
    date: {type: Date, default: Date.now},
    image: String,
    notes: String
})

const Climb = mongoose.model("Climb", ClimbSchema);
export default Climb;