import express, { request } from 'express'
import Category from '../entities/category'
import Naming from '../enums/naming'
import HttpError from '../errors/http-error'
import CategoryService from '../services/category-service'
import CaseConverter from '../utilities/case-converter'
import getRequestData from '../utilities/get-request-data'
import Mapper from '../utilities/mapper'
import CategoryRequestViewModel from '../view-models/category-request-view-model'
const app = express()

const mapper = new Mapper() 
const caseConverter = new CaseConverter()

app.post('/', (req, res) => {
    const categoryService = new CategoryService()
    const viewModel: CategoryRequestViewModel = getRequestData(req, new CategoryRequestViewModel())
    categoryService.create(viewModel)
    .then(category => {
        const vm = mapper.classToPlain(category)
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
    const categoryService = new CategoryService()
    const viewModel: CategoryRequestViewModel = getRequestData(req, new CategoryRequestViewModel())
    categoryService.update(req.params.id, viewModel)
    .then(category => {
        const vm = mapper.classToPlain(category)
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
    const categoryService = new CategoryService()
    categoryService.find()
    .then(categories => {
        const vms = categories.map(item => mapper.classToPlain(item))
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
    const categoryService = new CategoryService()
    categoryService.findById(parseInt(req.params.id))
    .then(category => {
        const vm = mapper.classToPlain(category)
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