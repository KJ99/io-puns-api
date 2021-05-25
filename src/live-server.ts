import dotEnv from 'dotenv'
dotEnv.config({ path: __dirname + '/../.env' })
console.log(process.env.DATABASE_NAME)

import * as Websocket from 'websocket'
import http from 'http'
import { request } from 'express';
import * as mongo from './mongo/mongo-connection-manager'
import ConnectionManager from './live/connection-manager'

const connectionManager = new ConnectionManager()

const httpServer = http.createServer((req, res) => {
    res.writeHead(404)
    res.end();
})


const liveServer = new Websocket.server({
    httpServer: httpServer,
    autoAcceptConnections: true
})

liveServer.on('connect', (connection) => {
    connectionManager.addConnection(connection)
})

mongo.connect()
.then(() => httpServer.listen(process.env.WS_PORT, () => console.log(`Server is listening ${process.env.WS_PORT}`)))
.catch(e => console.error(e))

