const debug = require('debug')('server');
const fs = require('fs');
const express = require('express');
const session = require('express-session');


const privateKey = fs.readFileSync('./key/pillaAuth-key.pem', 'utf8');
const certificate = fs.readFileSync('./key/pillaAuth-cert.pem', 'utf8');
const credentials = {
    key: privateKey,
    cert: certificate,
};

const sessionMW = session({
    secret: 'going through hell keep going',
    resave: true,
    saveUninitialized: true,
    //cookie: {maxAge: 60*24*60*60*1000},
});

const app = express();
let server = null;
debug('NODE_ENV %s', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'production') {
    server = require('http').createServer(app);
    debug('using http...');
} else {
    server = require('https').createServer(credentials, app);
    debug('using https...');
}

require('./route')(app, sessionMW);
// init websocket services
require('./ws_service')(server, sessionMW);

const port = process.env.PORT || 8080;
server.listen(port, () => {
    debug('Server started on port: ' + port);
});


