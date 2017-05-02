const debug = require('debug')('auth');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
let users = require('./users');



let local_strategy = new LocalStrategy(
    {
        // This maps to fields in html form
        usernameField: 'username',
        passwordField: 'password',
    },
    function (username, password, done) {
        debug('local strategy: cert checking...(%s/%s)', username, password)
        let user = users.filter((u) => {
            return u.email == username;
        });
        debug('local strategy: user=%s', JSON.stringify(user));
        if (user.length !== 1) {
            debug('local strategy: Inavlid user');
            return done(null, false, { message: 'Invalid user' });
        }
        if (user[0].password != password) {
            debug('local strategy: Invalid pwd');
            return done(null, false, { message: 'Invalid password' });
        }

        done(null, user[0]);
    }
);

passport.serializeUser(function (user, done) {
    debug('serialize %s', JSON.stringify(user));
    if (user.provider && user.provider == 'google') {
        let u = {
            id: user.id,
            email: user.emails[0].value,
            username: user.displayName,
            provider: user.provider
        };
        let match = users.filter((u) => {
            return u.id == user.id;
        });
        if (match.length == 0) {
            users.push(u);
        }
        done(null, u);
    }
    else {
        done(null, { id: user.id });
    }
});

passport.deserializeUser(function (data, done) {
    let user = null;
    debug('deserialize enter, get id = %s from session', data.id);
    users.forEach((u) => {
        if (u.id == data.id)
            user = u;
    });
    debug('deserialize end, set req.user=%s', JSON.stringify(user));

    done(null, user);
});


let google_strategy = new GoogleStrategy(
    {
        clientID: '705188546883-3f7bt5f8f61ffohd2cfsf2hgjldpov7l.apps.googleusercontent.com',
        clientSecret: 'dGy9EUcjJACji2PERx_CiuTb',
        callbackURL: (process.env.NODE_ENV === 'production') ? 'https://chat-chat-react.herokuapp.com/auth/google/callback' : 'https://127.0.0.1:8080/auth/google/callback',
    },
    function (accessToken, refreshToken, profile, done) {
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //     return done(err, user);
        // });
        return done(null, profile);
    }
);

passport.use('local', local_strategy);
passport.use('google', google_strategy);

module.exports = passport;