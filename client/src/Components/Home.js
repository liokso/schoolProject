import React, { Component } from 'react';
import Pagination from 'rc-pagination';
import {ListGroup} from 'react-bootstrap';
import ResultsListItems from './ResultsListItems.js';

import 'rc-pagination/assets/index.css';
import './Styles/Home.css'

const address = require('./address');

/**
 * Home
 * all offences
 */
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {data: '', links: [], current: 1, state: true};
        this.link_result = [];
        this.setLinks = this.setLinks.bind(this);
        this.contentChange = this.contentChange.bind(this);
    }

    contentChange(indexs) {
        this.setState({ current: indexs });
        let addons = 10;
        this.setState({
            links: this.link_result.slice((indexs - 1) * addons, (indexs - 1) * addons + addons)
        });        
    }

    setLinks() {
        this.state.data.map((element) => {
            let test = <ResultsListItems condition = {element} key={Math.random()} />;
            this.link_result.push(test);
        });

        this.setState({
            links: this.link_result.slice(0, 10)
        });
    }

    componentDidMount() {
        fetch(address + "offences") //http://hackhouse.sh:3000/offences
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Network response was not ok.");
        })
        .then((result) => {
            this.setState({
                data: result.offences
            });
            this.setLinks();
        })
        .catch((error) => {
            console.log("There has been a problem with your fetch operation: ",error.message);
            this.setState({
                state: false
            });
        });
    }

    render() {
        if (this.state.state) {
            return(
                <main>
                    <div className="center">
                        <div className="content wrap">
                            <div id="content">                    
                                <ListGroup><p id="links">{this.state.links}</p></ListGroup>
                            </div>
                        </div>
    
                        <div id="bottom">
                            <div id="bottom_content">
                                <Pagination onChange={this.contentChange} current={this.state.current} total={this.link_result.length} />
                            </div>
                        </div>
                    </div>            
                </main>            
            );
        }
        else {
            return (
            <div>
                Server Error or No Connection
            </div>);
        }
        
    }
}

export default Home;