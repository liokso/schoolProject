import React, { Component } from 'react';
import Select from 'react-select';
import {Button, Table} from 'react-bootstrap';
import './Styles/AdvanceSearch.css'
import loding from './resources/loding.gif';
import makeAnimated from 'react-select/lib/animated';
import {renderTableTitle, renderTableRows, areaBased, yearBased, offenceBased} from './FilterTableAndGraphFuncs.js';
import AdvanceSearchResultGraph from './AdvanceSearchResultGraph';

const ERROR = 0;
const NORMAL = 1;
const LODING = 2;

const address = require('./address');

/**
 * Advance Search (Data filter)
 */
class AdvanceSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {errorMessage: 'Server Error', display: false, finishLoading: true, currentState: LODING, warningMessage: '', areaOption: [], offenceOption: [], genderOption: [{value: 'all', label: 'all'}], 
            ageOption: [{value: 'all', label: 'all'}], yearOption: [{value: 'all', label: 'all'}], offencesTitles: [], resultData: [],
            graphData: {
                labels: ['A', 'B'],
                datasets: [
                  {
                    label: 'Amount of Offences',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: [12, 13]
                  }
                ]}};
        this.areaSelect = this.areaSelect.bind(this);
        this.offenceSelect = this.offenceSelect.bind(this);
        this.generateQueryCondition = this.generateQueryCondition.bind(this);
        this.fetchAreas = this.fetchAreas.bind(this);
        this.fetchGender = this.fetchGender.bind(this);
        this.fetchAges = this.fetchAges.bind(this);
        this.fetchYears = this.fetchYears.bind(this);
        this.fetchOffence = this.fetchOffence.bind(this);
        this.startQuery = this.startQuery.bind(this);

        this.genderSelect = this.genderSelect.bind(this);
        this.ageSelect = this.ageSelect.bind(this);
        this.startYearSelect = this.startYearSelect.bind(this);
        this.endYearSelect = this.endYearSelect.bind(this);

        this.fetchCenter = this.fetchCenter.bind(this);

        this.titles = '';
        this.data = [];
        this.results = [];

        this.areas = [];
        this.offences = [];
        this.gender = '';
        this.age = '';
        this.year1 = '';
        this.year2 = '';
        
        this.lodingCounter = 0;
    }

    /**
     * Set area condition
     * @param {*} values 
     */
    areaSelect(values) {
        if (values.length > 5) {
            values.pop();
        }
        else {
            let tempAreas = [];
            values.map((element) => {
                tempAreas.push(element.value);
            });
            this.areas = tempAreas;
        }        
    }

    /**
     * Set offence condition
     * @param {*} values 
     */
    offenceSelect(values) {
        if (values.length > 5) {
            values.pop();
        }
        else {
            let tempOffences = [];
            values.map((element) => {
                tempOffences.push(element.value);
            });
            this.offences = tempOffences;
        } 
    }

    /**
     * Set gender condition
     * @param {*} values 
     */
    genderSelect(values) {
        this.gender = values.value;
    }

    /**
     * Set age condition
     * @param {*} values 
     */
    ageSelect(values) {
        this.age = values.value;
    }

    /**
     * Set year one condition
     * @param {*} values 
     */
    startYearSelect(values) {
        this.year1 = values.value;
    }

    /**
     * Set year two condition
     * @param {*} values 
     */
    endYearSelect(values) {
        this.year2 = values.value;
    }

    /**
     * Generate query based on user selected conditions
     */
    generateQueryCondition() {
        const finalGender = "gender=" + (this.gender === 'all'?'':this.gender);
        const finalAge = "&age=" + (this.age === 'all'?'':this.age);
        const finalYear1 = "&year1=" + (this.year1 ==='all'?0:this.year1);
        const finalYear2 = "&year2=" + (this.year2 === 'all'?9999:this.year2);

        const finalArea = "&areas=" + this.areas;
        const finalOffences = "&offences=" + this.offences;

        return finalGender + finalAge + finalYear1 + finalYear2 + finalArea + finalOffences;
    }

    /**
     * Start query with conditions
     */
    startQuery() {

        if (this.areas.length > 0 && this.offences.length > 0) {
            this.setState({
                warningMessage: ''
            });
            let condition = this.generateQueryCondition();         
            let getParam = { method: "GET" };
            let JWT = sessionStorage.getItem('token');
            let head = { Authorization: `${JWT}` }; // JWT is token from Login `Bearer ${JWT}`
            getParam.headers = head;
            const searchURL = address + 'advanceFilter?';//http://hackhouse.sh:3000/search?offence=
            const url = searchURL + condition;
            this.setState({
                finishLoading: false
            });
            fetch(encodeURI(url), getParam)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                else if (response.status === 400) {
                    this.setState({
                        errorMessage: "Bad Request",
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
                    if (result.result.length === 0) {
                        this.titles = ""
                        this.data = ""
                        this.setState({
                            warningMessage: 'No result has found',
                            display: false,
                            finishLoading: true
                        });
                    }
                    else {
                        const normal = ['Area', 'Gender', 'Age', 'Year'].concat(this.offences);
                        const titles = renderTableTitle(normal);

                        this.titles = titles;

                        let finalResult = [];
                        result.result.map((element) => {
                            finalResult.push(renderTableRows(element));
                        });
                        this.data = finalResult;
                        this.results = result.result;

                        this.setState({
                            resultData: result.result,
                            offencesTitles: this.offences,
                            display: true,
                            finishLoading: true
                        });
                    }                    
                }
            }) 
        }
        else {
            this.setState({
                warningMessage: 'Please Choose at least one area and one offence'
            });
        }        
    }

    /**
     * fetch center for fileter conditions
     * @param {*} url fetch url
     * @param {*} callback callback function
     */
    fetchCenter(url, callback) {
        fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                this.setState({
                    currentState: ERROR
                });
            } 
        })
        .then(result => {
            
            callback(result);
            this.lodingCounter += 1;
            if (this.lodingCounter >= 5) {
                this.lodingCounter = 0;
                this.setState({
                    currentState: NORMAL
                });
            }
        })
    }

    /**
     * fetch areas from server
     */
    fetchAreas() {
        this.fetchCenter("http://127.0.0.1:8888/filter/areas", (result) => {
            let newAreaOption = []
            result.result.map((element) => {
                let newItem = {value: element, label: element};
                newAreaOption.push(newItem);
            })
            this.setState({
                areaOption: newAreaOption
            });
        });
    }

    /**
     * fetch genders from server
     */
    fetchGender() {
        this.fetchCenter("http://127.0.0.1:8888/filter/genders", (result) => {
            let newGenderOption = [{value: 'all', label: 'all'}]
            result.result.map((element) => {
                let newItem = {value: element, label: element};
                newGenderOption.push(newItem);
            })
            this.setState({
                genderOption: newGenderOption
            });
        });        
    }

    /**
     * fetch ages from server
     */
    fetchAges() {
        this.fetchCenter("http://127.0.0.1:8888/filter/ages", (result) => {
            let newAgeOption = [{value: 'all', label: 'all'}]
            result.result.map((element) => {
                let newItem = {value: element, label: element};
                newAgeOption.push(newItem);
            })
            this.setState({
                ageOption: newAgeOption
            });
        });          
    }

    /**
     * fetch years from server
     */
    fetchYears() {
        this.fetchCenter("http://127.0.0.1:8888/filter/years", (result) => {
            let newYearOption = [{value: 'all', label: 'all'}]
            result.result.map((element) => {
                let newItem = {value: element, label: element};
                newYearOption.push(newItem);
            })
            this.setState({
                yearOption: newYearOption
            });
        });        
    }

    /**
     * fetch offences from server
     */
    fetchOffence() {
        this.fetchCenter("http://127.0.0.1:8888/offences", (result) => {
            let newOffencesOption = []
            result.offences.map((element) => {
                let newItem = {value: element, label: element};
                newOffencesOption.push(newItem);
            })
            this.setState({
                offenceOption: newOffencesOption
            });
        }); 
    }

    /**
     * fetch all conditions before the component finish mount
     */
    componentWillMount() {
        this.fetchAreas();
        this.fetchOffence();
        this.fetchGender();
        this.fetchAges();
        this.fetchYears();        
    }

    render() {
        if (this.state.currentState === NORMAL) {
            return(
                <main>
                    <div id="searchWrapper">
                        <div id="advanceSearch">
                            <p>Area</p>
                            <Select
                                id="ttt"
                                closeMenuOnSelect={false}
                                components={makeAnimated()}
                                isMulti
                                options={this.state.areaOption}
                                onChange={this.areaSelect}
                                />
        
                            <p>Offences</p>
                            <Select
                                id="ttt"
                                closeMenuOnSelect={false}
                                components={makeAnimated()}
                                isMulti
                                options={this.state.offenceOption}
                                onChange={this.offenceSelect}
                                />
        
                            <p>Gender</p>
                            <Select
                                className="select"
                                defaultValue={this.state.genderOption[0]}
                                options={this.state.genderOption}
                                onChange={this.genderSelect}
                                />
                            <p>Age</p>
                            <Select
                                className="select"
                                defaultValue={this.state.genderOption[0]}
                                options={this.state.ageOption}
                                onChange={this.ageSelect}
                                />
                            <p>Year</p>
                            <Select
                                className="select"
                                defaultValue={this.state.genderOption[0]}
                                options={this.state.yearOption}
                                onChange={this.startYearSelect}
                                />
                            <p>to</p>
                            <Select
                                className="select"
                                defaultValue={this.state.genderOption[0]}
                                options={this.state.yearOption}
                                onChange={this.endYearSelect}
                                />
                            <Button id="btnFilter" variant="outline-success" onClick={this.startQuery}>Filtering</Button>
                        </div>
                        
                    </div>
                    <div id="searchWrapper">
                        <div id="advanceSearch">
                            <h2>{this.state.warningMessage}</h2>
                        </div>
                    </div>
                    { this.state.finishLoading ? 
                    <div>
                        <div id="results">
                        <Table striped bordered hover size="sm">
                            <tbody>
                                {this.titles}        
                                {this.data}
                            </tbody>
                        </Table>
                    </div>
                    <AdvanceSearchResultGraph graphData={this.state.graphData} display={this.state.display} results={this.results} offences={this.offences}/>
                    </div> :  <div id="load">
                        <img src={loding} alt="loading"></img>
                    </div>}
                    
                </main>
                )
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

export default AdvanceSearch;