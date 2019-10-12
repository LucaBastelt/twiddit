import bodyParser from 'body-parser';
import {config as configureEnvironment} from 'dotenv';
import express from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';
import { route as apiRoute } from './routes/routes';

console.log('starting twiddit server');
configureEnvironment();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '../TwidditClient/dist/Twiddit')));
app.use(
  '/',
  express.static(path.join(__dirname, '../TwidditClient/dist/Twiddit')),
);
app.use('/api', apiRoute());

const port = parseInt(process.env.PORT || '4300', 10);
app.set('port', port);

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
