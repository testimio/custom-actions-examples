/**
 *  Classes Validate
 *
 *      Check if an element's class list contains expected classes
 *
 *  Parameters
 *      element (HTML)          : Target Element
 *      expectedClasses (JS)    : Single class or array of classes to be validated
 *      returnVariableName (JS) [optional] : string name of variable to store actual values in 
 *
 *  Returns
 *      actualClasses (or returnVariableName if specified) will contain actual classes
 * 
 *  Base Testim Step
 *      Custom Action
 *
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 *
 *  Installation:
 *      Create a new shared custom action
 *      Name it "Classes Validate"
 *      Create parameters
 *          element (HTML)
 *          expectedClasses (JS)
 *          returnVariableName (JS) [optional]
 *      Set the new custom action's function body to this javascript
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 *
**/

/* globals document, element, expectedClasses, returnVariableName */

/* Validate the target element is defined
 */
if (typeof element === 'undefined' || element === null) {
  throw new Error("HTML parameter element not found or not set");
}

let return_variable_name = 'actualClasses';
if (typeof returnVariableName !== 'undefined' && returnVariableName !== null)
return_variable_name = returnVariableName;

const copyToClipboard = str => { const el = document.createElement('textarea'); el.value = str; el.setAttribute('readonly', ''); el.style.position = 'absolute'; el.style.left = '-9999px'; document.body.appendChild(el); const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false; el.select(); document.execCommand('copy'); document.body.removeChild(el); if (selected) { document.getSelection().removeAllRanges(); document.getSelection().addRange(selected); } };

let actual_classes = Object.values(element.classList);
copyToClipboard(JSON.stringify(actual_classes, null, 1));
exportsTest[return_variable_name] = actual_classes;

// Validate
//
function validateClasses(actualClasses, expectedClasses) {

let result = true;
let expected_value;
let differences = [];

for (let row_id = 0; row_id < expectedClasses.length; row_id++) {
  expected_value = expectedClasses[row_id];
  if (!actualClasses.includes(expected_value)) {
    differences.push(expected_value);
    result = false;
  }
}

// If failed, echo to console and report an error
//
if (!result) {
  console.log("Expected Classes Not Found: " + JSON.stringify(differences, null, 2) + "Actual Classes: " + JSON.stringify(actualClasses, null, 2));
  throw new Error("\nExpected Classes Not Found\n" + JSON.stringify(differences, null, 2) + "\nActual Classes: \n" + JSON.stringify(actualClasses, null, 2));
}

return result;
}

if (typeof expectedClasses !== 'undefined' && expectedClasses !== null) {

let expected_values = expectedClasses;
if (!Array.isArray(expected_values)) {
  expected_values = [expectedClasses];
}

validateClasses(actual_classes, expected_values);

}
