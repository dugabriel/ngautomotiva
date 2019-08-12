const express = require('express')
const app = express()
const auth = require('../controller/session')
const newVehicleTilte = 'Novo veículo'
const listVehicleTitle = 'Listar veículos'
const editVehicleTitle = 'Editando veículo'

// SHOW ADD ITEMS VEHICLES
app.get('/add', function(req, res, next){	
    if (auth.authenticationMiddleware(req,res)) { 
       renderPage(req,res,true)
    }
})

function renderPage(req,res,blank) {
    if (blank) req.body = '';
    res.render('vehicles/add-vehicles', { 
        title: newVehicleTilte,
        license_plate: req.body.license_plate,
        model: req.body.model,
        mileage: req.body.mileage,
        year: req.body.year,
        engine: req.body.engine,
        fuel:  req.body.fuel,
        color: req.body.color
    })
}


module.exports = app