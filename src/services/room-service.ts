import BadRequestError from "../errors/bad-request-error";
import RoomRequestViewModel from "../view-models/room-request-view-model";
import md5 from 'md5'
import randomString from 'randomstring'
import Room, { ICategory } from '../mongo/room'
import { EntityManager, FindManyOptions, getConnection } from "typeorm";
import Category from "../entities/category";
import Word from "../entities/word";
import NotFoundError from "../errors/not-found-error";
import JoinRoomRequestViewModel from "../view-models/join-room-request-view-model";
import ForbiddenError from "../errors/forbidden-error";

export default class RoomService {
    
    private _entityManager: EntityManager
    constructor() {
        this._entityManager = getConnection().createEntityManager()
    }
    
    async create(model: RoomRequestViewModel) {
        const { ACCESS_KEY_LENGTH, ROOM_KEY_PREFIX_LENGTH, ROOM_KEY_POSTFIX_LENGTH } = process.env
        const roomModel = new Room({
            accessKey: randomString.generate({ length: Number(ACCESS_KEY_LENGTH), charset: 'alphanumeric' }),
            roomKey: this.generateRoomKey(Number(ROOM_KEY_PREFIX_LENGTH), Number(ROOM_KEY_POSTFIX_LENGTH)),
            maxRounds: model.maxRounds,
            categories: await this.getCategories(model)
        })
        const room = await roomModel.save()
        return { key: room.accessKey }
    }

    private generateRoomKey(prefixLength: number, postfixLength: number): String {
        return md5(randomString.generate(prefixLength) + Date.now() + randomString.generate(postfixLength))
    }


    private async getCategories(model: RoomRequestViewModel): Promise<Array<ICategory>> {
        let options: FindManyOptions = {}
        options.loadEagerRelations = true
        if(model.categories != null && model.categories.length > 0) {
            options.where = model.categories.map(c => { return { id: c } })
        }
        const fullList = await this._entityManager.find(Category, options)
        return fullList.filter(c => c.active).map(item => { return { name: item.name, words: item.words.filter((w: Word) => w.active).map((i: Word) => i.name) } })
    }

    public async getRank(key: string) {
        const room = await Room.findOne({ roomKey: key })
        if(room == null) {
            throw new NotFoundError()
        }
        const players = room.players.sort((a, b) => b.points - a.points)
        return players.map(p => { return { id: p.id, nickname: p.nickname, avatar: p.avatar, points: p.points } })
    }

    public async join(request: JoinRoomRequestViewModel) {
        const room = await Room.findOne({ accessKey: request.accessKey })
        if(room == null) {
            throw new ForbiddenError()
        }
        return { key: room.roomKey }
    }
}