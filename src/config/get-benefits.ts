import db from '../db'

export function getBenefits() {
    return db.select('*').from('benefits')
}
