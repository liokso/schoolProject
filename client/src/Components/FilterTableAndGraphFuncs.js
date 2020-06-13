import React from 'react';
export function renderTableTitle(titles) {
    return (
        
        <tr key={Math.random()}>
            {titles.map((element) => {
                return <th key={Math.random()}>{element}</th>;
            })}
        </tr>
    );
}

export function renderTableRows(dataArray) {
    return (
        <tr key={Math.random()}>
            {dataArray.map((element) => {
                return <td key={Math.random()}>{element}</td>;
            })}
        </tr>
    );
}

export function areaBased(data) {
    let areaBasedData = {};
    data.map((element) => {
        const areaName = element[0];
        if (Object.keys(areaBasedData).includes(areaName)) {
            for (let i = 4; i < element.length; i++) {
                areaBasedData[areaName] += parseInt(element[i]);
            }
        }
        else {
            areaBasedData[areaName] = parseInt(element[4]);
            for (let i = 5; i < element.length; i++) {
                areaBasedData[areaName] += parseInt(element[i]);
            }
        }        
    }); 
    return areaBasedData;
}  

export function yearBased(data) {
    let yearBasedData = {};
    data.map((element) => {
        const areaName = element[3];
        if (Object.keys(yearBasedData).includes(areaName)) {
            for (let i = 4; i < element.length; i++) {
                yearBasedData[areaName] += parseInt(element[i]);
            }
        }
        else {
            yearBasedData[areaName] = parseInt(element[4]);
            for (let i = 5; i < element.length; i++) {
                yearBasedData[areaName] += parseInt(element[i]);
            }
        }        
    }); 
    
    return yearBasedData;
}

export function offenceBased(offencesLabels, data) {
    let offenceData = {};
    offencesLabels.map((element) => {
        offenceData[element] = 0;
    });
    data.map((element) => {
        for (let i = 4; i < element.length; i++) {
            offenceData[offencesLabels[i - 4]] += parseInt(element[i]);
        }        
    });
    
    return offenceData;
}