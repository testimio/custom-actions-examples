/** 
 *  Numeric Expression - Validate
 *
 *    Validate a value using numeric expressions ">", ">=", "==", "<", "<="
 * 
 *  Parameters
 *      element (HTML):      element with the value to be checked
 *      expression (JS):     numeric comparison as a string.  ex:  ">", ">=", "==", "<", "<="
 *      expectedValue (JS):  expected value to be compared
 *
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      Custom Validation
 * 
 *  Installation
 *      Create a new "Custom Validation"
 *      Name it "Numeric Expression - Validate"
 *      Create parameters
 *          element (HTML)
 *          expression (JS) 
 *          expectedValue (JS) 
 *      Set the new custom action's function body to this javascript
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle 
 * 
 **/

/* globals element, expression, expectedValue */

if (typeof expression === 'undefined' || expression === null)
  throw new Error("expression is undefined");
if (typeof expectedValue === 'undefined' || expectedValue === null)
  throw new Error("expectedValue is undefined");

if (expression == "=")
    expression = "==";
    
var actualValue = Number(element.innerText.replace(/[^\d.-]/g, ''));
try {
  console.log("Validating: " + actualValue + expression.toString() + expectedValue);
  var result = eval("(" + actualValue + expression.toString() + expectedValue + ")");
  if (result === true)
    return true;
  else
    throw new Error("Validate (" + actualValue + expression.toString() + expectedValue + ") failed");
}
catch (error) {
  throw new Error(error.message);
}

