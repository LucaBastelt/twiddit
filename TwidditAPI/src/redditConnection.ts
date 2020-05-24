import { getConnection } from './model/databaseConnection';
import { OAuthClient, Token } from 'simple-oauth2';
const oauth2 = require('simple-oauth2')
import snoowrap from 'snoowrap';

let reddit_oauth_config: OAuthClient | undefined = undefined;

export class RedditConnection {

    public static redditScopes = ['identity', 'submit', 'read', 'flair'];

    token: Token;

    public static async construct(userMail: string): Promise<RedditConnection | undefined> {
        const token = await RedditConnection.getRedditToken(userMail);
        if (!token) {
            return undefined;
        }
        return new RedditConnection(token as Token);
    }

    constructor(token: Token) {
        this.token = token;
    }

    public createRedditWrapperInstance(): snoowrap {
        return new snoowrap({
            userAgent: `nodejs:${process.env.REDDIT_APP_ID}:${process.env.APP_VERSION} (by /u/zoidsty)`,
            clientId: process.env.REDDIT_APP_ID as string,
            clientSecret: process.env.REDDIT_APP_SECRET as string,
            accessToken: this.token.access_token,
            refreshToken: this.token.refresh_token
        });
    }

    public static getRedditOauthConfig(): OAuthClient {
        if (!reddit_oauth_config) {
            reddit_oauth_config = oauth2.create({
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
        }
        return reddit_oauth_config as OAuthClient;
    }

    public static async refreshRedditToken(token: { access_token: string, refresh_token: string, expires_in: number, expires_at: string }): Promise<Token | undefined> {

        const db = await getConnection();
        let accessToken = RedditConnection.getRedditOauthConfig().accessToken.create(token);

        // Check if the token is expired. If expired it is refreshed.
        if (accessToken.expired()) {
            try {
                const params = {
                    scope: ['identity', 'submit', 'read', 'flair'],
                };

                accessToken = await accessToken.refresh(params);
                await db.pool.query(
                    'UPDATE reddit_oauth SET access_token = $2, expires_in = $3, expires_at = $4 WHERE access_token = $1;',
                    [
                        token.access_token,
                        accessToken.token.access_token,
                        accessToken.token.expires_in,
                        accessToken.token.expires_at
                    ]);
            } catch (error) {
                db.pool.query('DELETE FROM reddit_oauth WHERE WHERE access_token = $1;', [token.access_token]);
                console.log('Error refreshing access token: ', error.message);
                return undefined;
            }
        }
        return accessToken.token;
    }

    public static async getRedditToken(userMail: string): Promise<Token | undefined> {
        const db = await getConnection();
        var queryResult = await db.pool.query('SELECT * FROM twiddit.reddit_oauth WHERE usermail = $1;', [userMail]);
        if (queryResult.rowCount > 0) {
            const dbToken = queryResult.rows[0] as { access_token: string, refresh_token: string, expires_in: number, expires_at: string };
            return await RedditConnection.refreshRedditToken(dbToken);
        }
        return undefined;
    }
}