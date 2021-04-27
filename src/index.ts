import { getConnectionOptions, Connection, createConnection } from 'typeorm'
import express from 'express'
import app from './app'

const server = express()

// 3. Endpointy
// 4. Generowanie API Keys
// 5. Autoryzacja API Keys


getConnectionOptions('default')
.then(opt => {
    return createConnection(opt)
})
.then((conn: Connection) => {
    runServer()
})
.catch(e => console.error(e))


const runServer = () => {
    server.use('/v1', app)
    server.listen(3000, () => console.log(`Server is listening on port ${3000}`))
}