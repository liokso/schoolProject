class User {
    constructor(email, password) {
        this.email = email;
        this.password = password;
        console.log("Ssss");
        this.saveUser = this.saveUser.bind(this);
    }

    saveUser(recall) {
        
    }
}


module.exports = User;