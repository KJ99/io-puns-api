import { Expose } from "class-transformer"

export default class JoinRoomRequestViewModel {
    
    @Expose()
    accessKey: string
}