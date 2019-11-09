
import bodyParser from 'body-parser';
import express from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import path, { resolve } from 'path';
import { CreateApiRouter } from './routes/routes';
import {config as configureDotenvEnvironment} from 'dotenv';
import { Scheduler } from './scheduler';
configureDotenvEnvironment({ path: resolve(__dirname, '../.env') });

// tslint:disable: no-var-requires
const compression = require('compression');

console.log('starting twiddit server');

const app = express();
app.use(compression());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', CreateApiRouter());

const simpleOAuth2Reddit = require('@jimmycode/simple-oauth2-reddit');

const reddit = simpleOAuth2Reddit.create({
  clientId: process.env.REDDIT_APP_ID,
  clientSecret: process.env.REDDIT_APP_SECRET,
  callbackURL: 'https://twiddit.tk/auth/reddit/callback',
  state: '345bg34b345672bnb57245v745',
  scope:  ['identity', 'submit', 'read'],
});

// Ask the user to authorize.
app.get('/auth/reddit', reddit.authorize);

// Exchange the token for the access token.
app.get('/auth/reddit/callback', reddit.accessToken, (req, res) => {
  console.log(req);
  return res.status(200).json(req.token);
});

app.use('/twitter_login', express.static(path.join(__dirname, '../../TwidditClient/dist/Twiddit')));
app.use('/reddit_login', express.static(path.join(__dirname, '../../TwidditClient/dist/Twiddit')));
app.use(express.static(path.join(__dirname, '../../TwidditClient/dist/Twiddit')));

const port = parseInt(process.env.PORT || '4300', 10);
app.set('port', port);

const scheduler = new Scheduler();
scheduler.initialize();

try {
  const ssl = {
    ca: fs.readFileSync('/etc/letsencrypt/live/twiddit.tk/chain.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/twiddit.tk/fullchain.pem'),
    key: fs.readFileSync('/etc/letsencrypt/live/twiddit.tk/privkey.pem'),
  };
  const server = https.createServer(ssl, app);

  server.listen(port);
} catch {
  const fallbackServer = http.createServer(app);
  fallbackServer.listen(port);
}
