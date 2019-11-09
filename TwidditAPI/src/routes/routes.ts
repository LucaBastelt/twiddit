import express, { Request, Response } from 'express';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
const jwtDecode = require('jwt-decode');
//const simple_oauth2 = require('simple-oauth2')

import { getConnection } from '../model/databaseConnection';
import { morphToScheduledPosts, morphToDatabaseScheduledPost } from '../model/toModelTransformation';


const createRouter = () => {

  const checkJwt = jwt({
    // Dynamically provide a signing key
    // based on the kid in the header and
    // the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      jwksRequestsPerMinute: 5,
      jwksUri: 'https://www.googleapis.com/oauth2/v3/certs',
      rateLimit: true,
    }),
    // Validate the audience and the issuer.
    algorithms: ['RS256'],
    audience: process.env.GOOGLE_OIDC_API_CODE,
    issuer: 'https://accounts.google.com',
  });

  const router = express.Router();
  getConnection();

  if (process.env.NODE_ENV === 'production') {
    console.log('Using full jwt security check');
    router.use('/', checkJwt);
  } else {
    console.log('Using no jwt security check');
    router.use('/', (req, res, next) => {
      if (req.headers.authorization) {
        req.user = jwtDecode(req.headers.authorization);
        next();
      }
      else {
        res.status(401).send(['Unauthorized, no auth header', req.headers]);
      }
    });
  }

  router.use((err: Error, req: Request, res: Response, next: () => any) => {
    console.error('Error: ' + err.message);
    console.error('' + err.stack);
    if (err.name === 'UnauthorizedError') {
      res.status(401).send([err, req.headers]);
    }
  });

  router.get('/scheduled-posts', async (req, res, next) => {
    const db = await getConnection();
    const userMail = req.user.email;
    db.pool
      .query('SELECT * FROM scheduledposts WHERE userMail = $1;', [userMail])
      .then((result) => res.send(morphToScheduledPosts(result.rows)))
      .catch((e) =>
        setImmediate(() => {
          console.error(e);
          res.status(500).send(e);
        }),
      );
  });

  router.post('/scheduled-posts', async (req, res, next) => {
    const db = await getConnection();
    const userMail = req.user.email;
    const post = morphToDatabaseScheduledPost(req.body.post);
    db.pool
      .query('INSERT INTO scheduledposts  '
        + 'VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7) RETURNING *;',
        [userMail, post.postdatetime, post.imageurl, post.twittertext, post.reddittitle, post.subreddit, post.nsfw])
      .then((result) => res.status(201).send(morphToScheduledPosts(result.rows)))
      .catch((e) =>
        setImmediate(() => {
          console.error(e);
          res.status(500).send(e);
        }),
      );
  });

  router.put('/scheduled-posts/:postId', async (req, res, next) => {
    const db = await getConnection();
    const userMail = req.user.email;
    const post = morphToDatabaseScheduledPost(req.body.post);
    db.pool
      .query('UPDATE scheduledposts '
        + 'SET postdatetime=$1, imageurl=$2, twittertext=$3, reddittitle=$4, subreddit=$5, nsfw=$6  '
        + 'WHERE userMail = $7 AND id = $8 RETURNING *;',
        [post.postdatetime, post.imageurl, post.twittertext, post.reddittitle, post.subreddit, post.nsfw, userMail, req.params.postId])
      .then((result) => res.status(201).send(morphToScheduledPosts(result.rows)))
      .catch((e) =>
        setImmediate(() => {
          console.error(e);
          res.status(500).send(e);
        }),
      );
  });

  router.delete('/scheduled-posts/:postId', async (req, res, next) => {
    const db = await getConnection();
    const userMail = req.user.email;
    db.pool
      .query('DELETE FROM scheduledposts  '
        + 'WHERE userMail = $1 AND id = $2 RETURNING *;',
        [userMail, req.params.postId])
      .then((result) => {
        console.log(result);
        res.status(200).send(morphToScheduledPosts(result.rows));
      })
      .catch((e) =>
        setImmediate(() => {
          console.error(e);
          res.status(500).send(e);
        }),
      );
  });

  /*router.get('/twitter-oauth', async (req, res, next) => {
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
  
  router.post('/twitter-oauth', async (req, res, next) => {
    const db = await getConnection();
    const userMail = req.user.email;
    const oauth = req.body.oauth;
    db.pool
      .query('INSERT INTO twitter_oauth VALUES ($1, $2) ON CONFLICT (userMail) DO UPDATE SET oauth = $1 RETURNING *;', [userMail, oauth])
      .then((result) => {
        if (result.rowCount > 0) // TODO Validate oauth date
          res.status(201).send(result.rows.pop().oauth);
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
  
  router.post('/reddit-oauth', async (req, res, next) => {
    const db = await getConnection();
    const userMail = req.user.email;
    const oauth = req.body.oauth;
    db.pool
      .query('INSERT INTO reddit_oauth VALUES ($1, $2) ON CONFLICT (userMail) DO UPDATE SET oauth = $1 RETURNING *;', [userMail, oauth])
      .then((result) => {
        if (result.rowCount > 0) // TODO Validate oauth date
          res.status(201).send(result.rows.pop().oauth);
        else
          res.status(404).send();
      })
      .catch((e) =>
        setImmediate(() => {
          console.error(e);
          res.status(500).send(e);
        }),
      );
  });*/



  /*const reddit_oauth2 = simple_oauth2.create({
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
   
  router.get('/auth/reddit', (req, res) => {
    const authorizationUri = reddit_oauth2.authorizationCode.authorizeURL({
      redirect_uri: 'http://twiddit.tk/api/auth/reddit/callback',
      scope: ['identity', 'submit', 'read'],
      state: '5678jd8jm578'
    });
   
    res.redirect(authorizationUri);
  });
   
  router.get('/auth/reddit/callback', async(req, res) => {
    const code = req.query.code;
    const options = {
      code,
      state: '5678jd8jm578',
      redirect_uri: 'http://twiddit.tk/api/auth/reddit/callback'
    };
   
    try {
      // The resulting token.
      const result = await reddit_oauth2.authorizationCode.getToken(options);
   
      // Exchange for the access token.
      const token = reddit_oauth2.accessToken.create(result);
   
      return res.status(200).json(token);
    } catch (error) {
      console.error('Access Token Error', error.message);
      return res.status(500).json('Authentication failed');
    }
  });*/

  return router;
}

export const CreateApiRouter = createRouter;