import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
    accessKey: String
    roomKey: String
    words: Array<IWord>
    categories: Array<ICategory>
    players: Array<IPlayer>
    maxRounds: number
    currentInteration?: number
    status?: String
    ip: String
}

export interface IPlayer {
    id: string
    nickname: String
    avatar: String
    points:  number,
    ready: boolean
}

export interface ICategory {
    name: String
    words: [String]
}

export interface IWord {
    name: String,
    category: String
}

const RoomSchema: Schema = new Schema({
    accessKey: {
        type: String,
        required: true,
        unique: true
    },
    roomKey: {
        type: String,
        required: true,
        unique: true,
    },
    categories: [{
        name: String,
        words: [String]
    }],
    words: [{
        name: String,
        category: String
    }],
    players: {
        type: [{
            id: { type: String, required: true },
            nickname: { type: String, required: true },
            avatar: { type: String, required: true },
            points: { type: Number, required: true, default: 0 },
            ready: { type: Boolean, required: true, default: false },
        }],
        required: true,
        default: []
    },
    maxRounds: {
        type: Number,
        required: true
    },
    currentInteration: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        required: true,
        default: 'OPEN'
    },
});


// Export the model and return your IUser interface
export default mongoose.model<IRoom>('Room', RoomSchema)