import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch
} from "react-router-dom";
import './App.css';
import moment from "moment";
import ReactDOM from "react-dom";
import socketIOClient from "socket.io-client";
const {useEffect} = require("react");
const {useState} = require("react");

const username = prompt("Quel est votre pseudo ?");
moment.locale('fr')
const socket = socketIOClient("http://localhost:4242", {
    transports: ["websocket", "polling"]
});

const Home = ({}) => {
    return (
        <Router>
            <Switch>
                <Route path="/">
                    <App />
                </Route>
                <Route path="/create_channel">
                    <Create />
                </Route>
            </Switch>
        </Router>
    )
}

function Create() {
    return(
        <h1>Oe oe oe</h1>
    )
}

function App() {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [ChannelName, setChannelName] = useState("");
    //const [ChannelList, setChannelList] = useState([]);
    const [messages, setMessages] = useState([]);
//verif role
    useEffect(() => {
        socket.on("connect", () => {
            socket.emit("username", username);
        });

        socket.on("users", users => {
            setUsers(users);
        });

        socket.on("message", message => {
            setMessages(messages => [...messages, message]);
        });

        socket.on("connected", user => {
            setUsers(users => [...users, user]);
        });
    }, []);

    const submit = event => {
        event.preventDefault();

        if (message.substr(0,5) === "/nick") {
            let newUsername = message.substr(6, 10);
            socket.emit("newUsername", newUsername)
        } else if(message.substr(0, 6) === "/users") {
            let list = document.getElementById('users').textContent;
            /*for (let i; i < il; i++) {
                console.log(users)
            }*/
            socket.emit("send", list)
            setMessage("");
        } else if(message.substr(0, 7) === "/create") {
            let newChannel = message.substr(8, 10);
            socket.emit("newChannel", newChannel);
            setMessage("");
        } else {
            socket.emit("send", message);
            setMessage("");
        }
    };

    const submitcreatechannel = event => {
        event.preventDefault();
        socket.emit('CreateChannel', ChannelName)
        setChannelName("");
    };

    return (
        <div>
            <form onSubmit={submitcreatechannel} id="form_create_channel">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        id="channel_name"
                    />
                    <button id="submit" type="submit" className="btn btn-success">Créer</button>
                </div>
            </form>

            <h1>Bonjour {username}</h1>
            <div className="row">
                <div className="col-md-8">
                    <h6>Messages</h6>
                    <div id="messages">
                        {messages.map(({ user, date, text }, index) => (
                            <div key={index} className="row mb-2">
                                <div className="col-md-3">
                                    {moment(date).format("hh:mm:ss a")}
                                </div>
                                <div className="col-md-2">{user.name}: </div>
                                <div className="col-md-2">{text}</div>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={submit} id="form">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                onChange={e => setMessage(e.currentTarget.value)}
                                value={message}
                                id="text"
                            />
                            <span className="btn">
                <button id="submit" type="submit" className="btn btn-success">
                  Envoyer le message
                </button>
              </span>
                        </div>
                    </form>
                </div>
                <div className="col-md-4">
                    <h6>Users</h6>
                    <ul id="users">
                        {users.map(({ name, id }) => (
                            <li key={id}>{id} - {name}-<a href={'/messagePrivate?to=' + name}>MP</a></li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));

/*
class Home extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isSignedUp: false,
            name: '',
            timestamp: '',
        }

        Welcome((err, timestamp) => this.setState({
            timestamp
        }));
    }

    cookies = new Cookies();

    mySubmitHandler = (event) => {
        event.preventDefault()
        this.cookies.set('username', this.state.name)
    }

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }

    render() {
        return (
            <div>
                <p className="App-intro">
                    This is the timer value: {this.state.timestamp}
                </p>
                <h2>Home</h2>

                <p>Mon pseudo: {this.cookies.get('username')}</p>

                <form onSubmit={this.mySubmitHandler} method='POST' action='/login'>
                    <input name="name" type="text" placeholder="Name" onChange={this.myChangeHandler} value={this.state.name} />
                    <input name="submit" type="submit" value="Valider mon pseudo" onChange={this.myChangeHandler} />
                </form>
            </div>
        )
    }
}*/

export default Home;
