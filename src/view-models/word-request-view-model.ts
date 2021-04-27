import { Expose } from "class-transformer"

export default class WordRequestViewModel {
    
    @Expose()
    name: string = ''
    
    @Expose()
    active: boolean = false

    @Expose()
    categoryId: number|undefined
}