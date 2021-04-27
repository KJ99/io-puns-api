import express from 'express'
import categoriesController from './controllers/categories-controller'
import wordsController from './controllers/words-controller'

const app = express()

app.use(express.json())

app.use('/categories', categoriesController)
app.use('/words', wordsController)



export default app