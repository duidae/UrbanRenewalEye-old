import React from 'react';
import ReactDOM from 'react-dom';
import DataManager from './DataManager';
let dataMgr = new DataManager();

// Functional, stateless
const MyComponent = (props) => (
    <div>Hello, device! {props.xxx}</div>
);

// ES6
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        return (
            <div>
                <MyComponent />
                <MyComponent xxx="(certain value)" />
                <h1>Hello, {this.props.name} !</h1>
            </div>
        );
    }
}
App.propTypes = {
    name: React.PropTypes.string,
}
App.defaultProps = {
    name: "default",
}

class OnlineUsers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userList: [],
        };
        this.handleUpdateUsers = this.handleUpdateUsers.bind(this);
        dataMgr.registerCbUpdateUser(this.handleUpdateUsers);
    }
    handleUpdateUsers(users) {
        console.log('receive user list: %s', JSON.stringify(users));
        this.setState({ userList: users });
        //const newMessages = [...this.state.messages, data.msg];
        //this.setState({ messages: newMessages });
        //this.inputText.focus();
    }
    render() {
        return (
            <div>
                <div className="panel panel-success">
                    <div className="panel-heading">{this.props.title}</div>
                    <div className="panel-body">
                        {this.state.userList.join(', ')}
                    </div>
                </div>
            </div>
        );
    }
}

class ChatForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            text: "",
        };
        this.handleSend = this.handleSend.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleNewMessage = this.handleNewMessage.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);

        dataMgr.registerCbNewMessage(this.handleNewMessage);
    }
    handleSend(e) {
        e.preventDefault();
        console.log('handle send action');
        if (this.state.text.length > 0) {
            dataMgr.sendMessage(this.state.text);
            this.setState(
                { text: '' }
            );
        }
    }
    handleTextChange(e) {
        //console.log(e.target.value);
        this.setState(
            { text: e.target.value }
        );
    }
    handleNewMessage(data) {
        console.log('receive new message: %s', JSON.stringify(data));
        const newMessages = [...this.state.messages, (data.username + ': ' + data.msg)];
        this.setState({ messages: newMessages });
        this.inputText.focus();
        let d = document.getElementById('divDialogBox');
        d.scrollTop = d.scrollHeight;
    }
    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.handleSend(e);
        }
    }
    componentDidUpdate() {

    }
    render() {
        return (
            <div>
                <div className="panel panel-success">
                    <div className="panel-heading">{this.props.title}</div>
                    {/*<div className="panel-body bg-danger text-danger" >Connection lost...</div>*/}
                    <div className="panel-body pre-scrollable" style={{ height: '300px' }} id='divDialogBox'>
                        {this.state.messages.map((message, i) => {
                            return <div className='well well-sm' key={i}>{message}</div>;
                        })}
                    </div>
                </div>
                <div className='form-group'>
                    <label>{this.props.msgTitle}</label>
                    <textarea className='form-control' onChange={this.handleTextChange} value={this.state.text} ref={(area) => { this.inputText = area; }} onKeyPress={this.handleKeyPress}></textarea>
                </div>
                <button type="submit" className='btn btn-primary' onClick={this.handleSend}>說吧！</button>
            </div>
        );
    }
}

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
        };
        this.handleLogin = this.handleLogin.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }
    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.handleLogin(e);
        }
    }
    handleTextChange(e) {
        console.log(e.target.value);
        this.setState(
            { username: e.target.value }
        );
    }
    handleLogin(e) {
        //e.preventDefault();
        var tmpUsername = this.state.username.trim();
        if (tmpUsername.length > 0) {
            dataMgr.connect();
            dataMgr.newUser(tmpUsername)
            //if (this.props.returnUserName != null)
            //this.props.returnUserName(tmpUsername);
        }
    }
    render() {
        return (
            <div className='col-md-3 well'>
                <form action='/login' method='post'>
                    <div className='form-group'>
                        <label htmlFor='inputEmail1'>Email address</label>
                        <input type='email' className='form-control' id='inputEmail1' name='username' placeholder='Email'
                            value={this.state.username} onChange={this.handleTextChange} onKeyPress={this.handleKeyPress}></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputPassword1">Password</label>
                        <input type="password" className="form-control" id="inputPassword1" name='password' placeholder="Password" />
                    </div>
                    <button type="submit" className='btn btn-primary' onClick={this.handleLogin}>Login</button>
                </form>
            </div>
        );
    }
}


class ChatDialog extends React.Component {
    constructor(props) {
        super(props);
        this.username = '';
    }
    componentWillMount() {
        let animal = require('./animal.js')
        dataMgr.connect();
        dataMgr.newUser(animal());
        this.username = dataMgr.getUsername();
    }
    render() {
        return (
            <div className='' style={{backgroundColor: '#EEEEEE'}}>
                <OnlineUsers title='線上居民'></OnlineUsers>
                <ChatForm title='聊天室 - 更新單元（...）' msgTitle='我想說的話：'></ChatForm>
            </div>
        );
    }
};

export default ChatDialog;
