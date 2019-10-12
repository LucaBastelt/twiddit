import { Pool } from 'pg';

class DatabaseConnection {
    
    pool = new Pool();

    initializeDb() {
        this.pool.on('error', (err, client) => {
            console.error('Unexpected error on idle client', err);
            process.exit(-1);
        });

        return this.pool
            .query('SELECT * FROM users WHERE id = $1', [1])
            .then(res => console.log('user:', res.rows[0]))
            .catch(e =>
                setImmediate(() => {
                    throw e
                })
            )
    }
}
