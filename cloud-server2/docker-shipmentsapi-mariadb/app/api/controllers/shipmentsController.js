'use strict';
const { Op } = require("sequelize");

var Shipment = require('../models/shipmentsModel');

exports.list_all_shipments = function (req, res) {
    var pageNo = parseInt(req.query.pageNo);
    var size = parseInt(req.query.size);

    if (pageNo < 1) {
        return res.json({ "error": true, "message": "invalid page number, should start with 1" });
    }
    else if (size < 1) {
        return res.json({ "error": true, "message": "invalid size number, should be at least 1" });
    }

    var offset = size * (pageNo - 1);

    Shipment.findAll({
        offset: offset,
        limit: size
    })
        .then(shipments => res.json(shipments))
        .catch(err => res.send(err));
};


exports.create_a_shipment = function (req, res) {
    Shipment.create(req.body)
        .then(shipment => res.json(shipment))
        .catch(err => res.send(err));
};

exports.read_a_shipment = function (req, res) {
    Shipment.findByPk(req.params.shipmentId)
        .then(shipment => res.json(shipment))
        .catch(err => res.send(err));
};

exports.list_shipments_Plz_To = function (req, res) {
    Shipment.findAll({
        where: {
            PLZ_To: {
                [Op.like]: req.params.plz + '%'
            }
        }
    }).then(shipments => res.json(shipments))
        .catch(err => res.send(err));
};

exports.list_shipments_Plz_From = function (req, res) {
    Shipment.findAll({
        where: {
            PLZ_From: {
                [Op.like]: req.params.plz + '%'
            }
        }
    }).then(shipments => res.json(shipments))
        .catch(err => res.send(err));
};

exports.update_a_shipment = function (req, res) {
    Shipment.update(req.body, {
        where: { ShipmentId: req.params.shipmentId }
    }).then(shipment => res.json(shipment))
        .catch(err => res.send(err));
};

exports.delete_a_shipment = function (req, res) {
    Shipment.destroy({
        where: { ShipmentId: req.params.shipmentId }
    }).then(() => res.json({ message: 'Shipment successfully deleted' }))
        .catch(err => res.send(err));
};



