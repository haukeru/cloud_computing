const body = require('body-parser');
const express = require('express');
const nServer = 10; // number of servers to create  
const portPrefix = 10100; // <-- Gruppennummer * 100 + 10000  

var appsArr = [];
const handler = serverNum => (req, res) => {
    console.log(`server ${serverNum}`, req.method, req.url, req.body);
    setTimeout(() => { res.send(`Hello from server ${serverNum}\n`); },
        50 * serverNum + 25
    );
};

for (var i = 0; i < nServer; i++) {
    let app = express();
    appsArr.push(app);
    app.use(body.json());
    app.get('*', handler(i)).post('*', handler(i));
    let port = portPrefix + i;
    app.listen(port);
} 