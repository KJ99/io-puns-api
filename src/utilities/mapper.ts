import { classToClassFromExist, classToPlainFromExist, plainToClassFromExist } from "class-transformer";

export default class Mapper {
    classToClass<T>(source: T, target: any) {
        return classToClassFromExist<T>(target, source, {
            excludeExtraneousValues: true,
            exposeDefaultValues: true
        })
    }
    
    plainToClass<T>(target: T, source: Object) {
        return plainToClassFromExist(target, source, {
            excludeExtraneousValues: true,
            exposeDefaultValues: true
        })
    }

    classToPlain(source:any) {
        return classToPlainFromExist(source, {}, {
            excludeExtraneousValues: true,
            exposeDefaultValues: true
        })
    }
}