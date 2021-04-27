import Naming from "../enums/naming"
import CaseConverter from "./case-converter"
import Mapper from "./mapper"

export default (request: any, targetModel: any) => {
    const mapper = new Mapper()
    const caseConverter = new CaseConverter()
    return mapper.plainToClass(targetModel, caseConverter.convert(Naming.SneakCase, Naming.CamelCase, request.body))

}