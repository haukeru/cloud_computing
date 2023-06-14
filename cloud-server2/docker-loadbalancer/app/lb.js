const express = require('express');
const request = require('request');

const servers = process.env.SERVERS.split(" ");

//log all the available servers
console.log("Available servers:");
for (var i = 0; i < servers.length; i++) {
    console.log(servers[i]);
}
//log divider
console.log("------------------------------");

const profilerMiddlewareRR = (req, res, next) => {
    //allow CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.set('Access-Control-Expose-Headers', 'X-API-Container');
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );

    const start = Date.now();
    // The 'finish' event comes from core Node.js, it means Node is done handing
    // off the response headers and body to the underlying OS.
    res.on('finish', () => {
        const originalHost = 'http://' + req._readableState.pipes.originalHost;
        console.log('Completed on ', originalHost, req.method, req.url,
            Date.now() - start);
    });
    next();
};


var activeCons = [];
for (var i = 0; i < servers.length; i++) {
    activeCons.push(0);
}

const profilerMiddlewareLeast = (req, res, next) => {
    //allow CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.set('Access-Control-Expose-Headers', 'X-API-Container');
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );

    const start = Date.now();
    // The 'finish' event comes from core Node.js, it means Node is done handing
    // off the response headers and body to the underlying OS.
    res.on('finish', () => {
        activeCons[servers.indexOf(req.targetServer)]--;
        console.log('Completed on ', req.targetServer, req.method, req.url,
            Date.now() - start);
    });
    next();
};





const handlerLeast = (req, res) => {
    //get index of lowest activeCons
    let serverI = activeCons.indexOf(Math.min(...activeCons));

    req.targetServer = servers[serverI];
    activeCons[serverI]++;

    var apiRequest = request({ url: req.targetServer + req.url });

    // Listen to the 'response' event on the request to the API
    apiRequest.on('response', function (apiRes) {
        // When the API responds, add a custom header with the target server's address
        res.set('X-API-Container', req.targetServer + req.url);
        res.set('Access-Control-Expose-Headers', 'X-API-Container');
    });

    // Pipe the original request into the request to the API,
    // then pipe the API's response back into the original response
    req.pipe(apiRequest).pipe(res);
};

let cur = 0;

const handlerRR = (req, res) => {
    // Set the current server as the target
    req.targetServer = servers[cur];

    // Create a request to the API
    var apiRequest = request({ url: req.targetServer + req.url });

    // Listen to the 'response' event on the request to the API
    apiRequest.on('response', function (apiRes) {
        // When the API responds, add a custom header with the target server's address
        res.set('X-API-Container', req.targetServer + req.url);
        res.set('Access-Control-Expose-Headers', 'X-API-Container');
    });

    // Pipe the original request into the request to the API,
    // then pipe the API's response back into the original response
    req.pipe(apiRequest).pipe(res);

    // Cycle to the next server for the next request
    cur = (cur + 1) % servers.length;
    console.log("new cur: " + cur);
};




var app;
if (process.env.LB_STRATEGY === 'RR') {
    app = express().use(profilerMiddlewareRR).get('*',
        handlerRR).post('*', handlerRR);
}
else if (process.env.LB_STRATEGY === 'LEAST') {
    app = express().use(profilerMiddlewareLeast).get('*',
        handlerLeast).post('*', handlerLeast);
}
else {
    console.log('ERROR no lb strategy defined');
}

app.listen(8080);