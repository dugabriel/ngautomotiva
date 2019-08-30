const express = require('express')
const app = express()
const auth = require('../controller/session')
const newBudgetTilte = 'Novo orçamento'
const listBudgetTitle = 'Listar orçamentos'
const editBudgetTitle = 'Alterando orçamento'

// SHOW ADD BUDGET
app.get('/add', function(req, res, next){	
    if (auth.authenticationMiddleware(req,res)) {
        renderPage(req,res,true)
    }
})

// ADD NEW BUDGET
app.post('/add', function(req, res, next){	
    if (auth.authenticationMiddleware(req,res)) {

        console.log('post add budget')

        req.assert('date_budget', 'A data é obrigatória').notEmpty()
        req.assert('license_plate_id', 'A placa é obrigatória').notEmpty()
        req.assert('model', 'Modelo do veículo é obrigatório').notEmpty()
        req.assert('yearModel', 'Ano do veículo é obrigatório').notEmpty()
        req.assert('customer_registry', 'CPF/CNPF do cliente é obrigatório').notEmpty()
        req.assert('customer_name', 'Nome do cliente é obrigatório').notEmpty()
        req.assert('total', 'O orçamento deve conter um preço').notEmpty()

      
        req.body.table = parseTable(req)

        var errors = req.validationErrors()
        
        if (!errors) {   //No errors were found.  Passed Validation!
     
            // INSERT NEW BUDGET
            var budget = {
                date_budget: req.body.date_budget,
                license_plate: req.sanitize('license_plate').escape().trim(),
                license_plate_id: req.sanitize('license_plate_id').escape().trim(),
                model: req.sanitize('model').escape().trim(),
                yearModel: req.sanitize('yearModel').escape().trim(),
                mileage: req.sanitize('mileage').escape().trim(),
                customer_registry: req.sanitize('customer_registry').escape().trim(),
                customer_name: req.sanitize('customer_name').escape().trim(),
                customer_mail: req.sanitize('customer_mail').escape().trim(),
                total: req.sanitize('total').escape().trim(),
                tableData: req.body.table
            }

            req.getConnection(function(error, conn) {
                conn.query('INSERT INTO budget SET ?', budget, function(err, result) {
                    //if(err) throw err
                    if (err) {
                        req.flash('error', err)
                        
                        renderPage(req,res,false)
                    } else {				
                        req.flash('success', 'cadastrado com sucesso!')
                        
                        renderPage(req,res,true)
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

// SHOW LIST OF CUSTOMER
app.get('/list', function(req, res, next) {
    if (auth.authenticationMiddleware(req,res)) {
        req.getConnection(function(error, conn) {
            conn.query('SELECT * FROM budget ORDER BY customer_name ASC',function(err, rows, fields) {
                if (err) {
                    req.flash('error', err)
                    res.render('budget/list-budget', {
                        title: listBudgetTitle, 
                        data: ''
                    })
                } else {
                    res.render('budget/list-budget', {
                        title: listBudgetTitle, 
                        data: rows
                    })
                }
            })
        })
    }
})

// SHOW EDIT CUSTOMER FORM
app.get('/edit/(:id)', function(req, res, next){
    if (auth.authenticationMiddleware(req,res)) {
        req.getConnection(function(error, conn) {
            conn.query('SELECT * FROM budget WHERE id = ?', [req.params.id], function(err, rows, fields) {
                if(err) throw err
                
                // if items not found
                if (rows.length <= 0) {
                    req.flash('error', 'Orçamento não encontrado com o id = ' + req.params.id)
                    res.redirect('/budget/list')
                }
                else { // if customer found
                    res.render('budget/edit-budget', {
                        title: editBudgetTitle,
                        id: rows[0].id,
                        date_budget: rows[0].date_budget,
                        license_plate_id: rows[0].license_plate_id,
                        license_plate: rows[0].license_plate,
                        model: rows[0].model,
                        mileage: rows[0].mileage,
                        yearModel: rows[0].yearModel,
                        customer_registry: rows[0].customer_registry,
                        customer_name: rows[0].customer_name,
                        customer_mail: rows[0].customer_mail,
                        total: rows[0].total,
                        table: rows[0].tableData			
                    })
                }			
            })
        })
    }
})

app.post('/edit/(:id)', function(req, res, next) {
    if (auth.authenticationMiddleware(req,res)) {

        console.log('post edit budget')

        req.assert('date_budget', 'A data é obrigatória').notEmpty()
        req.assert('license_plate_id', 'A placa é obrigatória').notEmpty()
        req.assert('model', 'Modelo do veículo é obrigatório').notEmpty()
        req.assert('yearModel', 'Ano do veículo é obrigatório').notEmpty()
        req.assert('customer_registry', 'CPF/CNPF do cliente é obrigatório').notEmpty()
        req.assert('customer_name', 'Nome do cliente é obrigatório').notEmpty()
        req.assert('total', 'O orçamento deve conter um preço').notEmpty()

      
        req.body.table = parseTable(req)

        var errors = req.validationErrors()
        
        if( !errors ) {   //No errors were found.  Passed Validation!
            
            // UPDATE BUDGET
            var budget = {
                date_budget: req.body.date_budget,
                license_plate: req.sanitize('license_plate').escape().trim(),
                license_plate_id: req.sanitize('license_plate_id').escape().trim(),
                model: req.sanitize('model').escape().trim(),
                yearModel: req.sanitize('yearModel').escape().trim(),
                mileage: req.sanitize('mileage').escape().trim(),
                customer_registry: req.sanitize('customer_registry').escape().trim(),
                customer_name: req.sanitize('customer_name').escape().trim(),
                customer_mail: req.sanitize('customer_mail').escape().trim(),
                total: req.sanitize('total').escape().trim(),
                tableData: req.body.table
            }
            
            req.getConnection(function(error, conn) {
                conn.query('UPDATE budget SET ? WHERE id = ' + req.params.id, budget, function(err, result) {
                    //if(err) throw err
                    if (err) {
                        req.flash('error', err)
                        renderEditPage(req,res,false)
                    } else {
                        req.flash('success', 'Editado com sucesso')
                        res.redirect('/budget/list')
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
    res.render('budget/add-budget', { 
        title: newBudgetTilte,
        date_budget: req.body.date_budget,
        license_plate_id: req.body.license_plate_id,
        license_plate: req.body.license_plate,
        model: req.body.model,
        mileage: req.body.mileage,
        yearModel: req.body.yearModel,
        customer_registry: req.body.customer_registry,
        customer_name: req.body.customer_name,
        customer_mail: req.body.customer_mail,
        total: req.body.total,
        table: req.body.table
    })
}

function renderEditPage(req,res,blank) {
    if (blank) req.body = '';
    res.render('budget/edit-budget', { 
        title: editBudgetTitle,
        id: req.params.id
    })
}

function parseTable(req) {
    let items = [];

    if (req.body.item) {
        if (typeof req.body.item === 'string') {
            items.push({
                item: req.body.item,
                price: req.body.price,
                qtd: req.body.qtd
            })
        } else {
            for(let i in req.body.item) {
                items.push({
                    item: req.body.item[i],
                    price: req.body.price[i],
                    qtd: req.body.qtd[i]
                })
            }
        }
    }

    console.log(JSON.stringify(items))

    return JSON.stringify(items)
}


module.exports = app