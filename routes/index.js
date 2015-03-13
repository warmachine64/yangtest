var crypto = require('crypto'),
    User = require('../models/user.js');

module.exports = function (app) {
    //home
    app.get('/', function (req, res) {
        res.render('index', {
            title: 'ACME Financial',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    //register
    app.get('/reg', function (req, res) {
        res.render('reg', {
            title: 'Sign Up',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.post('/reg', function (req, res) {
        var firstname = req.body.firstname,
            lastname = req.body.lastname,
            age = req.body.age,
            eye = req.body.eye,
            company = req.body.company,
            phone = req.body.phone,
            address = req.body.address,
            email = req.body.email,
            password = req.body.password,
            password_re = req.body['password-repeat'];
        //check re-password
        if (password_re != password) {
            req.flash('error', 'Password error!');
            return res.redirect('/reg');
        }
        //md5
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        var newUser = new User({
            firstname: firstname,
            lastname: lastname,
            age: age,
            eye: eye,
            company: company,
            phone: phone,
            address: address,
            password: password,
            email: email

        });
        //exist or not
        User.get(newUser.email, function (err, user) {
            if (user) {
                req.flash('error', 'Account exist!');
                return res.redirect('/reg'); //fail and return to /reg
            }
            //not exist
            newUser.save(function (err, user) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/reg');//fail
                }
                req.session.user = user;//save into session
                req.flash('success', 'Success, Welcome!');
                res.redirect('/');//success
            });
        });
    });
    //login
    app.get('/login', function (req, res) {
        res.render('login', {
            title: 'Log In',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()});
    });

    app.post('/login', function (req, res) {
        // md5
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        //account exist or not
        User.get(req.body.email, function (err, user) {
            if (!user) {
                req.flash('error', 'Account does not exist!');
                return res.redirect('/login');
            }
            //check password
            if (user.password != password) {
                req.flash('error', 'Password error!');
                return res.redirect('/login');
            }
            //save into session
            req.session.user = user;
            req.flash('success', 'Welcome back!');
            res.redirect('/');
        });
    });


    //edit
    app.get('/edit', function (req, res) {

        var currentUser = req.session.user;
        User.edit(req.body.firstname, req.body.lastname, req.body.age, req.body.eye, req.body.company, req.body.email, req.body.phone, req.body.address, function (err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('back');
            }
            res.render('edit', {
                title: 'Edit',
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });

    app.post('/edit', function (req, res) {
        var currentUser = req.session.user;
        User.update(req.body.firstname, req.body.lastname, req.body.age, req.body.eye, req.body.company, req.body.email, req.body.phone, req.body.address, function (err){

            if (err) {
                req.flash('error', err);
                console.log(err);
                return res.redirect('/edit');
            }
            req.session.user = null;
            req.flash('success', 'Personal Information Saved!  Please Log In Again!');
            res.redirect('/');
        });
    });

    //logout
    app.get('/logout', function (req, res) {
        req.session.user = null;
        req.flash('success', 'Log out!');
        res.redirect('/');
    });

};
