import * as Websocket from 'websocket'
import MessageTopic from '../enums/message-topic'
import Room, { IPlayer, IRoom, IWord } from '../mongo/room'
import md5 from 'md5'
import randomString from 'randomstring'

export default class RoomManager {
    roomKey: String
    private _connections: Array<Websocket.connection> = new Array<Websocket.connection>()

    private _isWinnerSet: boolean = false
    private _currentRound: number = 0
    private _presenter: IPlayer|null = null

    private _roundStart: number = 0
    private _roundTimeLimit = 60 * 1000
    private _roundPoints = 10

    private _finishedListenerId: any

    public async addPlayer(connection: Websocket.connection, messageBody: any) {
        const playerId = this.generatePlayerId()
        const room = await this.getRoom()
        const player = { id: playerId, nickname: messageBody.nickname, avatar: messageBody.avatar }
        if(room.status == 'OPEN') {
            await Room.updateOne({
                roomKey: this.roomKey
            }, {
                $push: { players: player }
            })
            this.sendUserJoinedMessage(connection, player)
            this._connections.push(connection)
            this.sendWelcomeMessage(playerId, connection)
            this.setUpHandlers(connection)
        }
    }

    private generatePlayerId() {
        const { PLAYER_ID_PREFIX_LENGTH, PLAYER_ID_POSTFIX_LENGTH } = process.env
        return md5(randomString.generate(PLAYER_ID_PREFIX_LENGTH) + Date.now() + randomString.generate(PLAYER_ID_POSTFIX_LENGTH))
    }

    private async getRoom(): Promise<IRoom> {
        return (await Room.findOne({ roomKey: this.roomKey }))!
    }

    private async sendWelcomeMessage(playerId: String, connection: Websocket.connection) {
        const room = await this.getRoom()
        const message = {
            topic: MessageTopic.WELCOME,
            body: {
                you: playerId,
                players: room.players
            }
        }
        connection.sendUTF(JSON.stringify(message))
    }

    private async setUpHandlers(connection: Websocket.connection) {
        connection.on('message', (message) => {
            try {
                const json = JSON.parse(message.utf8Data!)
                switch(json.topic) {
                    case MessageTopic.READY:
                        this.handleReadyMessage(connection, json.body)
                        break
                    case MessageTopic.SET_WINNER:
                        this.handleSetWinnerMessage(connection, json.body)
                        break
                }
            } catch(e) {
                console.error(e)
            }
        })
    }   

    private async handleReadyMessage(connection: Websocket.connection, message: any) {
        console.log(`Received READY Message from player ${message.player}`)
        let room = await this.getRoom()
        if(room.players.findIndex(p => p.id == message.player && !p.ready) >= 0) {
            console.log(`Changing status of player to ready`)
            await Room.updateOne({roomKey: this.roomKey, 'players.id': message.player}, { 'players.$.ready': true })
        }
        room = await this.getRoom()
        const readyPlayers = room.players.filter(p => p.ready)
        console.log(`There is ${readyPlayers.length} of ${room.players.length} ready players`)
        if(readyPlayers.length == room.players.length) {
            console.log(`Starting a game`)
            await Room.updateOne({ roomKey: this.roomKey }, { status: 'NOT.WELCOME' })
            await this.prepareGame()
            await this.sendNextRoundMessage()
        }
    }

    private async handleSetWinnerMessage(connection: Websocket.connection, message: any) {
        console.log(`Received message SET WINNER from player ${message.player}`)
        if(this._presenter == null || message.player != this._presenter.id) {
            console.warn(`Sender is not a presenter`)
            return
        }
        this._isWinnerSet = true
        clearTimeout(this._finishedListenerId)
        const timeElapsed = Date.now() - this._roundStart
        const room = await this.getRoom()
        console.warn(`Selected winner: ${message.winner}`)
        if(room.players.findIndex(p => p.id == message.winner) >= 0) {
            console.log(`Updating points score`)
            const points = this.calcPoints(timeElapsed)
            await Room.updateOne({
                roomKey: this.roomKey,
                'players.id': message.player
            }, { 
                $inc: { 'players.$.points': points  }
            })
            await Room.updateOne({
                roomKey: this.roomKey,
                'players.id': message.winner
            }, { 
                $inc: { 'players.$.points': points  }
            })
            await this.sendRoundFinishedMessage(message.winner, points)  
            setTimeout(async () => {
                if(this._currentRound < room.words.length) {
                    await this.sendRankingMessage()
                    setTimeout(async () => {
                        await this.sendNextRoundMessage()
                    }, 5 * 1000)
                } else {
                    await this.sendGameFinishedMessage()
                    setTimeout(async () => {
                        await this.sendRankingMessage()
                    }, 5 * 1000)
                }
            }, 5 * 1000) 
        }
    }

