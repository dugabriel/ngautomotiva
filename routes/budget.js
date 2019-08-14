const express = require('express')
const app = express()
const auth = require('../controller/session')
const newBudgetTilte = 'Novo orçamento'
const listBudgetTitle = 'Listar orçamentos'
const editBudgetTitle = 'Alterando orçamento'

// SHOW ADD ITEMS CUSTOMER
app.get('/add', function(req, res, next){	
    if (auth.authenticationMiddleware(req,res)) { 
        renderPage(req,res,true)
    }
})

// ADD NEW CUSTOMER
// req assert exprees validator
app.post('/add', function(req, res, next){	
    if (auth.authenticationMiddleware(req,res)) {

        console.log('post add customer')
        req.assert('customer_registry', 'CPF/CNPJ é obrigatório').notEmpty()
        req.assert('customer_registry', 'CPF/CNPJ deve conter no mínimo 11 dígitos').len(11, 30);
        req.assert('customer_name', 'Nome do cliente é obrigatório').notEmpty()
        req.assert('customer_cep', 'CEP é obrigatório').notEmpty()
        req.assert('customer_cep', 'CEP deve conter no máximo 8 dígitos').len(0, 10);
        req.assert('customer_placement', 'Endereço é obrigatório').notEmpty()
        req.assert('customer_state', 'Estado é obrigatório').notEmpty()
        req.assert('customer_city', 'Cidade é obrigatório').notEmpty()
        //req.assert('customer_neighborhood', 'Bairro é obrigatório').notEmpty()
        req.assert('customer_cellphone', 'Celular é obrigatório').notEmpty()
        
        var errors = req.validationErrors()
        
        if (!errors) {   //No errors were found.  Passed Validation!
            
            req.getConnection(function(error, conn) { 
                conn.query(
                    'select customer_registry from customer where customer_registry = ?',
                    [req.body.customer_registry],
                    (err, results) => {
                    if (err) {
                        req.flash('error', err)
                        renderPage(req,res,false)
                    } else {
                        if (results[0] != undefined) {
                            console.log('Cliente já cadastrado..')
                            req.flash('error', 'Usuário já cadastrado')
                            renderPage(req,res,false)
                        } else {
                            // INSERT NEW USER
                            var customer = {
                                customer_registry: req.sanitize('customer_registry').escape().trim(),
                                customer_name: req.sanitize('customer_name').escape().trim(),
                                customer_cep: req.sanitize('customer_cep').escape().trim(),
                                customer_placement: req.sanitize('customer_placement').escape().trim(),
                                customer_state: req.sanitize('customer_state').escape().trim(),
                                customer_city: req.sanitize('customer_city').escape().trim(),
                                customer_neighborhood: req.sanitize('customer_neighborhood').escape().trim(),
                                customer_telephone: req.sanitize('customer_telephone').escape().trim(),
                                customer_cellphone: req.sanitize('customer_cellphone').escape().trim(),
                                customer_mail: req.sanitize('customer_mail').escape().trim()
                            }
                            req.getConnection(function(error, conn) {
                                conn.query('INSERT INTO customer SET ?', customer, function(err, result) {
                                    //if(err) throw err
                                    if (err) {
                                        req.flash('error', err)
                                        
                                        renderPage(req,res,false)
                                    } else {				
                                        req.flash('success', req.body.customer_name+' cadastrado com sucesso!')
                                        
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

// SHOW LIST OF CUSTOMER
app.get('/list', function(req, res, next) {
    if (auth.authenticationMiddleware(req,res)) {
        req.getConnection(function(error, conn) {
            conn.query('SELECT * FROM customer ORDER BY customer_name ASC',function(err, rows, fields) {
                if (err) {
                    req.flash('error', err)
                    res.render('customer/list-customer', {
                        title: listBudgetTitle, 
                        data: ''
                    })
                } else {
                    res.render('customer/list-customer', {
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
            conn.query('SELECT * FROM customer WHERE id = ?', [req.params.id], function(err, rows, fields) {
                if(err) throw err
                
                // if items not found
                if (rows.length <= 0) {
                    req.flash('error', 'Cliente não encontrado com o id = ' + req.params.id)
                    res.redirect('/customer/list')
                }
                else { // if customer found
                    res.render('customer/edit-customer', {
                        title: editBudgetTitle,
                        id: rows[0].id,
                        customer_registry: rows[0].customer_registry,
                        customer_name: rows[0].customer_name,
                        customer_cep: rows[0].customer_cep,
                        customer_placement: rows[0].customer_placement,
                        customer_state: rows[0].customer_state,
                        customer_city: rows[0].customer_city,
                        customer_neighborhood: rows[0].customer_neighborhood,
                        customer_telephone: rows[0].customer_telephone,
                        customer_cellphone: rows[0].customer_cellphone,
                        customer_mail: rows[0].customer_mail				
                    })
                }			
            })
        })
    }
})

app.post('/edit/(:id)', function(req, res, next) {
    if (auth.authenticationMiddleware(req,res)) {

        console.log('post edit customer')
        req.assert('customer_registry', 'CPF/CNPJ é obrigatório').notEmpty()
        req.assert('customer_registry', 'CPF/CNPJ deve conter no mínimo 11 dígitos').len(11, 30);
        req.assert('customer_name', 'Nome do cliente é obrigatório').notEmpty()
        req.assert('customer_cep', 'CEP é obrigatório').notEmpty()
        req.assert('customer_cep', 'CEP deve conter no máximo 8 dígitos').len(0, 10);
        req.assert('customer_placement', 'Endereço é obrigatório').notEmpty()
        req.assert('customer_state', 'Estado é obrigatório').notEmpty()
        req.assert('customer_city', 'Cidade é obrigatório').notEmpty()
        //req.assert('customer_neighborhood', 'Bairro é obrigatório').notEmpty()
        req.assert('customer_cellphone', 'Celular é obrigatório').notEmpty()

        var errors = req.validationErrors()
        
        if( !errors ) {   //No errors were found.  Passed Validation!
            
            var customer = {
                customer_registry: req.sanitize('customer_registry').escape().trim(),
                customer_name: req.sanitize('customer_name').escape().trim(),
                customer_cep: req.sanitize('customer_cep').escape().trim(),
                customer_placement: req.sanitize('customer_placement').escape().trim(),
                customer_state: req.sanitize('customer_state').escape().trim(),
                customer_city: req.sanitize('customer_city').escape().trim(),
                customer_neighborhood: req.sanitize('customer_neighborhood').escape().trim(),
                customer_telephone: req.sanitize('customer_telephone').escape().trim(),
                customer_cellphone: req.sanitize('customer_cellphone').escape().trim(),
                customer_mail: req.sanitize('customer_mail').escape().trim()
            }
            
            req.getConnection(function(error, conn) {
                conn.query('UPDATE customer SET ? WHERE id = ' + req.params.id, customer, function(err, result) {
                    //if(err) throw err
                    if (err) {
                        req.flash('error', err)
                        renderEditPage(req,res,false)
                    } else {
                        req.flash('success', 'Editado com sucesso')
                        res.redirect('/customer/list')
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
        title: newBudgetTilte
    })
}

function renderEditPage(req,res,blank) {
    if (blank) req.body = '';
    res.render('budget/edit-budget', { 
        title: editBudgetTitle,
        id: req.params.id
    })
}


module.exports = app