import { plainToClassFromExist } from "class-transformer"

export default <T>(target: any, source: Object) => {
    return plainToClassFromExist<T, Object>(target, source, {
        excludeExtraneousValues: true,
        exposeDefaultValues: true
    })
}