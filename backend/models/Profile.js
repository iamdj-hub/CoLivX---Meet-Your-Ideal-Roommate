import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({

    username: {
        type: String,
    },
    
    email: {

        type: String,
        required: true,
        unique: true,
    },

    name: {
        type: String,
        default: ""
    },

    city: String,
    budget: Number,
    sleepSchedule: String,
    cleanliness: Number,
    bio: String,
    smoking: String,
    pets: String,

}, {timestamps: true});

export default mongoose.model("Profile", profileSchema);
