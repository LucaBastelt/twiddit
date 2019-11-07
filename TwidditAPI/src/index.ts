
import bodyParser from 'body-parser';
import express from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';
import { ApiRouter } from './routes/routes';
import {config as configureDotenvEnvironment} from 'dotenv';
import { Scheduler } from './scheduler';
configureDotenvEnvironment();

// tslint:disable: no-var-requires
const compression = require('compression');

console.log('starting twiddit server');

const app = express();
app.use(compression());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '../../TwidditClient/dist/Twiddit')));
app.use(
  '/',
  express.static(path.join(__dirname, '../../TwidditClient/dist/Twiddit')),
);

app.use('/api', ApiRouter);

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
