/**
 *  Excel365 - Grid Cell Mapping Get
 * 
 *      Create a lookup table (excelGridMapping) for cell coordinates of an Excel365 grid/table for use in selecting cells
 * 
 *  Parameters
 * 
 *      element (HTML) : Target Excel265 Grid/Table
 * 
 *      returnVariableName [optional] (JS) : string name of variable to store the mapping
 *      
 *  Returns
 * 
 *      excelGridMapping (or returnVariableName if specified) will contain mappings of cell names to cell centerpoints 
 * 
 *  Base Step
 *      Custom Action
 * 
 *  Notes
 *       
 *       To use with standard Testim mouse click/doubleclick, you will need to have support enable: enableOverrideMouseOffset
 *       Set click on cell F7, set the click step property "Override offset parameter" to excelGridMapping["F7"].CenterPoint
 * 
 *  Version       Date          Author          Details
 *      1.0.0     10/19/2022    Barry Solomon   Initial Version
 *  
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 **/

/* eslint-disable no-var */
/* eslint-disable camelcase */
/* globals element, returnVariableName */

var verbose = true;
var maxColumns = 10;
var maxRows = 20;

if (typeof element === 'undefined' || element === null) {
    throw new Error("Target element is undefined.  Please set element parameter and try again");
}
var excel_grid = element.closest(".ewa-contentarea");
if (excel_grid === null && element.firstElementChild !== null)
    excel_grid = element.firstElementChild.closest(".ewa-contentarea");

let return_variable_name = 'excelGridMapping';
if (typeof returnVariableName !== 'undefined' && returnVariableName !== null)
    return_variable_name = returnVariableName;

/* GET COLUMN HEADERS
 */
// Columns: A, B, C, ...
var excel_column_headers = Array.prototype.slice.call(excel_grid.querySelectorAll(".ewrch-col-nosel"), 0, maxColumns);
if (verbose) {
    console.log("excel_column_headers", excel_column_headers);
}

var excel_column_mapping = [];
excel_column_headers.forEach((excel_column_header) => {

    let element_coords = excel_column_header.getBoundingClientRect();
    excel_column_mapping.push({
        "ColumnName": excel_column_header.innerText,
        "CenterPoint": {
            "x": element_coords.left + element_coords.width / 2,
            "y": element_coords.offsetTop + element_coords.height / 2,
        },
        "Height": element_coords.height,
        "Width": element_coords.width,
    });

})
console.log("excel_column_mapping", excel_column_mapping);
exportsTest.excel_column_mapping = excel_column_mapping;

/* GET ROW HEADERS
 */
// Rows: 1, 2, 3, ...
var excel_row_headers = Array.prototype.slice.call(excel_grid.querySelectorAll(".ewrch-row-nosel"), 0, maxRows);
console.log("excel_row_headers", excel_row_headers);

var excel_row_mapping = [];
excel_row_headers.forEach((excel_row_header) => {

    let element_coords = excel_row_header.getBoundingClientRect();
    excel_row_mapping.push({
        "RowNumber": excel_row_header.innerText,
        "CenterPoint": {
            "x": element_coords.offsetLeft + element_coords.width / 2,
            "y": excel_row_header.offsetTop + element_coords.height / 2,
        },
        "Height": element_coords.height,
        "Width": element_coords.width,
    });

})
console.log("excel_row_mapping", excel_row_mapping);
exportsTest.excel_row_mapping = excel_row_mapping;

/* Create cell centerpoint lookup array
*/
var excel_grid_mapping = {};
excel_row_mapping.forEach((excel_row) => {

    excel_column_mapping.forEach((excel_column) => {

        let key = excel_column.ColumnName + excel_row.RowNumber;
        excel_grid_mapping[key] =
        {
            "CellName": excel_column.ColumnName + excel_row.RowNumber,
            "CenterPoint": {
                "x": excel_column.CenterPoint.x,
                "y": excel_row.CenterPoint.y,
            },
            "Width": excel_column.Width,
            "Height": excel_row.Height,
        };

    })

})

/* Return coordinate array for use by main tests 
 */ 
exportsTest[return_variable_name] = excel_grid_mapping;
console.log(return_variable_name, excel_grid_mapping);
