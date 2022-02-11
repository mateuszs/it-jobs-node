export enum ErrorCodes {
    REQUIRED = 'FIELD_REQUIRED',
    WRONG_FORMAT = 'WRONG_FORMAT'
}

type Value = string | number | boolean

export class CustomError {
    code
    field
    value

    constructor(code: string, field?: string, value?: Value) {
        this.code = code

        if (field) {
            this.field = field
        }
        if (value) {
            this.value = value
        }
    }
}

const validations: Record<ErrorCodes, Function> = {
    [ErrorCodes.REQUIRED]: (value: Value) => value,
    [ErrorCodes.WRONG_FORMAT]: (value: Value, reg: RegExp) =>
        reg.test(value.toString())
}

export function validate(
    value: Value,
    field: string,
    code: ErrorCodes,
    ...args: any[]
) {
    if (!validations[code](value, ...args)) {
        throw new CustomError(code, field, value)
    }
}
