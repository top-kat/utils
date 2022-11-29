export class dataValidationUtilErrorHandler extends Error {
    fromDataValidation: boolean
    code: number
    extraInfos: object
    msg: string
    errorDescription: { [k: string]: any }
    constructor(msg, code, extraInfos?) {
        super(msg)
        this.message = msg
        this.msg = msg
        this.name = `${code} ${msg}`
        this.fromDataValidation = true // will be catched by express error handler
        this.code = code
        this.extraInfos = extraInfos
        this.errorDescription = {
            msg,
            code,
            ...extraInfos,
        }
    }
}