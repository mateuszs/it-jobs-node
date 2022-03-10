## IT Jobs API from feature

Prosta aplikacja dydaktyczna Express Node.js API.

## Uruchomienie

Zainstaluj [Docker Desktop](https://www.docker.com/get-started).

Pobierz kontener z aplikacją

```bash
docker pull mateuszscirka/it-jobs-api:latest
```

a następnie uruchom

```bash
docker run -p 4000:4000 -v it-jobs-api-db:/api/src/database mateuszscirka/it-jobs-api:latest
```

Serwer powinien zostać uruchomiony i dostępny pod adresem `http://localhost:4000`. Serwer mozna wyłączyć za pomocą CTRL+C

## Dostępne zasoby API

GET: /offers

Query params (opcjonalne):

```
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
```

np: `localhost:4000/offers?page=1&limit=10&order_by=id&sort_direction=desc`

GET: /offers/:id

GET: /config

DELETE: /offers/:id

POST: /offers

Request body:

```
{
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
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
