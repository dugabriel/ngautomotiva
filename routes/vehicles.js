var express = require('express')
var app = express()
const auth = require('../controller/session')

// SHOW ADD ITEMS VEHICLES
app.get('/add', function(req, res, next){	
    if (auth.authenticationMiddleware(req,res)) { 
        res.render('vehicles/add-vehicles',{title: 'Novo veículo'})
    }
})


module.exports = app