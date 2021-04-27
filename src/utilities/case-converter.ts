import Naming from '../enums/naming'

export default class CaseConverter {

    public convert(source: Naming, dest: Naming, obj: any) {
        let result: any
        if(Array.isArray(obj)) {
            result = obj.map(item => this.convert(source, dest, item))
        } else if(obj != null && typeof obj == 'object') {
            result = this.convertObject(source, dest, obj)
        } else {
            result = obj
        }
        return result
    }

    private convertObject(source: Naming, dest: Naming, obj: Object) {
        let targetObject = Object.create({})
        Object.keys(obj).forEach(key => {
            const name = this.convertName(source, dest, key)
            const value = Object.getOwnPropertyDescriptor(obj, key) != null 
            ?  Object.getOwnPropertyDescriptor(obj, key)!.value
            : null
            if(Array.isArray(value)) {
                targetObject[name] = this.convert(source, dest, value)
            } else if(value != null && typeof value == 'object') {
                targetObject[name] = this.convertObject(source, dest, value)
            } else {
                targetObject[name] = value
            }
        })
        return targetObject
    }

    public convertName(source: Naming, dest: Naming, propertyName: string) {
        let result: string
        switch (dest) {
            case Naming.SneakCase:
                result = this.convertToSneakCase(source, propertyName)
                break
            case Naming.CamelCase:
                result = this.convertToCamelCase(source, propertyName)
                break
            case Naming.PascalCase:
                result = this.convertToPascalCase(source, propertyName)
                break
            default:
                result = propertyName
                break;
        }
        return result
    }

    public convertToSneakCase(source: Naming, propertyName: string) {
        let result: string
        switch (source) {
            case Naming.CamelCase:
                result = propertyName.replace(/[A-Z]/g, value => `_${value.toLowerCase()}`)
                break
            case Naming.PascalCase:
                propertyName = propertyName.charAt(0).toLowerCase().concat(propertyName.substr(1))
                result = propertyName.replace(/[A-Z]/g, value => `_${value.toLowerCase()}`)
                break
            default:
                result = propertyName
                break;
        }
        return result
    }

    public convertToCamelCase(source: Naming, propertyName: string) {
        let result: string
        switch (source) {
            case Naming.SneakCase:
                result = propertyName.replace(/_[a-z]/g, value => `${value.substr(1).toUpperCase()}`)
                break
            case Naming.PascalCase:
                result = propertyName.charAt(0).toLowerCase().concat(propertyName.substr(1))
                break
            default:
                result = propertyName
                break;
        }
        return result
    }

    public convertToPascalCase(source: Naming, propertyName: string) {
        let result: string
        switch (source) {
            case Naming.SneakCase:
                result = propertyName.replace(/_[a-z]/g, value => `${value.substr(1).toUpperCase()}`)
                result = result.charAt(0).toUpperCase().concat(result.substr(1))
                break
            case Naming.CamelCase:
                result = propertyName.charAt(0).toUpperCase().concat(propertyName.substr(1))
                break
            default:
                result = propertyName
                break;
        }
        return result
    }
}