var express = require('express');
var router = express.Router();
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and 
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://www.googleapis.com/oauth2/v3/certs`
  }),

  // Validate the audience and the issuer.
  audience: '341498580870-6ft6jad0dj6g1rtni435dg9kvn1r5phb.apps.googleusercontent.com',
  issuer: `https://accounts.google.com`,
  algorithms: ['RS256']
});

router.use('/', checkJwt);
router.use((err: Error, req: Requ, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...');
  }
});

router.get('/', (req, res, next) => {
  res.send('RESTful API');
});



module.exports = router;