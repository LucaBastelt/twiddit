import express from 'express';

import { getConnection } from '../model/databaseConnection';
import { RedditConnection } from '../redditConnection';
import { AuthorizationTokenConfig } from 'simple-oauth2';
import { getJwtCheckFuncs } from './checkJwt.routes';

const redditRedirectUri = 'http://localhost:4300/api/auth/reddit/callback';

const createRouter = () => {

  const router = express.Router();
  getConnection();

  const jwtCheck = getJwtCheckFuncs(router);

  router.all('/reddit-auth-url', jwtCheck);
  router.all('/twitter-oauth', jwtCheck);
  router.all('/reddit-oauth', jwtCheck);

  router.get('/reddit-auth-url', (req, res) => {
    const userMail = Buffer.from(req.user.email).toString('base64');
    const authorizationUrl = RedditConnection.getRedditOauthConfig().authorizationCode.authorizeURL({
      redirect_uri: redditRedirectUri,
      scope: RedditConnection.redditScopes,
      state: userMail,
      duration: 'permanent',
    });

    res.json(authorizationUrl);
  });

  router.get('/reddit/callback', async (req, res) => {
    const userMail = Buffer.from(req.query.state as string, 'base64').toString('ascii');
    const options = {
      code: req.query.code,
      redirect_uri: redditRedirectUri,
      scope: RedditConnection.redditScopes,
      state: userMail,
    } as AuthorizationTokenConfig;

    try {
      const oauthConfig = RedditConnection.getRedditOauthConfig();
      // The resulting token.
      const result = await oauthConfig.authorizationCode.getToken(options);

      // Exchange for the access token.
      const token = oauthConfig.accessToken.create(result);
      if (!token.token.access_token) {
        console.error('Token not created');
        console.error(token);
        return res.status(500).json('Authentication failed');
      } else {
        const db = await getConnection();
        await db.pool.query('DELETE FROM reddit_oauth WHERE usermail = $1;', [userMail]);
        await db.pool.query('INSERT INTO reddit_oauth VALUES ($1, $2, $3, $4, $5);',
          [userMail, token.token.access_token, token.token.refresh_token, token.token.expires_in, token.token.expires_at]);
        return res.redirect('/reddit_login');
      }

    } catch (error) {
      console.error('Access Token Error', error.message);
      return res.status(500).json('Authentication failed');
    }
  });

  router.get('/twitter-oauth', async (req, res, next) => {
    const db = await getConnection();
    const userMail = req.user.email;
    db.pool
      .query('SELECT * FROM twitter_oauth WHERE usermail = $1;', [userMail])
      .then((result) => {
        if (result.rowCount > 0)
          res.json(result.rows.pop().access_token);
        else
          res.status(404).send();
      })
      .catch((e) =>
        setImmediate(() => {
          console.error(e);
          res.status(500).send(e);
        }),
      );
  });

  router.delete('/twitter-oauth', async (req, res, next) => {
    const db = await getConnection();
    const userMail = req.user.email;

    await db.pool.query('DELETE FROM twitter_oauth WHERE usermail = $1', [userMail]);

    res.status(200).send();
  });

  router.get('/reddit-oauth', async (req, res, next) => {
    const userMail = req.user.email;
    const token = await RedditConnection.construct(userMail);
    if (token)
      res.json(token.token.access_token);
    else
      res.status(404).send();
  });

  router.delete('/reddit-oauth', async (req, res, next) => {
    const db = await getConnection();
    const userMail = req.user.email;

    await db.pool.query('DELETE FROM reddit_oauth WHERE usermail = $1', [userMail]);

    res.status(200).send();
  });

  return router;
}

export const CreateAuthRouter = createRouter;
