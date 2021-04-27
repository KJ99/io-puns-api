import { EntityManager, FindManyOptions } from "typeorm";
import Category from "../entities/category";
import { getConnection } from "typeorm";
import CategoryRequestViewModel from "../view-models/category-request-view-model";
import { classToClassFromExist } from "class-transformer";
import BadRequestError from "../errors/bad-request-error";
import Mapper from "../utilities/mapper";
import NotFoundError from "../errors/not-found-error";

export default class CategoryService {
    private _entityManager: EntityManager
    private _mapper: Mapper

    constructor() {
        this._entityManager = getConnection().createEntityManager()
        this._mapper = new Mapper()
    }

    async create(data: CategoryRequestViewModel): Promise<Category> {
        if(data.name.trim() == null) {
            throw new BadRequestError({ path: 'name', code: 'PE-001', message: 'Name cannot be blank' })
        }
        const category = this._mapper.classToClass<Category>(new Category(), data)

        return await this._entityManager.save(category)
    }

    async update(categoryId: any, data: any): Promise<Category> {
        if(data.name.trim() == null) {
            throw new BadRequestError({ path: 'name', code: 'PE-001', message: 'Name cannot be blank' })
        }
        const category = this._mapper.classToClass<Category>(new Category(), data)
        category.id = categoryId
        return await this._entityManager.save(category)
    }

    async find(activeOnly: boolean = true) {
        let options: FindManyOptions = {}
        options.loadEagerRelations = true
        if(activeOnly) {
            options.where = { active: true }
        }
        const categories: Category[] = await this._entityManager.find(Category, options)
        return categories
    }

    async findById(id: number, activeOnly: boolean = true) {
        let options: FindManyOptions = {}
        options.loadEagerRelations = true
        options.where = {}
        if(activeOnly) {
            options.where.active = true
        }
        options.where.id = id
        const category: Category = await this._entityManager.findOne(Category, options)
        if(category == null) {
            throw new NotFoundError()
        }
        return category
    }

    async delete(categoryId: any) {
        const category = await this._entityManager.findOne(Category, { where: { id: categoryId } })
        if(category == null) {
            throw new NotFoundError()
        }
        return await this._entityManager.remove(Category, category)
    }
}