    private calcPoints(elapsedTime: number) {
        const percentage = (elapsedTime / this._roundTimeLimit) * 100
        let subtractFactor
        if(percentage <= 25) {
            subtractFactor = 0
        } else if(percentage <= 50) {
            subtractFactor = 0.2
        } else if(percentage <= 75) {
            subtractFactor = 0.4
        } else if(percentage <= 90) {
            subtractFactor = 0.6
        } else {
            subtractFactor = 0.8
        }
        
        return this._roundPoints - (this._roundPoints * subtractFactor)
    }

    private async prepareGame() {
        const room = await this.getRoom()
        const allWords = new Array<IWord>()
        for(let key in room.categories) {
            allWords.push(...room.categories[key].words.map(w => { return { name: w, category: room.categories[key].name } }))
        }
        const neededWords = room.maxRounds * room.players.length
        const words = []
        for(let i = 0; i < neededWords; i++) {
            const index = Math.round(Math.random() * (allWords.length - 1))
            words.push(allWords[index])
        }
        await Room.updateOne({ roomKey: this.roomKey }, { words: words })
    }

    private async sendNextRoundMessage() {
        this._currentRound++
        console.log(`Starting round ${this._currentRound}`)
        this._isWinnerSet = false
        const index = this._currentRound - 1
        const room = await this.getRoom()
        this._presenter = room.players[index % room.players.length]
        const word = room.words[index]
        const message = {
            topic: MessageTopic.NEXT_ROUND,
            body: {
                presenter: {
                    id: this._presenter.id,
                    nickname: this._presenter.nickname
                },
                word: word
            }
        }
        this._connections.forEach(conn => {
            conn.sendUTF(JSON.stringify(message))
        })
        this._roundStart = Date.now()
        this._finishedListenerId = setTimeout(this.onRoundEnd.bind(this), this._roundTimeLimit)
    }

    private sendUserJoinedMessage(connection: Websocket.connection, player: any) {
        const message = {
            topic: MessageTopic.USER_JOINED,
            body: player
        }
        this._connections.forEach(conn => {
            conn.sendUTF(JSON.stringify(message))
        })
    }

    private async sendRoundFinishedMessage(winnerId: string, points: number) {
        const player = (await this.getRoom()).players.find(p => p.id == winnerId)!
        const message = {
            topic: MessageTopic.ROUND_FINISHED,
            body: {
                winner: player != null ? player.nickname : null, 
                points: points
            }
        }
        this._connections.forEach(conn => {
            conn.sendUTF(JSON.stringify(message))
        })
    }

    private async sendRankingMessage() {
        console.log('Sending a ranking to all players')
        const players = (await this.getRoom()).players.sort((a, b) => b.points - a.points)
        const message = {
            topic: MessageTopic.RANKING,
            body: players.map(p => { return { nickname: p.nickname, avatar: p.avatar, points: p.points } })
        }
        
        this._connections.forEach(conn => {
            conn.sendUTF(JSON.stringify(message))
        })
    }

    private async sendGameFinishedMessage() {
        await Room.updateOne({ roomKey: this.roomKey }, { status: 'CLOSED' })
        const room = await this.getRoom()
        const winner = room.players.sort((a, b) => b.points - a.points)[0]
        const message = {
            topic: MessageTopic.GAME_FINISHED,
            body: {
                winner: winner
            }
        }
        this._connections.forEach(conn => {
            conn.sendUTF(JSON.stringify(message))
            conn.close()
        })
    }

    private async onRoundEnd() {
        if(this._isWinnerSet) {
            return
        }
        this._presenter = { id: '', avatar: '', nickname: '', points: 0, ready: false}
        const room = await this.getRoom()
        await this.sendRoundFinishedMessage('', 0)
        setTimeout(async () => {
            if(this._currentRound < room.words.length) {
                await this.sendRankingMessage()
                setTimeout(async () => {
                    await this.sendNextRoundMessage()
                }, 5 * 1000)
            } else {
                await this.sendGameFinishedMessage()
                setTimeout(async () => {
                    await this.sendRankingMessage()
                }, 5 * 1000)
            }
        }, 5 * 1000) 
    }    
}