import { Component } from 'react';

class Account extends Component {
    
    constructor(props) {
        super(props);
        this.state = {email: '', password: ''};
        this.updateEmail = this.updateEmail.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.updateHTML = this.updateHTML.bind(this);
    }

    /**
     * Update HTML warning message
     * @param {*} message 
     */
    updateHTML(message) {
        let p = document.querySelector('#emailInfo');
        p.innerHTML = message;
    }

    /**
     * update email
     * @param {*} value 
     */
    updateEmail(value) {
        this.setState({
            email: value.target.value
        });
    }

    /**
     * update password
     * @param {*} value 
     */
    updatePassword(value) {
        this.setState({
            password: value.target.value
        });
    }
}

export default Account;