import hash from 'sha256'
import express from 'express'
import base64 from 'base-64'

export default (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const headerValue = req.headers.authorization
    const parts = headerValue != null ? headerValue.split(' ') : []
    if(parts.length == 2 && parts[0] == 'Basic') {
        const decoded = base64.decode(parts[1]).split(':')
        if(decoded.length == 2 && decoded[0] === process.env.ADMIN_LOGIN && hash(decoded[1]) === process.env.ADMIN_PASSWORD) {
            next()
        } else {
            res.sendStatus(403)
        }
    } else {
        res.sendStatus(403)
    }
}