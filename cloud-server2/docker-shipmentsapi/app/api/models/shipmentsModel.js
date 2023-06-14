'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate-v2');

var ShipmentSchema = new Schema({
    ShipmentId: {
        type: Number,
        Required: 'unique id of shipment',
        unique : true,
        dropDups: true
    },
    Date: {
        type: Date,
        Required: 'date of shipment'
    },
    PLZ_From: {
        type: String,
        Required: 'place of sender'
    },
    PLZ_To: {
        type: String,
        Required: 'place of delivery'
    },
    Status: {
        type: Number,
        Required: 'delivery status'
    },
    Weight: {
        type: Number,
        Required: 'Weight of delivery in grams'
    },
    Last_Update: {
        type: Date,
        Required: 'date of last update'
    },

});

ShipmentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Shipments', ShipmentSchema);