import db from '../db'

export function getCategories() {
    return db.select('*').from('categories')
}
