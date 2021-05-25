import express from 'express'
import categoriesController from './controllers/categories-controller'
import wordsController from './controllers/words-controller'
import roomsController from './controllers/rooms-controller'
import authenticator from './middlewares/authenticator'

const app = express()

app.use(express.json())
app.use(authenticator)

app.use('/categories', categoriesController)
app.use('/words', wordsController)
app.use('/rooms', roomsController)



export default app