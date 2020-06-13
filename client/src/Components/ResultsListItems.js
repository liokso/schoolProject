import React, { Component } from 'react';
import {ListGroupItem} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
import './Styles/ResultsListItems.css'

class ResultsListItems extends Component {
    constructor(props) {
        super(props);   
        this.startSearch = this.startSearch.bind(this);   
        this.state = {redirect: false, url: "/search?" + this.props.condition};
    }

    startSearch() {
        this.setState({
            test: true
        });
    }

    render() {
        if (this.state.test) {
            return <Redirect to={this.state.url} />;
        }
        else {
            return(
                <ListGroupItem className="listItem" action onClick={this.startSearch}>
                    {this.props.condition}
                </ListGroupItem>
            );
        }        
    }
}

export default ResultsListItems;