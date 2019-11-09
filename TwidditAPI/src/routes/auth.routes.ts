import express from 'express';
const oauth2 = require('simple-oauth2')

import { getConnection } from '../model/databaseConnection';
import { checkJwt, handleAuthError } from './checkJwt.routes';


const createRouter = () => {

  const router = express.Router();
  getConnection();

  router.use('/', handleAuthError);

  const reddit_oauth = oauth2.create({
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

  router.get('/reddit', checkJwt, (req, res) => {
    const userMail = req.user.email;
    const authorizationUri = reddit_oauth.authorizationCode.authorizeURL({
      redirect_uri: 'https://twiddit.tk/auth/reddit/callback',
      scope: ['identity'],
      state: userMail
    });

    res.redirect(authorizationUri);
  });

  router.get('/reddit/callback', async (req, res) => {
    const userMail = req.params.state;
    const code = req.query.code;
    const options = {
      code,
      state: userMail,
    };

    try {
      // The resulting token.
      const result = await reddit_oauth.authorizationCode.getToken(options);

      // Exchange for the access token.
      const token = reddit_oauth.accessToken.create(result);

      const db = await getConnection();
      const queryResult = await db.pool.query(
        'INSERT INTO twitter_oauth VALUES ($1, $2, $3) ON CONFLICT (userMail) DO UPDATE SET oauth = $1 RETURNING *;',
       [userMail, token.access_token, token.refresh_token]);
      console.log(queryResult.rows);

      return res.redirect('/reddit_login');
    } catch (error) {
      console.error('Access Token Error', error.message);
      return res.status(500).json('Authentication failed');
    }
  });

  router.get('/twitter-oauth', async (req, res, next) => {
    const db = await getConnection();
    const userMail = req.user.email;
    db.pool
      .query('SELECT * FROM twitter_oauth WHERE userMail = $1;', [userMail])
      .then((result) => {
        if (result.rowCount > 0)
          res.send(result.rows.pop().oauth);
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

  router.get('/reddit-oauth', async (req, res, next) => {
    const db = await getConnection();
    const userMail = req.user.email;
    db.pool
      .query('SELECT * FROM reddit_oauth WHERE userMail = $1;', [userMail])
      .then((result) => {
        if (result.rowCount > 0)
          res.send(result.rows.pop().oauth);
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

  return router;
}

export const CreateAuthRouter = createRouter;
