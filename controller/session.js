const loginPage = '/auth'
const title = 'NG Automotiva'

exports.authenticationMiddleware = function(req, res){
    if (req.session.authenticated) {
        return true;
    } else {
        req.flash('error', 'efetue o login na plataforma')
        res.render('login',{title: title})
    }
}

exports.authenticated = function(req) {
    req.session.authenticated = true;
}

exports.singoff = function(req, res) {
    req.session.authenticated = false;
    req.flash('error', 'logout efetuado')
    res.redirect(loginPage)
}

exports.loginPage = function() {
    return loginPage
}