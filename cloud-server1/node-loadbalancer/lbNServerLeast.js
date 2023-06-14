const express = require('express');
const request = require('request');

var nServer = 10;
const portPrefix = 10100;
const url = 'http://localhost';
var servers = [];
var activeCons = [];

for (var i = 0; i < nServer; i++) {
    let port = portPrefix + i;
    let server = url + ':' + port;
    servers.push(server);
    activeCons.push(0);
}

const profilerMiddleware = (req, res, next) => {
    const start = Date.now();
    // The 'finish' event comes from core Node.js, it means Node is done handing
    // off the response headers and body to the underlying OS.
    res.on('finish', () => {
        //decrease active connections
        activeCons[servers.indexOf(req.targetServer)]--;
        console.log('Completed on ', req.targetServer, req.method, req.url, Date.now() - start);
    });
    next();
};

const handler = (req, res) => {
    //get index of lowest activeCons
    let serverI = activeCons.indexOf(Math.min(...activeCons));
    // set the target server on the request
    req.targetServer = servers[serverI];
    // Pipe the vanilla node HTTP request (a readable stream) into `request`
    // to the next server URL. Then, since `res` implements the writable stream
    // interface, you can just `pipe()` into `res`.
    req.pipe(request({ url: req.targetServer + req.url })).pipe(res);
    activeCons[serverI]++;
};

const app = express()
    .use(profilerMiddleware)
    .get('*', handler)
    .post('*', handler);

app.listen(8001);
