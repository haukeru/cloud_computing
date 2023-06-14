var express = require('express'),
    app = express(),
    //use cors
    cors = require('cors'),
    bodyParser = require('body-parser'),
    Sequelize = require('sequelize'),
    Shipment = require('./api/models/shipmentsModel'), //importing out data model
    port = process.env.PORT || 3100;

// connect to MariaDB with our super secure credentials
const sequelize = new Sequelize('shipments_wi_g001', 'root', 'root', {
    host: 'docker-mariadb-db-1',
    port: 3306,
    dialect: 'mariadb',
    logging: console.log,
});

sequelize.authenticate().then(() => {
    console.log('Connection to MariaDB has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the MariaDB:', err);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

var routes = require('./api/routes/shipmentsRoutes'); //importing route
routes(app); //register the route

app.listen(port);

console.log('shipments RESTful API server started on: ' + port);