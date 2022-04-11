/**
 *  Excel - Import File
 * 
 *      Read Excel file for use as test data
 * 
 *  Parameters
 * 
 *      fileName (JS) : Full path to Excel file.  
 *      xlsx (NPM)    : xlsx @ latest
 * 
 *  Returns
 * 
 *      excelData and First row of data in the first spreadsheet using column names from first row
 * 
 *  Notes
 *  
 *  Base Step
 *      Custom Validation 
 * 
 *  Install
 *      Create custom validation shared step named "Excel - Import File"
 *      Add parameters as outlined above (fileName, xlsl)
 *      Bob's your uncle
 * 
 */

/* eslint-disable no-var */
/* globals xlsx, fileName */

function loadModule(moduleName) {
    eval(moduleName + ' = (typeof ' + moduleName + ' !== "undefined" && ' + moduleName + ' !== null) ? ' + moduleName + ' : require("' + moduleName + '");');
}
loadModule("xlsx");

function parseJSONToVariables(json) {

    // Convert json parameter to JSON object if needed
    //
    json = typeof json === "string"
        ? JSON.stringify(json)
        : json;

    /**
        Get all keys for the root level nodes
    **/
    var keys = Object.keys(json);
    console.log("JSON root level keynames = " + keys.toString());

    /**
        Convert level 1 nodes to Testim variables
    **/
    function saveToExport(value) {
        exportsTest[value] = json[value];
    }
    keys.forEach(saveToExport);

    /**
        Write all variables created to console
    **/

    console.log("Show Variables from JSON parsing");
    function listAllVariables(value) {
        console.log('  exportsTest.' + value + ' = ' + exportsTest[value]);
    }
    keys.forEach(listAllVariables);
}

const { SheetNames, Sheets } = xlsx.readFile(fileName);
if (SheetNames.length === 0) {
    throw new Error('No sheets found.');
}

let excelData = []
SheetNames.forEach((sheetName) => {

    let sheet_data = xlsx.utils.make_json(Sheets[sheetName]);
    // console.log("sheetName  ", sheetName, "sheet_data", sheet_data);

    let column_names = sheet_data[0];
    let _sheet_data = sheet_data.slice(1);

    // console.log('\n\n==================' + sheetName + '==================');
    // console.log("column_names", JSON.stringify(column_names));
    // console.log('----------------------------------------------');
    // console.log("_sheet_data", JSON.stringify(_sheet_data));
    // console.log('----------------------------------------------');

    let _sheet_data_text = JSON.stringify(_sheet_data)

    let column_name_keys = Object.keys(column_names);
    column_name_keys.forEach((column_name_key) => {

        // console.log("column_name_key",   JSON.stringify(column_name_key));
        // console.log("column_name_value", JSON.stringify(column_names[column_name_key]));

        if (column_name_key.startsWith("__EMPTY") && column_names[column_name_key] !== "") {
            //console.log("Replace", column_name_key, " with ", column_names[column_name_key]);
            _sheet_data_text = _sheet_data_text.replaceAll(column_name_key, column_names[column_name_key]);
        }

    })

    console.log('\n----------------------------------------------');
    console.log("_sheet_data_text", _sheet_data_text);

    excelData.push(sheet_data);

    console.log('\n====================================================\n');

})

exportsTest.excelData = excelData;
console.log(JSON.stringify(excelData));

parseJSONToVariables(excelData[0][0]);

