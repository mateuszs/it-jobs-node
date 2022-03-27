import db from './../db'

export interface GetOffersParams {
    offerId?: string
    categoryId?: string
    filters?: {
        seniorityId?: string
        salaryFrom?: string
        salaryTo?: string
        contractTypeId?: string
        benefitIds?: string[]
    }
    page?: number
    limit?: number
    sort?: {
        orderBy: string
        direction: string
    }
    search?: string
}

interface GetOffersRequestQueryParams {
    category?: string
    seniority?: string
    salary_from?: string
    salary_to?: string
    contract_type?: string
    benefits?: string
    page?: string
    limit?: string
    order_by?: string
    sort_direction?: string
    search?: string
    offerId?: string
}

export function mapGetOffersQueryParams(
    query: GetOffersRequestQueryParams
): GetOffersParams {
    return {
        offerId: query.offerId,
        categoryId: query.category,
        filters: {
            seniorityId: query.seniority,
            salaryFrom: query.salary_from,
            salaryTo: query.salary_to,
            contractTypeId: query.contract_type,
            benefitIds: query.benefits?.split(',') ?? []
        },
        page: Number(query.page ?? '1'),
        limit: Number(query.limit ?? '2'),
        sort: {
            direction: query.sort_direction ?? 'desc',
            orderBy: query.order_by ?? 'id'
        },
        search: query.search ? `%${query.search?.toLowerCase()}%` : undefined
    }
}

export async function getOffers(params: GetOffersRequestQueryParams) {
    const { page, limit, sort, search, categoryId, filters, offerId } =
        mapGetOffersQueryParams(params)

    const query = db
        .select('offers.*', 'seniorities.name as seniority_name')
        .from('offers')
        .join('seniorities', 'seniorities.id', 'offers.id_seniority')

    if (offerId) {
        query.where('offers.id', '=', offerId)
    }

    if (categoryId) {
        query.whereIn(
            'offers.id',
            db
                .select('id_offer')
                .from('offer_category')
                .where('id_category', '=', categoryId)
        )
    }

    if (filters?.benefitIds?.length) {
        query.whereIn(
            'offers.id',
            db
                .select('id_offer')
                .from('offer_benefit')
                .whereIn('id_benefit', filters.benefitIds)
        )
    }

    if (filters?.seniorityId) {
        query.where('id_seniority', '=', filters.seniorityId)
    }

    if (filters?.contractTypeId) {
        query.whereIn(
            'offers.id',
            db
                .select('id_offer')
                .from('offer_contract-type')
                .where('id_contract-type', '=', filters.contractTypeId)
        )
    }

    if (filters?.salaryFrom && filters.salaryTo) {
        query.whereIn(
            'offers.id',
            db
                .select('id_offer')
                .from('offer_contract-type')
                .where('salary_from', '>=', filters.salaryFrom)
                .andWhere('salary_to', '<=', filters.salaryTo)
        )
    }

    if (search) {
        query
            .whereRaw('LOWER(title) LIKE ?', [search ?? '%'])
            .orWhereRaw('LOWER(description) LIKE ?', [search ?? '%'])
            .orWhereRaw('LOWER(company_city) LIKE ?', [search ?? '%'])
    }

    if (sort) {
        query.orderBy(sort?.orderBy, sort?.direction)
    }

    if (limit) {
        query.limit(limit)

        if (page) {
            query.offset((page - 1) * limit)
        }
    }

    const results = await query

    const promises = results.map(
        async ({ id, id_seniority, seniority_name, ...rest }) => {
            const salary = await db
                .select(
                    'contract-types.name',
                    'offer_contract-type.salary_from',
                    'offer_contract-type.salary_to'
                )
                .from('offer_contract-type')
                .join(
                    'contract-types',
                    'contract-types.id',
                    'offer_contract-type.id_contract-type'
                )
                .where('id_offer', '=', id)

            const categories = await db
                .select('categories.*')
                .from('offer_category')
                .join(
                    'categories',
                    'categories.id',
                    'offer_category.id_category'
                )
                .where('offer_category.id_offer', '=', id)

            const benefits = await db
                .select('benefits.*')
                .from('offer_benefit')
                .join('benefits', 'benefits.id', 'offer_benefit.id_benefit')
                .where('offer_benefit.id_offer', '=', id)

            return {
                id,
                benefits,
                salary,
                categories,
                seniority: {
                    id: id_seniority,
                    name: seniority_name
                },
                ...rest
            }
        }
    )

    const offers = await Promise.all(promises)

    return {
        records: offers,
        total_count: 100
    }
}
