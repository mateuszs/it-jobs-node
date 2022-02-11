import db from './../db'

export interface GetOffersQueryParams {
    offerId?: string
    categoryId?: string
    page?: number
    limit?: number
    sort?: {
        orderBy: string
        direction: string
    }
    search?: string
}

export interface GetOffersByCategoryQueryParams {
    categoryId: string
    sort?: {
        orderBy: string
        direction: string
    }
    limit?: number
}

export async function getOffers({
    page,
    limit,
    sort,
    search,
    categoryId,
    offerId
}: GetOffersQueryParams) {
    const sortBy = sort?.orderBy ?? 'id'
    const sortDirection = sort?.direction ?? 'desc'
    search = search ? `%${search?.toLowerCase()}%` : undefined
    page = page ?? 1

    const totalCountQuery = db.select(1).from('offers').count('id')
    const query = db.select('*').from('offers')

    if (offerId) {
        query.where('id', '=', offerId)
    }

    if (categoryId) {
        query.whereIn(
            'id',
            db
                .select('id_offer')
                .from('offer_category')
                .where('id_category', '=', categoryId)
        )
    }

    if (search) {
        query
            .whereRaw('LOWER(title) LIKE ?', [search ?? '%'])
            .orWhereRaw('LOWER(description) LIKE ?', [search ?? '%'])
            .orWhereRaw('LOWER(company_city) LIKE ?', [search ?? '%'])
    }

    query.orderBy(sortBy, sortDirection)

    if (limit) {
        query.limit(limit)
        query.offset((page - 1) * limit)
    }

    const results = await query
    const [totalCountQueryResult] = await totalCountQuery
    const [, totalCount] = Object.values(totalCountQueryResult)

    return {
        records: results,
        total_count: totalCount
    }
}
