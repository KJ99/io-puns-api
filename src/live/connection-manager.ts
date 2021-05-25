import * as Websocket from 'websocket'
import MessageTopic from '../enums/message-topic'
import Room, { IRoom } from '../mongo/room'
import RoomManager from './room-manager'

export default class ConnectionManager {
    private _connections: Array<Websocket.connection> = new Array<Websocket.connection>()
    private _rooms: Array<RoomManager> = new Array<RoomManager>()

    public async addConnection(connection: Websocket.connection) {
        console.log(`Established connection with ${connection.socket.remoteAddress}`)
        this._connections.push(connection)
        connection.on('message', message => {
            try {
                const messageData = JSON.parse(message.utf8Data!)
                if(typeof messageData.topic == 'string' && messageData.topic == MessageTopic.JOIN_GAME) {
                    this.tryAddtoGame(connection, messageData.body)
                }
            } catch(e) {
                console.warn(e)
            }
        })
    }

    private async tryAddtoGame(connection: Websocket.connection, messageBody: any) {
        const room = await Room.findOne({ roomKey: messageBody.key })
        if(!room || !this.validateJoinMessage(messageBody)) {
            console.warn('Cannot join to the game')
            return
        }
        const manager = this.getRoomManager(room)
        manager.addPlayer(connection, messageBody)

    }

    private getRoomManager(room: IRoom) {
        const existingRoom = this._rooms.find(it => it.roomKey == room.roomKey)
        return existingRoom != null ? existingRoom : this.createRoomManager(room.roomKey)
    }

    private createRoomManager(roomKey: String) {
        const manager = new RoomManager()
        manager.roomKey = roomKey
        this._rooms.push(manager)
        return manager
    }

    private validateJoinMessage(messageBody: any) {
        return typeof messageBody == 'object' && 
            typeof messageBody.nickname == 'string' &&
            typeof messageBody.avatar == 'string'
    }
}