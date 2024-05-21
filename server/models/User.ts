import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    nickname:{
        type: String,
        required : true,
        unique:true
    },
    password:{
        type: String,
        required : true
    },
    avatar:{
        type: String,
        required : true
    },
    gamePlayed:{
        type: Number,
        default: 0
    },
    gameWon:{
        type: Number,
        default: 0
    },
    gameLost:{
        type: Number,
        default: 0
    },
    score:{
        type: Number,
        default: 0
    },
    rank:{
        type: String,
        default: 'Beginner'
    }

},{timestamps: true});

export default mongoose.model('User', UserSchema);