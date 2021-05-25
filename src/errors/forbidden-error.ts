import HttpError from "./http-error";

export default class ForbiddenError extends HttpError {
    statusCode: number = 403
}