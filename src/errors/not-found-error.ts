import HttpError from "./http-error";

export default class NotFoundError extends HttpError {
    statusCode: number = 404
}