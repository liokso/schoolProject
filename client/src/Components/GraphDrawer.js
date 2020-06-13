import React, { Component } from 'react';
import {Bar, Line} from 'react-chartjs-2';
import {ButtonToolbar, ToggleButtonGroup, ToggleButton} from 'react-bootstrap';

/**
 * Draw graph 
 */
class GraphDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = {change: false}
        this.graphChange = this.graphChange.bind(this);
    }
    /**
     * change graph type
     * @param {*} value button value
     */
    graphChange(value) {
        if (value === 1) {
            this.setState({
                change: true
            });
        }
        else if (value === 2) {
            this.setState({
                change: false
            });
        }
    }

    render() {
        const ifChange = this.state.change;
        if (ifChange) {
            return(
                <div>
                    <ButtonToolbar>
                        <ToggleButtonGroup type="radio" name="options" defaultValue={1} onChange={this.graphChange}>
                            <ToggleButton value={1}>Bar Chart</ToggleButton>
                            <ToggleButton value={2}>Line Chart</ToggleButton>
                        </ToggleButtonGroup>
                    </ButtonToolbar>
        
                    {/* {this.state.graph} */}
                    <Bar data={this.props.graphData} />
                </div>);
        }
        else {
            return(
                <div>
                    <ButtonToolbar>
                        <ToggleButtonGroup type="radio" name="options" defaultValue={2} onChange={this.graphChange}>
                            <ToggleButton value={1}>Bar Chart</ToggleButton>
                            <ToggleButton value={2}>Line Chart</ToggleButton>
                        </ToggleButtonGroup>
                    </ButtonToolbar>
        
                    {/* {this.state.graph} */}
                    <Line data={this.props.graphData} />
                </div>);
        }
        
    }
}

export default GraphDrawer;