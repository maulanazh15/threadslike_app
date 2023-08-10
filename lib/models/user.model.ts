import mongoose, { Mongoose } from "mongoose";

const userSchema = new mongoose.Schema({
    id: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: {type: String},
    password: {type: String},
    image: String,
    bio: String,
    threads: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Thread"
        }
    ],
    onboarded: {
        type: Boolean,
        default: false
    },
    communities: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Community'

        }
    ],
    likedThreads: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Thread'
        }
      ],
})

const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User;