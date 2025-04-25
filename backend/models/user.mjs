import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    height:{
        type: String
    },
    armSpan:{
        type: String
    },
    age:{
        type: Number
    }
})

const User = mongoose.model("User", UserSchema);
export default User;