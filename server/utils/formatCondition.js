module.exports = function formatCondition(data) {
    let final = data.replace(/%20/g, '').replace(/ /g, '').replace(/\(/g, '').replace(/\)/g, '').replace(/-/g, '').replace(/&/g, '').replace(/\./g, '').replace(/\//g, '');
    return final;
}