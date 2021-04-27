import { Expose } from "class-transformer"

export default class CategoryResponseViewModel {

    @Expose()
    id: number

    @Expose()
    name: string

    @Expose()
    active: boolean
}