const debug = require('debug')('route');
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const bodyparser = require('body-parser');
let passport = require('./auth');

module.exports = (app, session) => {

    app.use(helmet());
    app.use(bodyparser.urlencoded({ extended: false }));
    app.use(bodyparser.json());
    app.use(session);

    if (process.env.AUTHENTICATION === 'true') {
        app.use(passport.initialize());
        app.use(passport.session());

        app.post('/login',
            passport.authenticate('local', {
                successRedirect: '/',
                failureRedirect: '/',
                failureFlash: false,
                session: true,
            }),
            function (req, res, next) {
                debug('cert passed...1 ' + req.user.id)
            }
        );

        app.post('/auth/google',
            passport.authenticate('google', { scope: ['openid email profile'] })
        );

        app.get('/auth/google/callback',
            passport.authenticate('google', {
                failureRedirect: '/login'
            }),
            function (req, res) {
                // Authenticated successfully
                debug('google auth success!');
                res.redirect('/');
            }
        );

        app.get('/logout', (req, res, next) => {
            debug('get login html');
            req.logOut();
            res.redirect("/");
        });

        app.use(function (req, res, next) {
            debug('req.user = %s', JSON.stringify(req.user));
            debug('req.session = ' + JSON.stringify(req.session));
            debug('req.sessionID = ' + JSON.stringify(req.sessionID));
            if (!req.user) {
                res.sendFile(path.resolve(__dirname, 'public/login.html'));
            }
            else {
                next();
            }
        });
    }

    app.get('/', (req, res, next) => {
        res.sendFile(path.resolve(__dirname, 'public/index.html'));
    });
    //app.use(express.static(`${__dirname}/dist`));
    app.use(express.static(`${__dirname}/public`));
}
