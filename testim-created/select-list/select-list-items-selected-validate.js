/**
 *  Select List - Selected Items Validate
 *
 *      Validate the selected item(s) text, value, misc attribute(s) are correct
 * 
 *  Parameters
 *
 *      element (HTML) : Target element (or child of) either a <select>, <ol>, <ul>
 * 
 *      expectedValues (JS) : expected data example can be gotten by running this step with no expectedValues.  
 *                            The data will be in the clipboard and the variable actualValue (or returnVariableName if specified)
 *                  "First"
 *                  {"text" : "First"}
 *                  {"value" : "1"}
 *                  {"text" : "First", "value" : "1"}
 *                  [{"text" : "First"}, {"text" : "Second"}]
 * 
 *	    matchType [optional] : Text match type when searching for text in lists/selects
 *		    Examples: exact (default), startswith, endswith, includes
 *
 *      returnVariableName (JS) [optional] : string name of variable to store actual values in that can be used for setting expectedValues
 *
 *  Returns
 * 
 *      actualSelectedItems - unless returnVariableName is set whereby data will be in that variable name instead
 * 
 *  Notes
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      Custom Action

 *
**/

/* globals document, element, matchType, returnType, expectedValues, returnVariableName */

let verbose = true;

/* Validate the target element is defined
 */
if (typeof element === 'undefined' || element === null) {
    throw new Error("Target Select not found or not visible");
}

/* Process/normalize expected options
 */
function isJson(item) { item = typeof item !== "string" ? JSON.stringify(item) : item; try { item = JSON.parse(item); } catch (e) { return false; } if (typeof item === "object" && item !== null) { return true; } return false; }

var expected_values = null;
console.log("typeof expectedValues", typeof (expectedValues), "expectedValues", expectedValues);
if (typeof expectedValues !== 'undefined' && expectedValues !== null) {

    expected_values = [];

    if (typeof expectedValues === 'string')
        expected_values.push({ "text": expectedValues });

    if (typeof expectedValues === 'object') {

        if (isJson(expectedValues) && !Array.isArray(expectedValues)) {
            expected_values.push(expectedValues);
        }
        else {
            expectedValues.forEach((expected_value) => {
                if (typeof expected_value == 'string')
                    expected_values.push({ "text": expected_value });
                if (typeof expected_value == 'number')
                    expected_values.push({ "value": expected_value });
                if (typeof expected_value == 'object')
                    expected_values.push(expected_value);
            })
        }

    }

}
if (verbose)
    console.log("expectedValues", expectedValues, "==> expected_values", expected_values);

let match_type = 'exact';
if (typeof matchType !== 'undefined' && matchType !== null) {
    match_type = matchType.toLowerCase();
}

let return_type = 'STRING';
if (typeof returnType !== 'undefined' && returnType !== null) {
    return_type = returnType;
}

let return_variable_name = 'actualSelectedItems';
if (typeof returnVariableName !== 'undefined' && returnVariableName !== null)
    return_variable_name = returnVariableName;

const copyToClipboard = str => { const el = document.createElement('textarea'); el.value = str; el.setAttribute('readonly', ''); el.style.position = 'absolute'; el.style.left = '-9999px'; document.body.appendChild(el); const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false; el.select(); document.execCommand('copy'); document.body.removeChild(el); if (selected) { document.getSelection().removeAllRanges(); document.getSelection().addRange(selected); } };

/* Convenience functions used for matching
 */
const stringMatch = {};
stringMatch['exact'] = function (str1, str2) { return (str1 === str2); };
stringMatch['startswith'] = function (str1, str2) { return str1.startsWith(str2); };
stringMatch['endswith'] = function (str1, str2) { return str1.endsWith(str2); };
stringMatch['includes'] = function (str1, str2) { return str1.includes(str2); };
stringMatch['contains'] = function (str1, str2) { return str1.includes(str2); };

function selectListFind(startingElement) {

    let select_list = startingElement;
    let tagname = select_list.tagName.toLowerCase();

    /* First search down the DOM tree 
     */
    let select_tags = ["select"];
    if (!select_tags.includes(tagname)) {
        select_list = startingElement.getElementsByTagName('select')[0];
    }

    /* Search up the DOM tree
     */
    let stop_tags = ["select", "html"];
    if (!stop_tags.includes(tagname)) {
        select_list = startingElement;
        while (!stop_tags.includes(tagname)) {
            select_list = select_list.parentNode;
            tagname = (typeof select_list === 'undefined' || select_list == null) ? "" : select_list.tagName.toLowerCase();
        }
    }

    return select_list;
}

