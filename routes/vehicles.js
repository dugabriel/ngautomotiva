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

// ADD NEW VEHICLE
// req assert exprees validator
app.post('/add', function(req, res, next){	
    if (auth.authenticationMiddleware(req,res)) {

        console.log('post add vehicle')
        req.assert('license_plate', 'Informe a placa').notEmpty()
        req.assert('model', 'Modelo é obrigatório').notEmpty()
        req.assert('mileage', 'KM é obrigatório').notEmpty()
        req.assert('yearModel', 'Ano do veículo é obrigatório').notEmpty()
        req.assert('engine', 'Motorização é obrigatório').notEmpty()
        req.assert('fuel', 'Combustível é obrigatório').notEmpty()
        req.assert('color', 'Cor do veículo é obrigatório').notEmpty()
        req.assert('customer', 'Cliente é obrigatório').notEmpty()
 

        var errors = req.validationErrors()
        
        if (!errors) {   //No errors were found.  Passed Validation!
            
            req.getConnection(function(error, conn) { 
                conn.query(
                    'select license_plate from vehicle where license_plate = ?',
                    [req.body.license_plate],
                    (err, results) => {
                    if (err) {
                        req.flash('error', err)
                        renderPage(req,res,false)
                    } else {
                        if (results[0] != undefined) {
                            console.log('Carro já cadastrado..')
                            req.flash('error', 'Carro já cadastrado')
                            renderPage(req,res,false)
                        } else {
                            // INSERT NEW VEHICLE
                            var vehicle = {
                                license_plate: req.sanitize('license_plate').escape().trim(),
                                model: req.sanitize('model').escape().trim(),
                                mileage: req.sanitize('mileage').escape().trim(),
                                yearModel: req.sanitize('yearModel').escape().trim(),
                                engine: req.sanitize('engine').escape().trim(),
                                fuel: req.sanitize('fuel').escape().trim(),
                                color: req.sanitize('color').escape().trim(),
                                idCustomer: req.sanitize('customer').escape().trim()
                            }
                            req.getConnection(function(error, conn) {
                                conn.query('INSERT INTO vehicle SET ?', vehicle, function(err, result) {
                                    //if(err) throw err
                                    if (err) {
                                        req.flash('error', err)
                                        
                                        renderPage(req,res,false)
                                    } else {				
                                        req.flash('success', req.body.license_plate+' cadastrado com sucesso!')
                                        
                                        renderPage(req,res,true)
                                    }
                                })
                            })

                        }
                    }
                })
            }) 
        } else {  
            var error_msg = ''
            errors.forEach(function(error) {
                error_msg += error.msg + '<br>'
            })				
            req.flash('error', error_msg)		
            
            renderPage(req,res,false)
        }
    }
})


// SHOW LIST OF VEHICLES
app.get('/list', function(req, res, next) {
    if (auth.authenticationMiddleware(req,res)) {
        req.getConnection(function(error, conn) {
            conn.query('select v.id, v.license_plate, v.model, v.yearModel, v.engine, v.fuel, v.color, v.idCustomer, c.customer_registry, c.customer_name from vehicle v inner join customer c on (v.idCustomer = c.id) order by v.license_plate asc',function(err, rows, fields) {
                if (err) {
                    req.flash('error', err)
                    res.render('vehicles/list-vehicles', {
                        title: listVehicleTitle, 
                        data: ''
                    })
                } else {
                    res.render('vehicles/list-vehicles', {
                        title: listVehicleTitle, 
                        data: rows
                    })
                }
            })
        })
    }
})

// SHOW EDIT VEHICLE FORM
app.get('/edit/(:id)', function(req, res, next){
    if (auth.authenticationMiddleware(req,res)) {
        req.getConnection(function(error, conn) {
            conn.query('SELECT * FROM vehicle WHERE id = ?', [req.params.id], function(err, rows, fields) {
                if(err) throw err
                
                if (rows.length <= 0) {
                    req.flash('error', 'Veículo não encontrado com o id = ' + req.params.id)
                    res.redirect('/vehicles/list')
                }
                else { 
                    res.render('vehicles/edit-vehicles', {
                        title: editVehicleTitle,
                        id: rows[0].id,	
                        license_plate: rows[0].license_plate,
                        model: rows[0].model,
                        mileage: rows[0].mileage,
                        yearModel: rows[0].yearModel,
                        engine: rows[0].engine,
                        fuel:  rows[0].fuel,
                        color: rows[0].color,
                        customer: rows[0].customer			
                    })
                }			
            })
        })
    }
})

app.post('/edit/(:id)', function(req, res, next) {
    if (auth.authenticationMiddleware(req,res)) {

        console.log('post edit vehicle')
        req.assert('license_plate', 'Informe a placa').notEmpty()
        req.assert('model', 'Modelo é obrigatório').notEmpty()
        req.assert('mileage', 'KM é obrigatório').notEmpty()
        req.assert('yearModel', 'Ano do veículo é obrigatório').notEmpty()
        req.assert('engine', 'Motorização é obrigatório').notEmpty()
        req.assert('fuel', 'Combustível é obrigatório').notEmpty()
        req.assert('color', 'Cor do veículo é obrigatório').notEmpty()
        req.assert('customer', 'Cliente é obrigatório').notEmpty()

        var errors = req.validationErrors()
        
        if( !errors ) {   //No errors were found.  Passed Validation!
            
            var vehicle = {
                license_plate: req.sanitize('license_plate').escape().trim(),
                model: req.sanitize('model').escape().trim(),
                mileage: req.sanitize('mileage').escape().trim(),
                yearModel: req.sanitize('yearModel').escape().trim(),
                engine: req.sanitize('engine').escape().trim(),
                fuel: req.sanitize('fuel').escape().trim(),
                color: req.sanitize('color').escape().trim(),
                idCustomer: req.sanitize('customer').escape().trim()
            }
            
            req.getConnection(function(error, conn) {
                conn.query('UPDATE vehicle SET ? WHERE id = ' + req.params.id, vehicle, function(err, result) {
                    //if(err) throw err
                    if (err) {
                        req.flash('error', err)
                        renderEditPage(req,res,false)
                    } else {
                        req.flash('success', 'Editado com sucesso')
                        res.redirect('/vehicles/list')
                    }
                })
            })
        }
        else {   //Display errors to items
            var error_msg = ''
            errors.forEach(function(error) {
                error_msg += error.msg + '<br>'
            })
            req.flash('error', error_msg)
            
            renderEditPage(req,res,false)
        }
    }
})


function renderPage(req,res,blank) {
    if (blank) req.body = '';
    res.render('vehicles/add-vehicles', { 
        title: newVehicleTilte,
        license_plate: req.body.license_plate,
        model: req.body.model,
        mileage: req.body.mileage,
        yearModel: req.body.yearModel,
        engine: req.body.engine,
        fuel:  req.body.fuel,
        color: req.body.color,
        customer: req.body.customer
    })
}

function renderEditPage(req,res,blank) {
    if (blank) req.body = '';
    res.render('vehicles/edit-vehicles', { 
        title: editVehicleTitle,
        id: req.params.id,
        license_plate: req.body.license_plate,
        model: req.body.model,
        mileage: req.body.mileage,
        yearModel: req.body.yearModel,
        engine: req.body.engine,
        fuel:  req.body.fuel,
        color: req.body.color,
        customer: req.body.customer
    })
}


module.exports = app