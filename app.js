const express = require('express')
const app = express()
const mysql = require('mysql')
const helmet = require('helmet');

/**
 * This middleware provides a consistent API 
 * for MySQL connections during request/response life cycle
 */ 
const myConnection  = require('express-myconnection')
/**
 * Store database credentials in a separate config.js file
 * Load the file/module and its values
 */ 
const config = require('./config')
const dbOptions = {
	host:	  config.database.host,
	user: 	  config.database.user,
	password: config.database.password,
	port: 	  config.database.port, 
	database: config.database.db
}
/**
 * 3 strategies can be used
 * single: Creates single database connection which is never closed.
 * pool: Creates pool of connections. Connection is auto release when response ends.
 * request: Creates new connection per new request. Connection is auto close when response ends.
 */ 
app.use(myConnection(mysql, dbOptions, 'pool'))

/**
 * setting up the templating view engine
 */ 
app.set('view engine', 'ejs')


/**
 * Express Validator Middleware for Form Validation
 */ 
const expressValidator = require('express-validator')
app.use(expressValidator())


/**
 * body-parser module is used to read HTTP POST data
 * it's an express middleware that reads form's input 
 * and store it as javascript object
 */ 
const bodyParser = require('body-parser')
/**
 * bodyParser.urlencoded() parses the text as URL encoded data 
 * (which is how browsers tend to send form data from regular forms set to POST) 
 * and exposes the resulting object (containing the keys and values) on req.body.
 */ 
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


/**
 * This module let us use HTTP verbs such as PUT or DELETE 
 * in places where they are not supported
 */ 
const methodOverride = require('method-override')

/**
 * using custom logic to override method
 * 
 * there are other ways of overriding as well
 * like using header & using query value
 */ 
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    const method = req.body._method
    delete req.body._method
    return method
  }
}))

/**
 * This module shows flash messages
 * generally used to show success or error messages
 * 
 * Flash messages are stored in session
 * So, we also have to install and use 
 * cookie-parser & session modules
 */ 
const flash = require('express-flash')
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(cookieParser('ZzzZAaaAzzZwWwWfaWwqS'))
app.use(session({ 
	secret: 'ZzzZAaaAzzZwWwWfaWwqS',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 12260000 }
}))


app.use(flash())
app.use(express.static('./public'))
app.use(helmet())


/**
 * IMPORT ROUTES
 */ 
const auth = require('./routes/auth')
const home = require('./routes/home')
const index = require('./routes/index')
const users = require('./routes/users')
const vehicles = require('./routes/vehicles')
const customer = require('./routes/customer')
const budget = require('./routes/budget')

/**
 * DEFINED ROUTES
 */
app.use('/', home)
app.use('/auth', auth)
app.use('/index', index)
app.use('/items', users)
app.use('/vehicles', vehicles)
app.use('/customer', customer)
app.use('/budget', budget)

app.listen(3000, function(){
	console.log('Server running at port 3000: http://127.0.0.1:3000')
})