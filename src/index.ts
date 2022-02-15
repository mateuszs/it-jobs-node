import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import { getOffers } from './offers/get-offers'
import { addOffer } from './offers/add-offer'
import { deleteOffer } from './offers/delete-offer'
import { getConfig } from './config/config'

const app = express()
const port = 4000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors({ origin: '*' }))

app.get('/offers', async (req, res) => {
    try {
        const offers = await getOffers(req.query)
        res.status(200).json({ data: offers })
    } catch (e) {
        res.status(400).json(e)
    }
})

app.get('/offers/:offerId', async (req, res) => {
    try {
        const offer = await getOffers(req.params)
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

app.get('/config', async (req, res) => {
    try {
        const config = await getConfig()

        res.status(200).json({ data: config })
    } catch (e) {
        res.status(400).json(e)
    }
})

app.listen(port, () =>
    console.log(
        `IT jobs API\nAutor: Mateusz Ścirka\nOpis API w README.md\n\nSerwer Join IT Api pracuje na porcie: ${port}`
    )
)
