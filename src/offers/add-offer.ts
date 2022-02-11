import { getOffers } from './get-offers'
import db from '../db'
import { ErrorCodes, validate } from '../utils'

interface AddOfferPayload {
    title: string
    duration: number
    description: string
    thumb: string
    salary_from: string
    salary_to: string
    company_name: string
    company_city: string
    required_experience: string
    category_ids: number[]
}

export async function addOffer(payload: AddOfferPayload) {
    const {
        title,
        description,
        required_experience,
        company_city,
        duration,
        thumb,
        company_name,
        category_ids,
        salary_from,
        salary_to
    } = payload

    validate(title, 'title', ErrorCodes.REQUIRED)
    validate(company_city, 'company_city', ErrorCodes.REQUIRED)
    validate(
        company_city,
        'company_city',
        ErrorCodes.WRONG_FORMAT,
        new RegExp(/^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]*$/g)
    )
    validate(!!category_ids.length, 'category_ids', ErrorCodes.REQUIRED)
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

    const [offerId] = await db('offers').insert({
        title,
        description,
        required_experience,
        duration,
        salary_from,
        salary_to,
        company_city,
        company_name,
        thumb,
        date: new Date().toISOString()
    })

    const categoriesPayload = category_ids.map((id) => ({
        id_category: id,
        id_offer: offerId
    }))

    await db('offer_category').insert(categoriesPayload)

    return getOffers({ offerId: offerId.toString() })
}
