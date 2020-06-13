import {FormCheck} from 'react-bootstrap';
import React, { Component } from 'react';
import './Styles/SearchResultWrapper.css'

class SearchResultWrapper extends Component {
    constructor(props) {
        super(props);
        this.select = this.select.bind(this);
    }

    select() {
        //alert(this.props.LGA);
        let data = {'LGA': this.props.LGA, 'total': this.props.total}
        this.props.changeMethod(data);
    }

    render() {
        return(
            <div>
                <li className="wrapperItem">{this.props.LGA}: {this.props.total}
                <FormCheck 
                    onChange={this.select}
                /></li>
            </div>
        );
    };

}

export default SearchResultWrapper;