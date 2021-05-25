import mongoose from 'mongoose';
import { encode } from 'html-entities'

export const connect = async () => {
    const { MONGO_HOST, MONGO_DB_NAME, MONGO_USER, MONGO_PASS } = process.env
    
    const connectionString = `mongodb+srv://${MONGO_USER}:${encode(MONGO_PASS)}@${MONGO_HOST}/${MONGO_DB_NAME}?retryWrites=true&w=majority`
    return mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
}