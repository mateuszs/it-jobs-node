import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import { getCategories } from './categories/get-categories'
import { getOffers, GetOffersQueryParams } from './offers/get-offers'
import { addOffer } from './offers/add-offer'
import { deleteOffer } from './offers/delete-offer'

const app = express()
const port = 4000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors({ origin: '*' }))

app.get('/categories', async (_, res) => {
    try {
        const categories = await getCategories()
        res.status(200).json({ data: categories })
    } catch (e) {
        res.status(400).json(e)
    }
})

app.get('/offers', async (req, res) => {
    try {
        const { page, limit, orderBy, direction, search, category_id } =
            req.query

        const offers = await getOffers({
            page,
            limit,
            sort: { orderBy, direction },
            search,
            categoryId: category_id
        } as GetOffersQueryParams)
        res.status(200).json({ data: offers })
    } catch (e) {
        res.status(400).json(e)
    }
})

app.get('/offers/:offerId', async (req, res) => {
    try {
        const offer = await getOffers({ offerId: req.params.offerId })
        res.status(200).json({ data: offer })
    } catch (e) {
        res.status(400).json(e)
    }
})

app.delete('/offers/:offerId', async (req, res) => {
    try {
        const status = await deleteOffer(req.params.offerId)
        res.status(200).json({ data: !!status })
    } catch (e) {
        res.status(400).json(e)
    }
})

app.post('/offers', async (req, res) => {
    try {
        const offer = await addOffer(req.body)
        res.status(200).json({ data: offer })
    } catch (e) {
        res.status(400).json(e)
    }
})

app.listen(port, () =>
    console.log(`Serwer Join IT Api pracuje na porcie: ${port}`)
)
