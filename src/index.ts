import dotEnv from 'dotenv'

dotEnv.config({ path: '../.env' })

import { getConnectionOptions, Connection, createConnection } from 'typeorm'
import express from 'express'
import app from './app'
import * as mongo from './mongo/mongo-connection-manager'

const server = express()

console.log('Connecting with MySQL...')
getConnectionOptions('default')
.then(opt => {
    return createConnection(opt)
})
.then((conn: Connection) => {
    console.log('Connected with MySQL')
    console.log('Connecting with MongoDB...')
    return mongo.connect()
})
.then(() => {
    console.log('Connected with MongoDB')
    console.log('Starting a server')
    runServer()
})
.catch(e => console.error(e))


const runServer = () => {
    server.use('/v1', app)
    server.listen(process.env.API_PORT, () => console.log(`Server is listening on port ${process.env.API_PORT}`))
}