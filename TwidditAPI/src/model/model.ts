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
            .then(() =>
                this.pool.query('CREATE TABLE IF NOT EXISTS twiddit.scheduledPosts'
                    + ' (userMail text NOT NULL PRIMARY KEY, '
                    + 'postDateTime text NOT NULL, '
                    + 'imageUrl text, '
                    + 'twitterText text, '
                    + 'reddtTitle text, '
                    + 'subreddit text, '
                    + 'nsfw boolean);'));
    }

}

export async function getConnection() {
    if (connection == null) {
        connection = new DatabaseConnection();

        await connection.createTablesIfNotExist();
    }
    return connection;
}
