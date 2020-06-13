import React, { Component } from 'react';
import {Button, FormControl, Navbar, Form, Nav} from 'react-bootstrap';

const regPatten = RegExp('^https*://.*/(home|search|advancesearch)+.*$')

class NavBarControler extends Component {
    constructor(props) {
        super(props);
        this.handleSearchCondition = this.handleSearchCondition.bind(this);
        this.showMessage = this.showMessage.bind(this);
        this.hideMessage = this.hideMessage.bind(this);
        this.goto = this.goto.bind(this);
        this.state = {searchContent: '', readyRefresh: false};
    }

    handleSearchCondition(event) {
        if (event.target.value != '') {
            this.hideMessage();
            this.setState({
                searchContent: '/search?' + event.target.value,
                readyRefresh: true
            });
        }
        else {
            this.setState({
                readyRefresh: false
            });
        }        
    }

    showMessage() {
        let p = document.getElementById("navMessage");
        p.innerHTML = "Please Search Condition"
    }

    hideMessage() {
        let p = document.getElementById("navMessage");
        p.innerHTML = ""
    }
    
    goto() {
        document.location = this.state.searchContent
    }

    render() {
        let ifShow = false;
        const location = window.location.href;
        if (location.match(regPatten) != null) {
            ifShow = true;
        }

        if (ifShow) {
            return (
                <div>
                    <Navbar bg="light" expand="lg">
                        <Navbar.Brand href="/home">Eyes on Crime</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                            <Nav.Link href="/home">Home</Nav.Link>
                            <Nav.Link href="/advancesearch">Data Filter</Nav.Link>
                            </Nav>
                            <Form inline onSubmit={(event) => {
                                event.preventDefault();
                                }}>
                                    <p id="navMessage"></p>
                                <FormControl type="text" placeholder="Search" className="mr-sm-2" id="condition" name="condition" onChange={this.handleSearchCondition}/>
                                {this.state.readyRefresh?<Button variant="outline-success" type="submit" onClick={this.goto}>Search</Button>:
                                <Button variant="outline-success" type="submit" onClick={this.showMessage}>Search</Button>}
                            </Form>
                        </Navbar.Collapse>
                    </Navbar>
                </div>)
        }
        else {
            return (
            <div>                
            </div>)
        }

        
    }
}

export default NavBarControler;