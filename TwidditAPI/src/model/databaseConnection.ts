import { Pool } from 'pg';

let connection: DatabaseConnection;

export class DatabaseConnection {

    public pool: Pool;

    constructor() {

        var connectionStrings = {
            user: process.env.PGUSER as string,
            host: process.env.PGHOST as string,
            database: process.env.PGDATABASE as string,
            password: process.env.PGPASSWORD as string,
            port: Number(process.env.PGPORT),
        };
        this.pool = new Pool(connectionStrings);
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
            + 'userMail text NOT NULL, '
            + 'postDateTime text NOT NULL, '
            + 'imageUrl text, '
            + 'twitterText text, '
            + 'redditTitle text, '
            + 'subreddit text, '
            + 'nsfw boolean);')
            .catch(console.log);
        await this.pool.query(
            'CREATE TABLE IF NOT EXISTS twiddit.twitter_oauth'
            + ' (userMail text NOT NULL UNIQUE, '
            + 'oauth text NOT NULL);')
            .catch(console.log);
        await this.pool.query(
            'CREATE TABLE IF NOT EXISTS twiddit.reddit_oauth'
            + ' (userMail text NOT NULL UNIQUE, '
            + 'oauth text NOT NULL);')
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
