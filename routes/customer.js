const express = require('express')
const app = express()
const auth = require('../controller/session')
const newCustomerTilte = 'Novo cliente'
const listCustomerTitle = 'Listar clientes'

// SHOW ADD ITEMS VEHICLES
app.get('/add', function(req, res, next){	
    if (auth.authenticationMiddleware(req,res)) { 
        renderPage(req,res,true)
    }
})

// ADD NEW CUSTOMER
// req assert exprees validator
app.post('/add', function(req, res, next){	

    console.log('post add customer')
    req.assert('customer_registry', 'CPF/CNPJ é obrigatório').notEmpty()
    req.assert('customer_registry', 'CPF/CNPJ deve conter no mínimo 11 dígitos').len(11, 30);
    req.assert('customer_name', 'Nome do cliente é obrigatório').notEmpty()
    req.assert('customer_cep', 'CEP é obrigatório').notEmpty()
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
})

// SHOW LIST OF CUSTOMER
app.get('/list', function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM customer ORDER BY customer_name DESC',function(err, rows, fields) {
			if (err) {
				req.flash('error', err)
				res.render('customer/list-customer', {
					title: listCustomerTitle, 
					data: ''
				})
			} else {
				res.render('customer/list-customer', {
					title: listCustomerTitle, 
					data: rows
				})
			}
		})
	})
})


function renderPage(req,res,blank) {
    if (blank) req.body = '';
    res.render('customer/add-customer', { 
        title: newCustomerTilte,
        customer_registry: req.body.customer_registry,
        customer_name: req.body.customer_name,
        customer_cep: req.body.customer_cep,
        customer_placement: req.body.customer_placement,
        customer_city: req.body.customer_city,
        customer_neighborhood: req.body.customer_neighborhood,
        customer_telephone: req.body.customer_telephone,
        customer_cellphone: req.body.customer_cellphone,
        customer_mail:  req.body.customer_mail
    })
}


module.exports = app