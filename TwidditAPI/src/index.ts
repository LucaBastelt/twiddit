import http from "http";
import https from "https";
import fs from "fs";
import bodyParser from "body-parser";
import path from "path";
import express from "express";

var api = require('./routes/routes');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':false}));

//Put your angular dist folder here
app.use(express.static(path.join(__dirname, '../TwidditClient/dist/Twiddit')));
app.use('/', express.static(path.join(__dirname, '../TwidditClient/dist/Twiddit')));
app.use('/api', api);

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
  var fallbackServer = http.createServer(app);
  fallbackServer.listen(port);
  fallbackServer.on('listening', onListening);
}

function onListening() {
  var addr = server.address();
}