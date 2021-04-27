import ValidationError from "../models/validation-error";
import HttpError from "./http-error";

export default class BadRequestError extends HttpError {
    statusCode: number = 400
    error: ValidationError

    constructor(error: ValidationError) {
        super()
        this.error = error
    }
}