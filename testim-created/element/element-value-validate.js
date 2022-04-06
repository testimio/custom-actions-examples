/** 
 *  Element Value Validate
 * 
 *      Validate an element's value/text using numeric, statistical or text comparison expressions 
 * 
 *  Parameters
 *      element (HTML):             element with the value to be checked
 *      expression (JS):            expression comparison as a string.  Default: "exact" match
 *          ex:  Numeric:           ">", ">=", "==", "<", "<=", "!="
 *               Statistical:       "sum", "min", "max", "sd", "stdev"
 *               String             "exact", "startswith", "endswith", "includes", "contains"
 *               String             "notexact", "notstartswith", "notendswith", "notincludes", "notcontains"
 *      expectedValue (JS):         expected value to be compared
 *      delimiter (JS) [optional]:  delimiter used to parse a number string of multiple numbers (Default: ,)
 *
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Notes
 *      "sum", "min", "max", "sd", "stdev" only make sense when the target text/value contains a delimited string of numbers
 *      
 *  Base Step
 *      Custom Validation
 * 
 *  Installation
 *      Create a new "Custom Validation"
 *      Name it "Validate Numeric"
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

/* eslint-disable no-var */
/* eslint-disable camelcase */
/* eslint-disable no-global-assign */
/* globals document, element, expression, delimiter, expectedValue */

var number_delimiter = ',';
if (typeof delimiter !== 'undefined' && delimiter !== null)
    number_delimiter = delimiter;

var sdPrecision = 4;

if (typeof expression === 'undefined' || expression === null) {
    switch (typeof (expectedValue)) {
        case 'string':
            expression = 'exact';
            break;
        case 'number':
        default:
            expression = '===';
            break;
    }
}
if (expression == "=")
    expression = "==";
console.log(`expression: ${expression}, expectedValue: ${expectedValue}`);

/* Convenience functions used for matching
 */
const stringMatch = {};
stringMatch['exact'] = function (str1, str2) { return (str1 === str2); };
stringMatch['startswith'] = function (str1, str2) { return str1.startsWith(str2); };
stringMatch['endswith'] = function (str1, str2) { return str1.endsWith(str2); };
stringMatch['includes'] = function (str1, str2) { return str1.includes(str2); };
stringMatch['contains'] = function (str1, str2) { return str1.includes(str2); };

const copyToClipboard = str => { const el = document.createElement('textarea'); el.value = str; el.setAttribute('readonly', ''); el.style.position = 'absolute'; el.style.left = '-9999px'; document.body.appendChild(el); const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false; el.select(); document.execCommand('copy'); document.body.removeChild(el); if (selected) { document.getSelection().removeAllRanges(); document.getSelection().addRange(selected); } };

function getStandardDeviation(array) {
    let n = array.length;
    if (!array || array.length === 0) {return 0;}
    let mean = array.reduce((a, b) => Number(a) + Number(b)) / n;
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => Number(a) + Number(b)) / n);
}

var result = false;
var actualValue;

if (['exact', 'startswith', 'endswith', 'includes', 'contains', 'notexact', 'notstartswith', 'notendswith', 'notincludes', 'notcontains'].includes(expression)) {

    actualValue = element.innerText;
    if (actualValue == null || actualValue == "")
        actualValue = element?.value;
    copyToClipboard(actualValue);

    if (typeof expectedValue !== 'undefined' && expectedValue === null) {
        if (expression.startsWith("not")) {
            result = !stringMatch[expression.replace("not", "")](actualValue, expectedValue);
        }
        else {
            result = stringMatch[expression](actualValue, expectedValue);
        }
        console.log(`Validating (stringMatch) ${actualValue}  ${expression}  ${expectedValue} is ${result}`);
    }

}
else {

    actualValue = (["sum", "min", "max", "sd", "stdev"].includes(expression)) ? element.innerText : Number(element.innerText.replace(/[^\d.-]/g, ''));
    if (actualValue == null || actualValue == "")
        actualValue = element?.value;

    if (["sum", "min", "max", "sd", "stdev"].includes(expression)) {
        var numbers = actualValue.split(number_delimiter);
        switch (expression) {
            case "sd":
            case "stdev":
                actualValue = getStandardDeviation(numbers);
                break;
            case "min":
                actualValue = Math.min(...numbers);
                break;
            case "max":
                actualValue = Math.max(...numbers);
                break;
            case "sum":
            default:
                actualValue = numbers.reduce(function (previousValue, currentValue) { return Number(previousValue + Number(currentValue.replace(/[^\d.-]/g, ''))); }, 0);
                break;
        }
        expression = "==";
    }
    copyToClipboard(actualValue);

    if (typeof expectedValue !== 'undefined' && expectedValue !== null) {

        actualValue = actualValue.toFixed(sdPrecision);
        expectedValue = expectedValue.toFixed(sdPrecision);

        try {
            result = eval("(" + actualValue + " " + expression.toString() + " " + expectedValue + ")");
            console.log(`Validating (Expression) ${actualValue}  ${expression.toString()} ${expectedValue} is ${result}`);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

}

console.log("Validation (" + actualValue + " " + expression.toString() + " " + expectedValue + ") result: ", result);
if ((typeof expectedValue !== 'undefined' && expectedValue !== null) && result == false)
    throw new Error("Validation (" + actualValue + " " + expression.toString() + " " + expectedValue + ") failed");
