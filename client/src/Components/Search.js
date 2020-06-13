import React, { Component } from 'react';
import SearchResultWrapper from './SearchResultWrapper';
import {Button} from 'react-bootstrap';

import GoogleMapReact from 'google-map-react';

import './Styles/Search.css';
import loding from './resources/loding.gif';
import GraphDrawer from './GraphDrawer';

const address = require('./address');

const ERROR = 0;
const NORMAL = 1;
const LODING = 2;

/**
 * Search with offence name
 */
class SearchResult extends Component {

    constructor(props) {
        super(props);
        this.state = {errorMessage: 'Server Error', Condition: "", currentState: LODING, SearchResult: [], graphData: {
            labels: [],
            datasets: [
              {
                label: 'Amount of Offences',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: []
              }
            ]}, location: {}}; // location = {name: {lat:, lng:}
        this.renderResult = this.renderResult.bind(this);
        this.changeTheGraphData = this.changeTheGraphData.bind(this);
        this.reRenderGraph = this.reRenderGraph.bind(this);
        this.reRenderMap = this.reRenderMap.bind(this);
        
        this.addMarker = this.addMarker.bind(this);

        this.newGraphData = [];  
        this.markers = [];
        this.map = null;
        this.maps = null;      
    }

    changeTheGraphData(data) {
        for (let index = 0; index < this.newGraphData.length; index++) {
            if (data.LGA === this.newGraphData[index].LGA) {
                this.newGraphData.splice(index, 1);
                return;
            }
        }
        this.newGraphData.push(data);
    }

    /**
     * Add marker to map
     * @param {*} map 
     * @param {*} maps 
     * @param {*} label 
     * @param {*} myLatlng 
     */
    addMarker(map, maps, label, myLatlng) {            
        let marker = new maps.Marker({
            position: myLatlng,
            map,
            title: label,
        });     
        this.markers.push(marker);               
            
        map.setCenter(myLatlng);
    }

    /**
     * re-render map
     * Remove old marker
     * Add new marker
     */
    reRenderMap() {
        const map = this.map;
        const maps = this.maps;
        //let markers = this.markers;

        if (map == null || maps == null)
            return;

        let tempData = this.state.graphData;
        let labels = tempData.labels;
        for (let index=0; index < labels.length; index++) {
            this.addMarker(map, maps, labels[index], this.state.location[labels[index]])
        }
    }

    /**
     * Remove old data from graph
     * Add new data to graph
     */
    reRenderGraph() {
        let tempData = this.state.graphData;
        let labels = [];
        let data = [];
        for (let index=0; index < this.newGraphData.length; index++) {
            labels.push(this.newGraphData[index].LGA);
            data.push(this.newGraphData[index].total);
        }
        tempData.labels = labels; 
        tempData.datasets[0].data = data; 
        this.setState({
            graphData: tempData
        });
        this.newGraphData = [];


        for (let index = 0; index < this.markers.length; index++) {
            this.markers[index].setMap(null);
        }
        this.markers = [];
        
        this.reRenderMap();
    }

    componentWillMount() {
        let condition = document.URL.split('?')[1].replace(/%20/g, ' ');
        //let condition = this.props.condition;
        let getParam = { method: "GET" };
        let JWT = sessionStorage.getItem('token');
        //let JWT = "test";
        let head = { Authorization: `${JWT}` }; // JWT is token from Login `Bearer ${JWT}`
        getParam.headers = head;
        const searchURL = address + 'search?offence=';//http://hackhouse.sh:3000/search?offence=
        const url = searchURL + condition;
        fetch(encodeURI(url), getParam)
        .then(response => {
            if (response.ok) {
                return response.json();
            }            
            else if (response.status === 400) {
                this.setState({
                    errorMessage: "Offence Query Parameter Wrong",
                    currentState: ERROR
                });
            }
            else if (response.status === 401) {
                this.setState({
                    errorMessage: "Token expired",
                    currentState: ERROR
                });
            }
        })
        .then(result => {
            if (result != null && result.result != null) {
                let tempResult = [];
                let labels = [];
                let data = [];
                let newLocation = {};
                result.result.map((element) => {
                    if (element.total > 0) {
                        tempResult.push(element);
                        labels.push(element.LGA);
                        data.push(element.total);
                        newLocation[element.LGA] = {lat: element.lat, lng: element.lng}
                    }
                });
                let tempData = this.state.graphData;
                tempData.labels = labels;
                tempData.datasets[0].data = data;      
                         
                this.setState({
                    Condition: condition,
                    SearchResult: tempResult,
                    graphData: tempData,
                    currentState: NORMAL,
                    location: newLocation
                });
                this.reRenderMap();
            }
        })        
    }

    /**
     * render reulst into proper format
     */
    renderResult() {
        let renderResult = [];
        const results = this.state.SearchResult;
        results.map((element) => {
            renderResult.push(<SearchResultWrapper LGA={element.LGA} total={element.total} changeMethod={this.changeTheGraphData} key={Math.random()}/>);
        });

        return React.createElement('ul', {}, renderResult);
    }

    render() {

        if (this.state.currentState === NORMAL) {
            const pp = {
                width: '900px',
                height: '60vh',
                padding: '5vw',
            };
    
            return(
                <div >            
                    <div className="condition">
                        <h1>{this.state.Condition}</h1>
                    </div>
                    
                    <div className="wrapper">
                        <div className="content">
                            <div>
                                
                                <div className="resultContainer">
                                    {this.renderResult()}                            
                                </div>
                                
                                <div className="applyButton">
                                        <Button variant="primary" onClick={this.reRenderGraph}>Apply to Graph and Map</Button>
                                </div>

                            </div>
                            <div style={pp}>

                                <GraphDrawer graphData={this.state.graphData}/>    
    
                                <div className="googleMapSearch">
                                    <GoogleMapReact
                                        bootstrapURLKeys={{ key: 'AIzaSyCgpjf1CjGLQgtq2p1c927wjE5W02Bzucs'/* YOUR KEY HERE */ }}
                                        defaultCenter={{lat: 59.95, lng: 30.33}}
                                        heatmapLibrary={true}
                                        defaultZoom={5}
                                        yesIWantToUseGoogleMapApiInternals={true}
                                        onGoogleApiLoaded={({map, maps})  => {
                                            this.map = map;
                                            this.maps = maps;
                                            this.reRenderMap();
                                        }}
                                        >
                                    </GoogleMapReact>
                                    </div>
                            </div>                        
                        </div>                    
                    </div>                 
                        
                </div>
            );
        }
        else if(this.state.currentState === ERROR) {
            return(
            <div>        
                <div>{this.state.errorMessage}</div>
            </div>
            );
        }
        else if (this.state.currentState === LODING) {
            return(
                <div>
                    <div id="load">
                        <img src={loding} alt="loading"></img>
                    </div>
                </div>
            );
        }
    }
}

export default SearchResult;