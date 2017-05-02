import io from 'socket.io-client';

let instance = null;

class DataManager {
    constructor() {
        if (!instance) {
            instance = this;
            this.username = '';
            this.socket = null;
            this.cbUpdateUser = null;
            this.cbUpdateLocations = null;
            this.cbNewMessage = null;
            this.connect = this.connect.bind(this);
            this.newUser = this.newUser.bind(this);
            this.sendLocation = this.sendLocation.bind(this);
            this.sendMessage = this.sendMessage.bind(this);
            this.handleUpdateUsername = this.handleUpdateUsername.bind(this);
            this.getUsername = this.getUsername.bind(this);
            this.handleUpdateUsers = this.handleUpdateUsers.bind(this);
            this.handleUpdateLocations = this.handleUpdateLocations.bind(this);
            this.handleNewMessage = this.handleNewMessage.bind(this);
            this.registerCbUpdateUser = this.registerCbUpdateUser.bind(this);
            this.registerCbUpdateLocations = this.registerCbUpdateLocations.bind(this);
            this.registerCbNewMessage = this.registerCbNewMessage.bind(this);
        }
        return instance;
    }

    connect() {
        console.log('connect...');
        if (!this.socket) {
            this.socket = io.connect();
            this.socket.on('update-username', this.handleUpdateUsername);
            this.socket.on('update-users', this.handleUpdateUsers);
            this.socket.on('update-locations', this.handleUpdateLocations);
            this.socket.on('new-message', this.handleNewMessage);
        }
    }

    handleUpdateUsername(data) {
        console.log('receive username: %s', JSON.stringify(data));
        if (data)
            this.username = data;
    }

    getUsername () {
        return this.username;
    }

    newUser(name) {
        this.socket.emit('new-user', name);
    }

    sendLocation(location) {
        this.socket.emit('send-location', location);
    }

    sendMessage(msg) {
        this.socket.emit('send-message', msg);
    }

    handleUpdateUsers(data) {
        console.log('receive users list: %s', JSON.stringify(data));
        if (this.cbUpdateUser) {
            this.cbUpdateUser(data);
        }
    }

    handleUpdateLocations(data) {
        console.log('receive locations list: %s', JSON.stringify(data));
        if (this.cbUpdateLocations) {
            this.cbUpdateLocations(data);
        }
    }

    handleNewMessage(data) {
        console.log('receive new message: %s', JSON.stringify(data));
        if (this.cbNewMessage) {
            this.cbNewMessage(data);
        }
    }

    registerCbUpdateUser(cb) {
        this.cbUpdateUser = cb
    }

    registerCbUpdateLocations(cb) {
        this.cbUpdateLocations = cb;
    }

    registerCbNewMessage(cb) {
        this.cbNewMessage = cb;
    }

}


export default DataManager;
