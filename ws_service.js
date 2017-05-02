const debug = require('debug')('ws');
const sharedsession = require('express-socket.io-session');
let users = require('./users');

module.exports = (server, session) => {
    const io = require('socket.io').listen(server);

    let connections = [];

    io.use(sharedsession(session, {
        autoSave: true,
    }));
    io.use(function (socket, next) {
        debug('check request.user %s', JSON.stringify(socket.request.user));
        debug('check request.session %s', JSON.stringify(socket.request.session));
        debug('check handshake %s', JSON.stringify(socket.handshake, null, 2));
        debug('check cookie %s', JSON.stringify(socket.request.headers));
        debug('check socket.id %s', JSON.stringify(socket.id));
        //session(socket.request, socket.request.res, next);
        next();
    });


    io.sockets.on('connection', (socket) => {
        updateLocations = () => {
            let locations = []
            connections.forEach((s) => {
                if (s.username && s.location) {
                    //debug('username=%s, location=%s %s', s.username, s.location.lat, s.location.lng);
                    locations.push({ username: s.username, location: s.location });
                }
            });
            debug('updateLocations(): len=%d, %s', locations.length, JSON.stringify(locations, null, ' '));
            if (locations.length > 0) {
                io.sockets.emit('update-locations', locations);
            }
        };

        updateUsers = () => {
            let usernames = [];
            connections.forEach((s) => {
                if (s.username) {
                    usernames.push(s.username);
                }
            });
            debug('updateUsers(): len=%d, %s', usernames.length, JSON.stringify(usernames, null, ' '));
            if (usernames.length > 0) {
                io.sockets.emit('update-users', usernames);
            }
        };

        connections.push(socket);
        let passport = socket.handshake.session.passport;
        if (passport) {
            // check from user DB, can be replaced with any kind of DB.
            let user = users.filter((u) => {
                debug('u id:' + u.id)
                debug('passport id:' + passport.user.id)
                return u.id == passport.user.id;
            });
            if (user.length == 1) {
                debug('update-username ' + user[0].username);
                socket.emit('update-username', user[0].username);
                socket.username = user[0].username;
                updateUsers();
            }
        }

        debug('Connected: %s socket connections', connections.length);

        socket.on('disconnect', (data) => {
            //if (!socket.username) return;
            connections.splice(connections.indexOf(socket), 1);
            updateUsers();
            updateLocations();

            debug('Disconnected: %s socket connections', connections.length);
        });

        socket.on('new-user', (data) => {
            debug('new-user: %s', data);
            socket.username = data;
            updateUsers();
            updateLocations();
        });

        socket.on('send-message', (data) => {
            if (socket.username === undefined) {
                debug('no username!');
                return;
            }
            debug('new message: %s from %s', data, socket.username);
            io.sockets.emit('new-message', { username: socket.username, msg: data });
        });

        socket.on('send-location', (data) => {
            if (socket.username === undefined) {
                debug('no username!');
                return;
            }
            debug('send-location: %s', JSON.stringify(data, null, ' '));
            socket.location = data;
            updateLocations();
        });


    });
};
