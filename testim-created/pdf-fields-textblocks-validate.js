/**
 *  Validate PDF Fields/Texts
 *
 *      Validates text blocks and fields using pdfDocumentTexts and pdfDocumentFields from "Download-Process-Validate PDF" step
 * 
 *  Parameters
 * 
 *      fieldsToValidate (JS) - JSON expected text/data used to validate data in a PDF file
 *                          Example:  [{"Family Name" : "Solomon" }, { "Gender_List_Box": "Man" }, { "Height_Formatted_Field": "150" }, { "Favourite_Colour_List_Box": "Red" } ]
 *                                    [{ "TextBlock": "PDF Form Example" } ]
 * 
 *  Returns
 * 
 *  Notes
 *  
 *      The sister step "Download-Process-Validate PDF" MUST be called prior to this step as it provides the actual PDF data to be validated against
 *
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      Custom Action
 * 
 *  Installation
 *      Create a new "Custom Action"
 *      Name it "Validate PDF Fields/Texts"
 *      Create parameters
 *          fieldsToValidate (JS) 
 *      Set the new custom action's function body to this javascript
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 *
**/

/* globals fieldsToValidate, pdfDocumentFields, pdfDocumentTexts */

let verbose = false;

function pdfFieldValidate(searchToken, expectedValues) {

    if (typeof expectedVaues !== 'undefined') console.log("PDF Field Validate (", searchToken, ", ", JSON.stringify(expectedValues), ")"); else console.log("PDF Field Validate (", searchToken, ", ", ", undefined)"); let deepResult = {}; let jsonCompare = function (x, y) { let status = true; if (x === y) { return true; } else if ((typeof x == "object" && x != null) && (typeof y == "object" && y != null)) { for (let prop in x) { if (y.hasOwnProperty(prop)) { let matched = jsonCompare(x[prop], y[prop]); deepResult[prop] = matched ? true : false + " [" + x[prop] + " !== " + y[prop] + "]"; if (!matched && status == true) status = false; } else { return false; } } return status; } else { return false; } }

    /*
     * Find target element
     *	Fields: {"style":48,"T":{"Name":"alpha","id":{"Id":"Given_Name_Text_Box","EN":0},"TI":0,"AM":0,"TU":"First name","x":10.356,"y":23.381,"w":9.375,"h":0.887}
     * 	Texts:  {"x":3.3,"y":27.163,"w":52.547,"sw":0.32553125,"clr":0,"A":"left","R":[{"T":"Address%201%3A","S":4,"TS":[0,14,0,0]}]}
     */

    if (typeof pdfDocumentTexts === 'undefined' || pdfDocumentTexts === null)
        throw new Error('pdfDocumentTexts is undefined.  "Download-Process-Validate PDF" must be called prior to this step');

    if (typeof pdfDocumentFields === 'undefined' || pdfDocumentFields === null)
        throw new Error('pdfDocumentFields is undefined.  "Download-Process-Validate PDF" must be called prior to this step');

    let targetFields = [].concat.apply([], pdfDocumentFields);
    let targetTexts = [].concat.apply([], pdfDocumentTexts);

    let foundFields = targetFields.filter((field) => {

        let found = false;

        found = (field.Id === searchToken);
        if (!found)
            found = (field.Label !== undefined && unescape(field.Label.Value) === unescape(searchToken));
        if (!found)
            found = (field.Label !== undefined && unescape(field.Label.Value).startsWith(unescape(searchToken)));

        return (found);

    });

    if (foundFields.length === 0) {

        foundFields = targetTexts.filter((field) => {

            let found = false;

            if (searchToken === "TextBlock") {
                found = (field.Value !== undefined && unescape(field.Value) === unescape(expectedValues));
                if (!found)
                    found = (field.Value !== undefined && unescape(field.Value).startsWith(unescape(expectedValues)));
            }
            else {
                found = (field.Value !== undefined && unescape(field.Value) === unescape(searchToken));
                if (!found)
                    found = (field.Value !== undefined && unescape(field.Value).startsWith(unescape(searchToken)));
            }

            return (found);

        });

    }

    /* if we found more than one field, see if there is a match and then trim to just the one field
     */
    if (foundFields?.length >= 2) {
        console.warn("Field [" + searchToken + "] matched " + foundFields.length + " fields");
        let _found_fields = foundFields.filter((field) => {
            return (field.Value === unescape(expectedValues));
        });
        if (_found_fields?.length >= 1)
            foundFields = _found_fields;
    }

    /*
     * If we did not find the target or found too many - error
     */
    if (foundFields?.length === 0) {
        if (searchToken === "TextBlock")
            throw new Error("TextBlock [" + unescape(expectedValues) + "] not found");
        else
            throw new Error("Field [" + searchToken + "] not found");
    }

    /*
     * Get actual value(s)
     */
    let actual_values = foundFields[0];

    /*
     * Copy actual value to console
     */
    let actual_str = JSON.stringify(actual_values).toString();
    if (verbose)
        console.log("actual_values", actual_str);

    /*
     * Validate results if expectedValues is defined
     */
    if (typeof expectedValues !== undefined && expectedValues !== null && expectedValues !== "") {

        let result;

        switch (typeof expectedValues) {
            case "object":
            default:
                result = jsonCompare(expectedValues, actual_values);
                if (result == false)
                    throw new Error("\nPDF Validation:\n" + "(" + searchToken + "): \nResults [" + JSON.stringify(deepResult, null, 2) + "], \nExpected [" + JSON.stringify(expectedValues, null, 2) + "], \nActual: [" + JSON.stringify(actual_values, null, 2) + "]");
                break;
            case "string":
                if (typeof actual_values !== undefined && actual_values.Value !== "") {
                    if (unescape(expectedValues).trim() !== unescape(actual_values.Value).trim()) {
                        throw new Error("\nPDF Validation:\n" + "(" + searchToken + "): \nExpected [" + unescape(expectedValues) + "], \nActual: [" + unescape(actual_values.Value) + "]");
                    }
                    break;
                }

        }

    }

}

if (typeof fieldsToValidate === 'undefined' || fieldsToValidate === null)
    throw new Error("fieldsToValidate is undefined");

/*
 * Normalize fields to validate
 *	[{ "Given_Name_Text_Box": "Barry" }, { "Given": "Barry" }, { "Family_Name_Text_Box": "Solomon"}]
 */
let fields_to_validate = [];
if (typeof fieldsToValidate !== 'object')
    fields_to_validate.push(fieldsToValidate);
else
    fields_to_validate = fieldsToValidate;

/*
 * Execute (Loops each field to validate)
 */
fields_to_validate.forEach(function (field_to_validate) {

    let field = Object.keys(field_to_validate)[0];
    let expected_values = field_to_validate[field];

    switch (field) {
        case 'Page':
            break;
        default:
            pdfFieldValidate(field, expected_values);
            break;
    }
});


