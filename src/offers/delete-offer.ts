import db from './../db'

export async function deleteOffer(offerId: string) {
    return db.delete().from('offers').where('id', '=', offerId)
}
