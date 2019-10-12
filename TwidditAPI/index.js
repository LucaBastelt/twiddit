var http = require('http');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const fs = require('fs');

var api = require('./routes/routes');
var app = express();

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));

//Put your angular dist folder here
app.use(express.static(path.join(__dirname, '../TwidditClient/dist/Twiddit')));
app.use('/', express.static(path.join(__dirname, '../TwidditClient/dist/Twiddit')));
app.use('/api', checkJwt, api);

var port = parseInt(process.env.PORT || '4300');
app.set('port', port);

try{
  var ssl = {
    key: fs.readFileSync('/etc/letsencrypt/live/twiddit.tk/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/twiddit.tk/fullchain.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/twiddit.tk/chain.pem')
  }
  var server = https.createServer(ssl, app);

  server.listen(port);
  server.on('listening', onListening);

} catch{
  var server = http.createServer(app);
  server.listen(port);
  server.on('listening', onListening);
}

function onListening() {
  var addr = server.address();
}