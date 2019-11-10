import express from 'express';

import { getConnection } from '../model/databaseConnection';
import { checkJwt, handleAuthError } from './checkJwt.routes';
import { reddit_oauth } from '../redditConnection';


const createRouter = () => {

  const router = express.Router();
  getConnection();

  router.use('/', handleAuthError);



  router.get('/reddit-auth-url', checkJwt, (req, res) => {
    const userMail = Buffer.from(req.user.email).toString('base64');
    const authorizationUrl = reddit_oauth.authorizationCode.authorizeURL({
      redirect_uri: 'https://twiddit.tk/api/auth/reddit/callback',
      scope: ['identity', 'submit', 'read', 'flair'],
      state: userMail,
      duration: 'permanent',
    });

    res.json(authorizationUrl);
  });

  router.get('/reddit/callback', async (req, res) => {
    const userMail = Buffer.from(req.query.state, 'base64').toString('ascii');
    const code = req.query.code;
    const options = {
      code,
      redirect_uri: 'https://twiddit.tk/api/auth/reddit/callback',
      scope: ['identity', 'submit', 'read', 'flair'],
      state: userMail,
    };

    try {
      // The resulting token.
      const result = await reddit_oauth.authorizationCode.getToken(options);

      // Exchange for the access token.
      const token = reddit_oauth.accessToken.create(result);
      if (!token.token.access_token){
        console.error('Token not created');
        console.error(token);
        return res.status(500).json('Authentication failed');
      } else {
        const db = await getConnection();
        await db.pool.query('DELETE FROM twitter_oauth WHERE userMail = $1;', [userMail]);
        await db.pool.query('INSERT INTO twitter_oauth VALUES ($1, $2, $3, $4, $5);',
          [userMail, token.token.access_token, token.token.refresh_token, token.token.expires_in, token.token.expires_at]);
        return res.redirect('/reddit_login');
      }
      
    } catch (error) {
      console.error('Access Token Error', error.message);
      return res.status(500).json('Authentication failed');
    }
  });

  router.get('/twitter-oauth', checkJwt, async (req, res, next) => {
    const db = await getConnection();
    const userMail = req.user.email;
    db.pool
      .query('SELECT * FROM twitter_oauth WHERE userMail = $1;', [userMail])
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

  router.get('/reddit-oauth', checkJwt, async (req, res, next) => {
    const db = await getConnection();
    const userMail = req.user.email;
    db.pool
      .query('SELECT * FROM reddit_oauth WHERE userMail = $1;', [userMail])
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

  return router;
}

export const CreateAuthRouter = createRouter;
