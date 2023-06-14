const express = require('express');
const request = require('request');

var nServer = 10;
const portPrefix = 10100; // <-- Gruppennummer * 100 + 10000
const url = 'http://cloud-server_1';
var servers = [];

for (var i = 0; i < nServer; i++) {
    let port = portPrefix + i;
    let server = url + ':' + port;
    servers.push(server);
}

let cur = 0;
const profilerMiddleware = (req, res, next) => {
    const start = Date.now();
    // The 'finish' event comes from core Node.js, it means Node is done handing
    // off the response headers and body to the underlying OS.
    res.on('finish', () => {
        console.log('Completed', req.method, req.url, Date.now() - start);
    });
    next();
};

const handler = (req, res) => {
    req.pipe(request({ url: servers[cur] + req.url })).pipe(res);
    cur = (cur + 1) % servers.length;
};

const app = express()
    .use(profilerMiddleware)
    .get('*', handler)
    .post('*', handler);

app.listen(8001);