import knex from 'knex'

const connectedKnex = knex({
    client: 'sqlite3',
    connection: {
        filename: './src/database/db.db'
    },
    useNullAsDefault: true
})

connectedKnex.raw('PRAGMA foreign_keys = ON;').then(() => {
    console.log('Baza danych aktywna.')
})

export default connectedKnex
