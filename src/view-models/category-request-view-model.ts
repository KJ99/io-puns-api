import { Expose } from "class-transformer"

export default class CategoryRequestViewModel {

    @Expose()
    name: string = ''

    @Expose()
    active: boolean = false
}