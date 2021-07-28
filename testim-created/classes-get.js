/**
 *  Classes Get
 *
 *      Get an element's class list as a string array
 *
 *  Parameters
 *      element (HTML)          : Target Element
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
 *  Note
 *      The data will be in the clipboard as well as the variable actualClasses (or returnVariableName if specified)
 *
 *  Installation:
 *      Create a new shared custom action
 *      Name it "Classes Get"
 *      Create parameters
 *          element (HTML)
 *          returnVariableName (JS) [optional]
 *      Set the new custom action's function body to this javascript
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 *
**/

/* globals document, element, returnVariableName */

const copyToClipboard = str => { const el = document.createElement('textarea'); el.value = str; el.setAttribute('readonly', ''); el.style.position = 'absolute'; el.style.left = '-9999px'; document.body.appendChild(el); const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false; el.select(); document.execCommand('copy'); document.body.removeChild(el); if (selected) { document.getSelection().removeAllRanges(); document.getSelection().addRange(selected); } };

/* Validate the target element is defined
 */
if (typeof element === 'undefined' || element === null) {
    throw new Error("HTML parameter element not found or not set");
}

let return_variable_name = 'actualClasses';
if (typeof returnVariableName !== 'undefined' && returnVariableName !== null)
  return_variable_name = returnVariableName;

let actual_classes = Object.values(element.classList);
copyToClipboard(JSON.stringify(actual_classes, null, 1));
exportsTest[return_variable_name] = actual_classes;

