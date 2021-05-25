
import express from 'express'
import Naming from '../enums/naming'
import HttpError from '../errors/http-error'
import RoomService from '../services/room-service'

import CaseConverter from '../utilities/case-converter'
import getRequestData from '../utilities/get-request-data'
import Mapper from '../utilities/mapper'
import JoinRoomRequestViewModel from '../view-models/join-room-request-view-model'
import RoomRequestViewModel from '../view-models/room-request-view-model'

const app = express()

const mapper = new Mapper() 
const caseConverter = new CaseConverter()

app.post('/', (req, res) => {
    const roomService = new RoomService()
    const viewModel: RoomRequestViewModel = getRequestData(req, new RoomRequestViewModel())
    roomService.create(viewModel)
    .then(room => {
        res.status(201)
        res.json(caseConverter.convert(Naming.CamelCase, Naming.SneakCase, room))
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

app.get('/:key/rank', (req, res) => {
    const roomService = new RoomService()
    roomService.getRank(req.params.key)
    .then(data => {
        console.log(data)
        res.status(200)
        res.json(caseConverter.convert(Naming.CamelCase, Naming.SneakCase, data))
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

app.post('/join', (req, res) => {
    const roomService = new RoomService()
    const viewModel: JoinRoomRequestViewModel = getRequestData(req, new JoinRoomRequestViewModel())
    roomService.join(viewModel)
    .then(room => {
        res.status(202)
        res.json(caseConverter.convert(Naming.CamelCase, Naming.SneakCase, room))
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