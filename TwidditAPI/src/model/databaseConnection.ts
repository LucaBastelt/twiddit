import { Pool } from 'pg';

let connection: DatabaseConnection;

export class DatabaseConnection {

    public pool: Pool;

    constructor() {
        this.pool = new Pool();
        this.pool.on('error', (err, client) => {
            console.error('Unexpected error on idle client', err);
            process.exit(-1);
        });
    }

    public async createTablesIfNotExist(): Promise<void> {
        await this.pool.query('CREATE SCHEMA IF NOT EXISTS twiddit;')
            .catch(console.log);
        await this.pool.query(
            'CREATE TABLE IF NOT EXISTS twiddit.scheduledposts'
            + ' (id SERIAL, '
            + 'usermail text NOT NULL, '
            + 'postdatetime text NOT NULL, '
            + 'imageurl text, '
            + 'twittertext text, '
            + 'reddittitle text, '
            + 'subreddit text, '
            + 'nsfw boolean);')
            .catch(console.log);
        await this.pool.query(
            'CREATE TABLE IF NOT EXISTS twiddit.twitter_oauth'
            + ' (usermail text NOT NULL UNIQUE, '
            + 'access_token text NOT NULL, '
            + 'refresh_token text NOT NULL, '
            + 'expires_in text NOT NULL, '
            + 'expires_at text NOT NULL);')
            .catch(console.log);
        await this.pool.query(
            'CREATE TABLE IF NOT EXISTS twiddit.reddit_oauth'
            + ' (usermail text NOT NULL UNIQUE, '
            + 'access_token text NOT NULL, '
            + 'refresh_token text NOT NULL, '
            + 'expires_in text NOT NULL, '
            + 'expires_at text NOT NULL);')
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
