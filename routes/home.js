const express = require('express')
const app = express()
const auth = require('../controller/session')

app.get('/',function(req, res) {
    if (auth.authenticationMiddleware(req,res)) { 
        console.log('build home')
        res.render('home/home', {title: 'NODE CRUD'})
    } 
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
