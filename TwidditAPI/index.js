var http = require('http');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var sample = require('./routes/routes');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));

//Put your angular dist folder here
app.use(express.static(path.join(__dirname, '../TwidditClient/dist/Twiddit')));
app.use('/', express.static(path.join(__dirname, '../TwidditClient/dist/Twiddit')));
app.use('/api', sample);

var port = parseInt(process.env.PORT || '4300');
app.set('port', port);

var server = http.createServer(app);
server.listen(port);
server.on('listening', onListening);

function onListening() {
  var addr = server.address();
}