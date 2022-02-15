import db from '../db'

export function getSeniorities() {
    return db.select('*').from('seniorities')
}
