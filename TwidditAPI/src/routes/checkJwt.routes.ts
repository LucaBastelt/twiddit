import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';

export const checkJwt = jwt({
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

  

export const handleAuthError = (err: any, req: any, res: any, next: any) => {
    console.error('Error: ' + err.message);
    console.error('' + err.stack);
    if (err.name === 'UnauthorizedError') {
      res.status(401).send([err, req.headers]);
    }
};