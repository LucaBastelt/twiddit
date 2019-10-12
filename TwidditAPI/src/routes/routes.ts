import express, { Request, Response, Router } from 'express';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { getConnection } from '../model/model';

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
  issuer: 'accounts.google.com',
});

export function route(): Router {

  const router = express.Router();
  getConnection();
  router.use('/', checkJwt);
  router.use((err: Error, req: Request, res: Response, next: () => any) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send([err, req.header]);
    }
  });

  router.get('/scheduled-posts', async (req, res, next) => {
    const db = await getConnection();
    const userMail = req.user.email;
    db.pool
      .query('SELECT * FROM scheduledposts WHERE userMail = $1', [userMail])
      .then((result) => res.send(result.rows[0]))
      .catch((e) =>
        setImmediate(() => {
          throw e;
        })
      );
  });

  return router;
}
