var express = require('express'),
    cors = require('cors'),
    app = express(),
    mongoose = require('mongoose'),
    Shipment = require('./api/models/shipmentsModel'), //created model loading here
    bodyParser = require('body-parser');

app = express(),

    port = process.env.PORT || 3000,

    mongoose.Promise = global.Promise;

mongoose.Promise = global.Promise;
app.use(cors());
mongoose.set('useNewUrlParser', true);
mongoose.set('debug', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//change server hostname and database
mongoose.connect('mongodb://wi_g001_mongodb:27017/shipments_wi_g001')


mongoose.connection.on('connect', function () {
    console.error('MongoDB has connected successfully');
});

//on failure print error message
mongoose.connection.on('error', function (err) {
    console.log('MongoDB connection error: ' + err);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/shipmentsRoutes'); //importing route
routes(app); //register the route

app.listen(port);

console.log('shipments RESTful API server started on: ' + port);