function getSelectedOptions(select) {

    var options = [];
    var selected_options = [];
    var selected_options_matched = [];

    switch (element_type) {
        case "select":
        default:
            for (var i = 0, iLen = select.options.length; i < iLen; i++) {
                let option = select.options[i];
                options.push({ "text": option.text, "value": option.value, "index": i });
                if (option.selected) {
                    selected_options.push({ "text": option.text, "value": option.value, "index": i });
                    if (expected_values?.length > 0
                        && expected_values.some((expected_value) => {
                            return stringMatch[match_type](option?.text, expected_value?.text)
                            || stringMatch[match_type](option?.value, expected_value?.value)
                        })
                    ) {
                        selected_options_matched.push({ "text": option.text, "value": option.value, "index": i });
                    }
                }
            }
            break;
    }

    return { options, selected_options, selected_options_matched };
}

/* Find target select element
*/
if (verbose)
    console.log("Starting element tagName", element.tagName);
var select_list = selectListFind(element);
var element_type = select_list?.tagName?.toLowerCase();

/* Validate that we sound a <select> element from the staritng element
 */
if (!["select"].includes(element_type)) {
    throw new Error(`Target element must be an HTML select.  Found ${select_list?.tagName}`);
}

/* Get selected options
 */
let actualSelectedItems = getSelectedOptions(select_list);
copyToClipboard(JSON.stringify(actualSelectedItems, null, 1));
exportsTest[return_variable_name] = actualSelectedItems;
if (verbose)
    console.log("Starting element tagName", element.tagName);

return;

if (verbose) {
    console.log("actualSelectedItems", JSON.stringify(actualSelectedItems));
    console.log("expectedValues", JSON.stringify(expectedValues));
}

// Validate
//
function validateItems(actualValues, expectedValues, matchType) {

    let result = true;
    let expected_values;
    let actual_values;
    let row_differences;
    let differences = [];

    for (let evid = 0; evid < expectedValues.length; evid++) {

        expected_values = expectedValues[evid];

        let row_id = Object.keys(expected_values).includes("index") ? expected_values["index"] : evid;
        actual_values = (actualValues[row_id] !== null) ? actualValues[row_id] : "";

        row_differences = {};

        if (typeof expected_values === 'string' && typeof actual_values === 'string') {
            if (!stringMatch[matchType](actual_values, expected_values)) {
                row_differences[evid] = { "row": evid, "Actual": actual_values, "Expected": expected_values };
                if (result)
                    result = false;
            }
        }
        else {

            for (let key in expected_values) {

                if (key === 'index')
                    continue;

                if (verbose)
                    console.log("Validate " + key + "Expected: [" + expected_values[key] + "], Actual:[" + actual_values[key] + "]");

                if (Object.keys(actual_values).includes(key)) {

                    if (!stringMatch[matchType](actual_values[key], expected_values[key])) {
                        row_differences[key] = { "row": row_id, "Actual": actual_values[key], "Expected": expected_values[key] };
                        if (result)
                            result = false;
                        if (verbose)
                            console.log("    MISMATCH:: " + key + " => \nExpected: [" + expected_values[key] + "], \nActual: [" + actual_values[key] + "]");
                    }
                }
            }
        }
        if (Object.keys(row_differences).length > 0)
            differences.push(row_differences);
    }

    // If failed, echo to console and report an error
    //
    if (!result) {
        if (verbose) {
            console.log("expected_values", JSON.stringify(expectedValues));
            console.log("actual_values", JSON.stringify(actual_values));
        }
        console.log("Validate Select/List Options/Items: ", JSON.stringify(differences, null, 2));
        throw new Error("Validate Select/List Options/Items\n" + JSON.stringify(differences, null, 2));
    }

    return result;
}

if (typeof expectedValues !== 'undefined' && expectedValues !== null) {

    validateItems(actualValues, expectedValues, match_type);

}