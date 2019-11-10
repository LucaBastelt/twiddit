import express from 'express';
const jwtDecode = require('jwt-decode');
//const simple_oauth2 = require('simple-oauth2')

import { getConnection } from '../model/databaseConnection';
import { morphToScheduledPosts, morphToDatabaseScheduledPost } from '../model/toModelTransformation';
import { checkJwt, handleAuthError } from './checkJwt.routes';


const createRouter = () => {

  const router = express.Router();
  getConnection();

  if (process.env.NODE_ENV === 'production') {
    console.log('Using full jwt security check');
    router.use('/', checkJwt);
    router.use('/', handleAuthError);
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

  return router;
}

export const CreateApiRouter = createRouter;