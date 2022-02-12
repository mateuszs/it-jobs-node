# Join IT API

Prosta aplikacja dydaktyczna Express Node.js API.

## Uruchomienie

Zainstaluj [Docker Desktop](https://www.docker.com/get-started).

Sklonuj repozytorium GIT:

```bash
git clone https://github.com/mateuszs/it-jobs-node.git
```

wejdź do folderu z aplikacją i pobierz kontener

```bash
cd join-it-api
docker-compose pull
```

a następnie uruchom

```bash
docker-compose up
```

Serwer powinien zostać uruchomiony i dostępny pod adresem `http://localhost:4000`

Aby wyłączyć serwer

```bash
docker-compose down
```

## Dostępne zasoby API

GET: /offers

Query params (all optional):

```
limit: number
page: number
category_id: number
search: string
orderBy: string (offer field)
direction: asc | desc
```

eg: `localhost:4000/offers?page=1&limit=10&orderBy=id&direction=desc`

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
