import { Pool } from 'pg';

let connection: DatabaseConnection;

export class DatabaseConnection {

    public pool = new Pool();

    constructor() {
        this.pool.on('error', (err, client) => {
            console.error('Unexpected error on idle client', err);
            process.exit(-1);
        });
    }

    public async createTablesIfNotExist(): Promise<void> {
        await this.pool.query('CREATE SCHEMA IF NOT EXISTS twiddit;')
            .catch(console.log);
        await this.pool.query('CREATE TABLE IF NOT EXISTS twiddit.scheduledposts'
            + ' (id SERIAL, '
            + 'userMail text NOT NULL PRIMARY KEY, '
            + 'postDateTime text NOT NULL, '
            + 'imageUrl text, '
            + 'twitterText text, '
            + 'redditTitle text, '
            + 'subreddit text, '
            + 'nsfw boolean);')
            .catch(console.log);
    }

}

export async function getConnection() {
    if (connection == null) {
        connection = new DatabaseConnection();

        await connection.createTablesIfNotExist();
    }
    return connection;
}
