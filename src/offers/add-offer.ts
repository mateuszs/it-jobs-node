import { getOffers } from './get-offers'
import db from '../db'
import { ErrorCodes, validate } from '../utils'

interface AddOfferPayload {
    title: string
    duration: number
    description: string
    thumb: string
    company_name: string
    company_city: string
    seniority_id: string
    category_ids: string[]
    benefit_ids: string[]
    contracts: {
        salary_from: string
        salary_to: string
        contract_type_id: string
    }[]
}

interface OfferData {
    id_seniority: string
    title: string
    description: string
    duration: number
    company_city: string
    company_name: string
    thumb: string
    date: string
    category_ids: string[]
    benefit_ids: string[]
    contracts: {
        salary_from: string
        salary_to: string
        contract_type_id: string
    }[]
}

function mapAddOfferPayload(payload: AddOfferPayload): OfferData {
    return {
        id_seniority: payload.seniority_id,
        title: payload.title,
        description: payload.description,
        duration: payload.duration,
        company_city: payload.company_city,
        company_name: payload.company_name,
        thumb: payload.thumb,
        contracts: payload.contracts,
        category_ids: payload.category_ids,
        benefit_ids: payload.benefit_ids ?? [],
        date: new Date().toISOString()
    }
}

export async function addOffer(payload: AddOfferPayload) {
    const {
        title,
        description,
        date,
        id_seniority,
        company_city,
        duration,
        thumb,
        company_name,
        category_ids,
        contracts,
        benefit_ids
    } = mapAddOfferPayload(payload)

    validate(title, 'title', ErrorCodes.REQUIRED)
    validate(company_city, 'company_city', ErrorCodes.REQUIRED)
    validate(id_seniority, 'seniority', ErrorCodes.REQUIRED)
    validate(
        company_city,
        'company_city',
        ErrorCodes.WRONG_FORMAT,
        new RegExp(/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]*$/g)
    )
    validate(!!category_ids.length, 'category_ids', ErrorCodes.REQUIRED)
    validate(!!contracts.length, 'contracts', ErrorCodes.REQUIRED)

    contracts.forEach(({ salary_from, salary_to }) => {
        validate(salary_from, 'salary_from', ErrorCodes.REQUIRED)
        validate(salary_to, 'salary_to', ErrorCodes.REQUIRED)
        validate(
            salary_from,
            'salary_from',
            ErrorCodes.WRONG_FORMAT,
            new RegExp(/^\d*\.?\d*$/g)
        )
        validate(
            salary_to,
            'salary_to',
            ErrorCodes.WRONG_FORMAT,
            new RegExp(/^\d*\.?\d*$/g)
        )
    })

    const [offerId] = await db('offers').insert({
        title,
        description,
        duration,
        company_city,
        company_name,
        thumb,
        id_seniority,
        date
    })

    const categoriesPayload = category_ids.map((id) => ({
        id_category: id,
        id_offer: offerId
    }))

    const benefitsPayload = benefit_ids.map((id) => ({
        id_benefit: id,
        id_offer: offerId
    }))

    const salariesPayload = contracts.map(
        ({ contract_type_id, salary_from, salary_to }) => ({
            salary_from,
            salary_to,
            id_offer: offerId,
            'id_contract-type': contract_type_id
        })
    )

    await db('offer_category').insert(categoriesPayload)
    await db('offer_contract-type').insert(salariesPayload)

    if (benefitsPayload.length) {
        await db('offer_benefit').insert(benefitsPayload)
    }

    return getOffers({ offerId: offerId.toString() })
}
