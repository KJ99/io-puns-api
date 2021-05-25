import { Expose } from "class-transformer"

export default class RoomRequestViewModel {
    
    @Expose()
    maxRounds: number = 1
    
    @Expose()
    categories: Array<number>|null = []
}