import React, { Component } from 'react';
import GraphDrawer from './GraphDrawer';
import {Button} from 'react-bootstrap';
import {areaBased, yearBased, offenceBased} from './FilterTableAndGraphFuncs.js';

/**
 * Advance Search Result Graph
 */
class AdvanceSearchResultGraph extends Component {
    constructor(props) {
        super(props);
        this.state = {graphData: this.props.graphData, showDiagram: false};
        this.changeGraphToYearBase = this.changeGraphToYearBase.bind(this);
        this.changeGraphToAreaBase = this.changeGraphToAreaBase.bind(this);
        this.changeGraphToOffenceBase = this.changeGraphToOffenceBase.bind(this);
    }

    /**
     * Change graph data
     * @param {*} datas 
     */
    graphChangeCenter(datas) {
        const keys = Object.keys(datas);
        const values = Object.values(datas);
        let tempData = this.state.graphData;
        tempData.labels = keys;
        tempData.datasets[0].data = values;               
        this.setState({
            graphData: tempData,
            showDiagram: true
        });
    }

    /**
     * change data to year based
     */
    changeGraphToYearBase() {
        let datas = yearBased(this.props.results);
        this.graphChangeCenter(datas);
    }

    /**
     * change data to area based
     */
    changeGraphToAreaBase() {
        let datas = areaBased(this.props.results);
        this.graphChangeCenter(datas);
    }

    /**
     * change data to offence area based
     */
    changeGraphToOffenceBase() {
        let datas = offenceBased(this.props.offences, this.props.results);
        this.graphChangeCenter(datas);
    }

    render() {
        const display = this.props.display
        if (display) {
            return(
                <div>
                    <div id="graphChangeBtns">
                            <Button className="graphChangeBtn" onClick={this.changeGraphToYearBase}>Show Year Based Diagram</Button>
                            <Button className="graphChangeBtn" onClick={this.changeGraphToAreaBase}>Show Area Based Diagram</Button>
                            <Button className="graphChangeBtn" onClick={this.changeGraphToOffenceBase}>Show Offence Based Diagram</Button>
                    </div>
                    {this.state.showDiagram?<div id="graphWrapperAS">
                    <GraphDrawer graphData={this.state.graphData}/>
                </div>:
                <div></div>
                }                    
                </div>
                );
        }
        else {
            return(
                <div></div>
            );
        }
        
    };
}

export default AdvanceSearchResultGraph;