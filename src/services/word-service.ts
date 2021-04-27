import { EntityManager, FindManyOptions, getConnection } from "typeorm"
import Category from "../entities/category"
import Word from "../entities/word"
import BadRequestError from "../errors/bad-request-error"
import NotFoundError from "../errors/not-found-error"
import Mapper from "../utilities/mapper"
import WordViewModel from "../view-models/word-request-view-model"

export default class WordService {
    private _entityManager: EntityManager
    private _mapper: Mapper

    constructor() {
        this._entityManager = getConnection().createEntityManager()
        this._mapper = new Mapper()
    }

    async create(data: WordViewModel): Promise<Word> {
        if(data.name.trim() == null) {
            throw new BadRequestError({ path: 'name', code: 'PE-001', message: 'Name cannot be blank' })
        }
        const category = await this._entityManager.findOne(Category, { where: { id: data.categoryId } })
        if(category == null) {
            throw new BadRequestError({ path: 'name', code: 'PE-002', message: 'Category does not exists' })
        }
        const word = this._mapper.classToClass<Word>(new Word(), data)
        word.category = category
        return await this._entityManager.save(word)
    }

    async update(wordId: any, data: WordViewModel): Promise<Word> {
        if(data.name.trim() == null) {
            throw new BadRequestError({ path: 'name', code: 'PE-001', message: 'Name cannot be blank' })
        }
        const category = await this._entityManager.findOne(Category, { where: { id: data.categoryId } })
        if(category == null) {
            throw new BadRequestError({ path: 'name', code: 'PE-002', message: 'Category does not exists' })
        }
        const word = this._mapper.classToClass<Word>(new Word(), data)
        word.category = category
        word.id = wordId
        return await this._entityManager.save(word)
    }

    async find(activeOnly: boolean = true) {
        let options: FindManyOptions = {}
        options.loadEagerRelations = true
        if(activeOnly) {
            options.where = { active: true }
        }
        const words: Word[] = await this._entityManager.find(Word, options)
        return words
    }

    async findById(id: number, activeOnly: boolean = true) {
        let options: FindManyOptions = {}
        options.loadEagerRelations = true
        options.where = {}
        if(activeOnly) {
            options.where.active = true
        }
        options.where.id = id
        const word: Word = await this._entityManager.findOne(Word, options)
        if(word == null) {
            throw new NotFoundError()
        }

        return word
    }

    async delete(wordId: any) {
        const word = await this._entityManager.findOne(Word, { where: { id: wordId } })
        if(word == null) {
            throw new NotFoundError()
        }
        return await this._entityManager.remove(Word, word)
    }
}