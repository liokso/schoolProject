import React from 'react';
import Account from './Account.js'
import {Redirect} from 'react-router-dom';
import {Button, InputGroup, FormControl} from 'react-bootstrap';
import './Styles/Login.css'
const address = require('./address');

const HOME = 1;
const LOGIN = 0;
const REGISTER = 2;

class Login extends Account {
    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
        this.state = {redirectAddress: LOGIN};
    }    

    login() {
        fetch(address + "users/login", { //http://hackhouse.sh:3000/login
            method: "POST",
            body: 'email=' + this.state.email + '&password=' + this.state.password,
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error("Invalid Email or Password");
            }            
        })
        .then(object => {
            console.log(object.token);
            sessionStorage.setItem('token', object.token);
            this.setState({redirectAddress: HOME});  // Must before change the props
            this.props.refresh();                                                 
        })
        .catch(error => {
            this.updateHTML(error.message);
        });
    }

    render() {
        switch(this.state.redirectAddress) {            
            case LOGIN:
                return(
                    <div id="login_main">
                        <div>
                            <label>
                                <form onSubmit={(event) => {
                                    event.preventDefault();
                                }}>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="basic-addon1">Email:</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            placeholder="e.g. 444@gmail.com"
                                            aria-describedby="basic-addon1"
                                            onChange= {value => this.updateEmail(value)}
                                        />                            
                                    </InputGroup>
                                    <InputGroup className="mb-2">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="basic-addon1">Password</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            placeholder="******"
                                            aria-label="Username"
                                            aria-describedby="basic-addon1"
                                            type="password"
                                            onChange={value => this.updatePassword(value)}
                                        />                            
                                    </InputGroup>
                                </form>
                            </label>
                            <p id="emailInfo"></p>
                            <Button variant="primary" onClick={this.login}>Login</Button>
                            <Button variant="info" className="btn register" onClick={() => {this.setState({redirectAddress: REGISTER});}}> Go to Register</Button>
                        </div>
                    </div>
                );
            case HOME:
                return <Redirect to="/home"/>;
            case REGISTER:
                return <Redirect to="/register/"/>;
            default:
                return <Redirect to="/register/"/>;
        }
            
        };
}

export default Login;