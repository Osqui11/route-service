const { Router } = require('express');
const express = require('express');
const router = express.Router();

const MySQLConnection = require('../database/database')

router.post('/getAllRoutes', (req, res) => {
    MySQLConnection.query('SELECT * FROM route', (err, rows, fields) => {
        if(!err){
            return res.json({'rows': rows});
        }else{
            console.log(err);
        }
    })
})

router.post('/getRoute/:id', (req, res) => {
    const { id } = req.params;
    MySQLConnection.query('SELECT * FROM route WHERE id = ?', [id], (err,rows, fields) => {
        if(!err){
            var description;
            var lat1;
            var lon1;
            var lat2;
            var lon2;
            rows.forEach(e => {
                description = e.description;
                lat1 = e.lat1;
                lon1 = e.lon1;
                lat2 = e.lat2;
                lon2 = e.lon2;

            });
            return res.status(200).send({
                'status' : 'success', description, lat1, lon1, lat2, lon2

            });
        }else{
            console.log(err);
        }
    })
})

router.post('/addRoute', (req, res) => {
    let description = req.body.description;
    let lat1 = req.body.lat1;
    let lon1 = req.body.lon1;
    let lat2 = req.body.lat2;
    let lon2 = req.body.lon2;
    MySQLConnection.query(`INSERT INTO route (description, lat1, lon1, lat2, lon2) VALUES ('${description}', '${lat1}', '${lon1}', '${lat2}', '${lon2}' );`, (err,rows, fields) => {
        if(!err){
            // res.json(rows);
            return res.status(200).json({
                'status':'success',
                'message':'Ruta guardada correctamente'
            })
        }else{
            console.log(err);
        }
    })
});

//regresa el la informacion de la ruta y el transporte cuando el id de la ruta y el id de la ruta asignado al transporte sean los mismos y selecciona un solo transporte
//RaTid es el id de la ruta y el id de la ruta asignada al transporte
//Tid es el id de la unidad de transporte
router.post('/getRoutesByRouteAndTransportID/:RaTid/:Tid',(req, res) => {
    const {RaTid, Tid} = req.params;
    MySQLConnection.query(` SELECT route.id AS route_id, description, lat1, lon1, lat2, lon2, transportunity.id AS transport_id, route_id AS TRid, company, model, driverName, driverLastName, phone FROM route join transportunity on ((route.id = ${RaTid}  and transportunity.route_id = ${RaTid}) and transportunity.numberRoute = ${Tid})`, [RaTid, Tid],  (err,rows,fields) => {
        if (!err) {
            var route_id, description, lat1, lon1, lat2, lon2, transport_id, t_route_id, company, model, driverName, driverLastName, phone;
            rows.forEach(e => {
                route_id = e.route_id;
                description = e.description;
                lat1 = e.lat1;
                lon1 = e.lon1;
                lat2 = e.lat2;
                lon2 = e.lon2;
                transport_id = e.transport_id;
                t_route_id = e.TRid;
                company = e.company;
                model = e.model;
                driverName = e.driverName;
                driverLastName = e.driverLastName;
                phone = e.phone;
            });
            return res.status(200).send({
                'status' : 'success', fields
            });
        } else {
            console.log(err);
        }
    })
})



//regresa el la informacion de la ruta y el transporte cuando el id de la ruta y el id de la ruta asignado al transporte sean los mismos
//RaTid es el id de la ruta y el id de la ruta asignada al transporte
router.post('/getRoutesByTransportID/:RaTid', (req, res) => {
    const { RaTid } = req.params;
    MySQLConnection.query(`SELECT route.id AS route_id, description, lat1, lon1, lat2, lon2, transportunity.id AS transport_id, route_id AS TRid, company, model, driverName, driverLastName, phone FROM route join transportunity on route.id = ${RaTid}  and transportunity.route_id = ${RaTid}`,[RaTid], (err,rows, fields) => {
        if (!err){
            var route_id, description, lat1,lon1, lat2, lon2, transport_id, route_id, company, model, driverName, driverLastName, phone;
            rows.forEach(e => {
                route_id = e.route_id;
                description = e.description;
                lat1 = e.lat1;
                lon1 = e.lon1;
                lat2 = e.lat2;
                lon2 = e.lon2;
                transport_id = e.transport_id;
                route_id = e.route_id;
                company = e.company;
                model = e.model;
                driverName = e.driverName;
                driverLastName = e.driverLastName;
                phone = e.phone;
            });
            return res.status(200).send({
                'status' : 'success', route_id, description, lat1, lon1, lat2, lon2, transport_id, route_id, company, model, driverName, driverLastName, phone
            });
        }else {
            console.log(err);
        }
    })
})

module.exports = router;