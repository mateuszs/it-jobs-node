# IT Jobs API

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
limit: number
page: number
category_id: number
search: string
orderBy: string (offer field)
direction: asc | desc
```

np: `localhost:4000/offers?page=1&limit=10&orderBy=id&direction=desc`

GET: /offers/:id

GET: /categories

DELETE: /offers/:id

POST: /offers

Request body:

```
{
	"title": "string",
	"company_city": "string",
	"category_ids": [number],
	"salary_from": "number",
	"salary_to": "number",
	"duration": "number",
	"company_name": "string",
	"thumb": "base64 string",
	"required_experience": "string",
	"description": "string"
}
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
