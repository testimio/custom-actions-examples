 /**
 *  AfterStep - Extended
 * 
 *      Collect enhanced step information for AfterTest reporting
 *
 *  Parameters
 *
 *  Notes
 * 
 *      Use this with "AfterTest" hooks if you wish to include detailed step information with reported results
 * 
 *  Base Step
 *      Custom Action
 * 
 *  Installation
 *      Create a new "Custom Action"
 *      Name it "AfterStep - Extended"
 *      Set the new custom action's function body to this javascript
 *      Exit the step editor
 *      Share the step if not already done so
 *      Assign this step as an "After Step" hook in the configuration
 *      Save the test
 *      Bob's your uncle
 *
 **/

/* eslint-disable camelcase */
/* globals sessionStorage, _steps, window, _stepData, _stepInternalData, arguments */

//console.log("TEST LEVEL - AfterStep");

function tryParseJSONObject (jsonString)
{
    try {
        let o = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns null, and typeof null === "object", 
        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
        if (o && typeof o === "object") {
            return o;
        }
    }
    catch (e) { 
        console.log(e);
    }

    return null;
}

// eslint-disable-next-line no-shadow-restricted-names
function testimVariablesGet(arguments) {

    /* JavaScript program to get the function name/values dynamically 
     */
    function getParams(func) {

        // String representaation of the function code 
        let str = func.toString();

        // Remove comments of the form /* ... */ 
        // Removing comments of the form // 
        // Remove body of the function { ... } 
        // removing '=>' if func is arrow function  
        str = str.replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\/\/(.)*/g, '')
            .replace(/{[\s\S]*}/, '')
            .replace(/=>/g, '')
            .trim();

        // Start parameter names after first '(' 
        let start = str.indexOf("(") + 1;

        // End parameter names is just before last ')' 
        let end = str.length - 1;

        let result = str.substring(start, end).split(", ");

        let params = [];

        result.forEach(element => {

            // Removing any default value 
            element = element.replace(/=[\s\S]*/g, '').trim();

            if (element.length > 0)
                params.push(element);

        });

        return params;

    }

    let _test_variables = {}

    let arg_names = getParams(arguments.callee)[0].split(',');
    for (let a = 0; a < arguments.length; a++) {
        switch (arg_names[a]) {
            case "context":
            case "exports":
            case "exportsGlobal":
            case "exportsTest":
            case "test_variables":
            case "test_variables_log":
            case "_test_data":
            case "_stepData":
            case "_stepInternalData":
            case "_steps":
            case "testVariablesDefined":
            case "testVariablesWithValues":
            case "transactions":
            case "BASE_URL":
                break;
            default:
                _test_variables[arg_names[a]] = arguments[a];
                break;
        }
    }

    let keys = Object.keys(sessionStorage);
    for (let key of keys) {

        let session_storage = tryParseJSONObject(sessionStorage[key]);
        let session_result = session_storage.result;
        if (typeof session_result !== 'undefined' && session_result !== null) {

            let exportsTestKeys = Object.keys(session_result.exportsTest);
            if (exportsTestKeys.length > 0) {

                for (let key of exportsTestKeys) {
                    try {
                        switch (key) {
                            case 'test_variables':
                            case "_test_data":
                            case "_stepData":
                            case "_stepInternalData":
                            case "_steps":
                            case "testVariablesDefined":
                            case "testVariablesWithValues":
                            case "transactions":
                                break;
                            default:
                                _test_variables[key] = eval(key);
                                break;
                        }
                    }
                    catch (error) { 
                        console.log(error);
                    }
                }
            }
        }
    }

    return _test_variables;

}

/* Marshal this step's data and add to the _steps array
 * _steps will contain all step information for use in communicating results after the test is complete
 */
exportsTest._steps = [];
if (typeof _steps !== 'undefined' && _steps !== null) {
    exportsTest._steps = [..._steps];
}

let step = Object.assign(_stepData, _stepInternalData);
step['stepNumber'] = exportsTest._steps.length + 1;
step['endTime'] = Date.now();
step['status'] = (typeof _stepInternalData.failureReason === 'undefined') ? "PASSED" : "FAILED"

step['hostname'] = window?.location.hostname;
step['page'] = window?.location.href;
step['pathname'] = window?.location.pathname;
step['protocol'] = window?.location.protocol;

let testdata = testimVariablesGet(arguments);
exportsTest._test_data = testdata;
step['testdata'] = testdata;

exportsTest._steps.push(step);

