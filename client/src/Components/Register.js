import React from 'react';
import Account from './Account.js'
import {Redirect} from 'react-router-dom';
import {Button, InputGroup, FormControl} from 'react-bootstrap';
import './Styles/Login.css'

const address = require('./address');

const HOME = 1;
const LOGIN = 0;
const REGISTER = 2;

class Register extends Account {
    
    constructor(props) {
        super(props);
        this.state = {redirectAddress: REGISTER, againPassword: ''};
        this.register = this.register.bind(this);
        this.formatVerify = this.formatVerify.bind(this);
        this.updateRepeatPassword = this.updateRepeatPassword.bind(this);
    }

    formatVerify() {
        const email = this.state.email;
        const password = this.state.password;
        const repeatPassword = this.state.againPassword;
        
        if (email.includes('@') && password.length > 7 && password == repeatPassword) {
            return true;
        }
        return false;
    }

    updateRepeatPassword(value) {
        this.setState({
            againPassword: value.target.value
        });
    }

    register() {
        if (this.formatVerify()) {
            fetch(address + "users/register", { //https://cab230.hackhouse.sh/register  http://hackhouse.sh:3000/register
            method: "POST",
            body: 'email=' + this.state.email + '&password=' + this.state.password,
            headers: {
            "Content-type": "application/x-www-form-urlencoded"
            }})
            .then(function(response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("User exists");
            })
            .then((result) => {
                sessionStorage.setItem('token', result.token);
                this.setState({
                    redirectAddress: HOME
                });
                this.props.refresh();
            })
            .catch((error) => {
                this.updateHTML("User exists");
            });
        }
        else {
            this.updateHTML("Please Input Correct Email Address<br>Password has to be more than 8 characters<br>Both password should be same");
        }
        
    }

    render() {
        switch(this.state.redirectAddress) {
            case REGISTER:
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
                                <InputGroup className="mb-2">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1">Confirm</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                        placeholder="******"
                                        aria-label="Username"
                                        aria-describedby="basic-addon1"
                                        type="password"
                                        onChange={value => this.updateRepeatPassword(value)}
                                    />                         
                                </InputGroup>
                                </form>
                            </label>
                            <p id="emailInfo"></p>
                            <Button variant="primary" onClick={this.register}>Register</Button>
                            <Button variant="info" className="btn register" onClick={() => {this.setState({redirectAddress: LOGIN});}}>Go to Login</Button>
                        </div>
                    </div>
                )
            case LOGIN:
                return <Redirect to="/"/>; 
            case HOME:
                return <Redirect to="/home"/>; 
            default:
                return <Redirect to="/"/>; 
        }
    }
}

export default Register;
