import express, { request } from 'express'
import Word from '../entities/word'
import Naming from '../enums/naming'
import HttpError from '../errors/http-error'
import WordService from '../services/word-service'
import CaseConverter from '../utilities/case-converter'
import getRequestData from '../utilities/get-request-data'
import Mapper from '../utilities/mapper'
import WordRequestViewModel from '../view-models/word-request-view-model'
const app = express()

const mapper = new Mapper() 
const caseConverter = new CaseConverter()

app.post('/', (req, res) => {
    const wordService = new WordService()
    const viewModel: WordRequestViewModel = getRequestData(req, new WordRequestViewModel())
    wordService.create(viewModel)
    .then(word => {
        const vm = mapper.classToPlain(word)
        res.status(201)
        res.json(caseConverter.convert(Naming.CamelCase, Naming.SneakCase, vm))
    })
    .catch(e => {
        if(e instanceof HttpError) {
            res.status(e.statusCode)
            if(e.error != null) {
                res.json(caseConverter.convert(Naming.CamelCase, Naming.SneakCase, e.error))
            } else {
                res.end()
            }
        } else {
            console.log(e)
            res.sendStatus(500)
        }
    })
})

app.patch('/:id', (req, res) => {
    const wordService = new WordService()
    const viewModel: WordRequestViewModel = getRequestData(req, new WordRequestViewModel())
    wordService.update(req.params.id, viewModel)
    .then(word => {
        const vm = mapper.classToPlain(word)
        res.status(200)
        res.json(caseConverter.convert(Naming.CamelCase, Naming.SneakCase, vm))
    })
    .catch(e => {
        if(e instanceof HttpError) {
            res.status(e.statusCode)
            if(e.error != null) {
                res.json(caseConverter.convert(Naming.CamelCase, Naming.SneakCase, e.error))
            } else {
                res.end()
            }
        } else {
            console.log(e)
            res.sendStatus(500)
        }
    })
})


app.get('/', (req, res) => {
    const wordService = new WordService()
    wordService.find()
    .then(words => {
        const vms = words.map(item => mapper.classToPlain(item))
        const converted = vms.map(item => caseConverter.convert(Naming.CamelCase, Naming.SneakCase, item))
        res.status(200)
        res.json(converted)
    })
    .catch(e => {
        if(e instanceof HttpError) {
            res.status(e.statusCode)
            if(e.error != null) {
                res.json(caseConverter.convert(Naming.CamelCase, Naming.SneakCase, e.error))
            } else {
                res.end()
            }
        } else {
            console.log(e)
            res.sendStatus(500)
        }
    })
})



app.get('/:id', (req, res) => {
    const wordService = new WordService()
    wordService.find()
    .then(word => {
        const vm = mapper.classToPlain(word)
        const converted = caseConverter.convert(Naming.CamelCase, Naming.SneakCase, vm)
        res.status(200)
        res.json(converted)
    })
    .catch(e => {
        if(e instanceof HttpError) {
            res.status(e.statusCode)
            if(e.error != null) {
                res.json(caseConverter.convert(Naming.CamelCase, Naming.SneakCase, e.error))
            } else {
                res.end()
            }
        } else {
            console.log(e)
            res.sendStatus(500)
        }
    })
})

export default app