import db from '../db'

export function getContractTypes() {
    return db.select('*').from('contract-types')
}
