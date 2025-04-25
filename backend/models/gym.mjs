import mongoose from "mongoose";

const gymSchema = new mongoose.Schema({
    _id: { type: String, default: 'current_gym' },
    gym: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now },
  }, { collection: 'status' });

const GymStatus = mongoose.model("GymStatus", gymSchema);
export default GymStatus;