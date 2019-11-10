import { getConnection } from './model/databaseConnection';
const oauth2 = require('simple-oauth2')

export const reddit_oauth = oauth2.create({
    client: {
      id: process.env.REDDIT_APP_ID,
      secret: process.env.REDDIT_APP_SECRET
    },
    auth: {
      authorizeHost: 'https://www.reddit.com',
      authorizePath: '/api/v1/authorize',

      tokenHost: 'https://www.reddit.com',
      tokenPath: '/api/v1/access_token'
    }
  });

export async function refreshToken(token: { access_token: string, refresh_token: string, expires_in: number, expires_at: string }): Promise<{ access_token: string, refresh_token: string, expires_in: number, expires_at: string } | undefined> {
    let accessToken = reddit_oauth.accessToken.create(token);

    // Check if the token is expired. If expired it is refreshed.
    if (accessToken.expired()) {
        try {
            const params = {
                scope: ['identity', 'submit', 'read', 'flair'],
            };

            accessToken = await accessToken.refresh(params);
            return accessToken;
        } catch (error) {
            console.log('Error refreshing access token: ', error.message);
        }
    }
    return undefined;
}

export async function getRedditToken(userMail: string): Promise<{ access_token: string, refresh_token: string, expires_in: number, expires_at: string } | undefined> {
    const db = await getConnection();
    var queryResult = await db.pool.query('SELECT * FROM twiddit.reddit_oauth WHERE usermail = $1;', [userMail]);
    if (queryResult.rowCount > 0) {
        const token = queryResult.rows[0];
        return await refreshToken(token);
    }
    return undefined;
}