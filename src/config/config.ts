import { getContractTypes } from './get-contract-types'
import { getCategories } from './get-categories'
import { getSeniorities } from './get-seniorities'
import { getBenefits } from './get-benefits'

export async function getConfig() {
    return {
        benefits: await getBenefits(),
        categories: await getCategories(),
        contract_types: await getContractTypes(),
        seniorities: await getSeniorities()
    }
}
