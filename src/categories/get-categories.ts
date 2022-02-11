import db from './../db'

export async function getCategories() {
    const results = await db.select('*').from('categories')

    return results
}
