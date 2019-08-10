const express = require('express')
const app = express()
const auth = require('../controller/session')
const homePAge = 'home/home'
const title = 'NG Automotiva'

/**
 * RENDER PAGE LOGIN
 */
app.get('/', function(req, res) {
	res.render('login', {title: title})
})

/**
 * LOGIN ACTION
 */
app.post('/', function(req, res){	
    req.assert('login', 'Informe o login').notEmpty()
    req.assert('password', 'Informe a senha').notEmpty()
    var errors = req.validationErrors()
    
    console.log(req.body.password)
    console.log(req.body.login)

    if (!errors) {
        req.getConnection(function(error, conn) {
            conn.query(
                'select first_name,last_name,login from users where login = ? and pwd = ?',
                [req.body.login, req.body.password],
                (err, results) => {

                if (err) {
                    req.flash('error', err)
                    res.redirect(auth.loginPage())
                } else {
                    if (results[0] != undefined) {
                        console.log('authenticated..')
                        auth.authenticated(req);
                        req.session.login = results[0].login;
                        req.session.first_name = results[0].first_name;
                        req.session.last_name = results[0].last_name;
                        res.render(homePAge, {title: title})
                    } else {
                        console.log('wrong password')
                        req.flash('error', 'login ou senha inválidos')
                        res.redirect(auth.loginPage())
                    }

                }
            })
        })       
    } else {
        let error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
        })
        
        req.flash('error', error_msg)
        res.redirect(auth.loginPage())
    }
})

/**
 * LOGOUT
 */
app.get('/logout', function(req, res) {
    auth.singoff(req, res);
})


/** 
 * We assign app object to module.exports
 * 
 * module.exports exposes the app object as a module
 * 
 * module.exports should be used to return the object 
 * when this file is required in another module like app.js
 */ 
module.exports = app;
