import express, { Request, Response, Router } from 'express';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
const jwtDecode = require('jwt-decode');

import { getConnection } from '../model/databaseConnection';

import { morphToScheduledPosts } from '../model/toModelTransformation';

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

export function route(): Router {

  const router = express.Router();
  getConnection();

  if (process.env.NODE_ENV === 'production') {
    router.use('/', checkJwt);
  } else {
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
    if (err.name === 'UnauthorizedError') {
      res.status(401).send([err, req.headers]);
    }
  });

  router.get('/scheduled-posts', async (req, res, next) => {
    const db = await getConnection();
    const userMail = req.user.email;
    db.pool
      .query('SELECT * FROM scheduledposts WHERE userMail = $1', [userMail])
      .then((result) => res.send(morphToScheduledPosts(result.rows)))
      .catch((e) =>
        setImmediate(() => {
          throw e;
        }),
      );
  });

  return router;
}
