/**
 *  Watchlist Popup
 *
 *      Displays Testim and User defined variables in a modal popup window
 * 
 *  Parameters:
 *
 *      timeout (JS) [optional] : Time to display popup
 *                    If unset then popup will not go away by itself and test will continue
 *                    If set then popup (and step) will block until timeout has expired.
 *     
 *  Note
 * 
 *      You can add a subsequent step that dismisses the popup to capture a screenshot
 * 
 *  Base Step
 * 
 *      Custom Action
 * 
 *  Installation
 *      Create a new "Custom Action"
 *      Name it "Watchlist Popup"
 *      Create parameters
 *          timeout (JS)
 *      Set the new custom action's function body to this javascript
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 *
**/

/* globals timeout, arguments */

function testimVariablesGet(arguments) {

    /* JavaScript program to get the function name/values dynamically 
     */
    function getParams(func) {

        // String representaation of the function code 
        var str = func.toString();

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
        var start = str.indexOf("(") + 1;

        // End parameter names is just before last ')' 
        var end = str.length - 1;

        var result = str.substring(start, end).split(", ");

        var params = [];

        result.forEach(element => {

            // Removing any default value 
            element = element.replace(/=[\s\S]*/g, '').trim();

            if (element.length > 0)
                params.push(element);

        });

        return params;

    }

    var _test_variables = {}

    var arg_names = getParams(arguments.callee)[0].split(',');
    for (let a = 0; a < arguments.length; a++) {
        switch (arg_names[a]) {
            case "context":
            case "exports":
            case "exportsGlobal":
            case "exportsTest":
            case "test_variables":
            case "test_variables_log":
                break;
            case "BASE_URL":
            default:
                _test_variables[arg_names[a]] = arguments[a];
                break;
        }
    }

    var keys = Object.keys(sessionStorage);
    for (let key of keys) {

        let session_storage = JSON.parse(sessionStorage[key]);
        let session_result = session_storage.result;
        if (typeof session_result !== 'undefined' && session_result !== null) {

            let exportsTestKeys = Object.keys(session_result.exportsTest);
            if (exportsTestKeys.length > 0) {

                for (let key of exportsTestKeys) {
                    try {
                        switch (key) {
                            case 'test_variables':
                                break;
                            default:
                                _test_variables[key] = eval(key);
                                break;
                        }
                    }
                    catch { }
                }
            }
        }
    }

    exportsTest.testVariablesDefined = Object.keys(_test_variables);
    exportsTest.testVariablesWithValues = _test_variables;

    console.log("Test Variables Defined => ", JSON.stringify(exportsTest.testVariablesDefined, null, 2));
    console.log("Test Variables With Values => ", JSON.stringify(exportsTest.testVariablesWithValues, null, 2));

    return _test_variables;

}
let message = testimVariablesGet(arguments);
console.log("message => ", JSON.stringify(message, null, 2));

function popupDivDisplay(message) {

    let script_jquery = document.createElement('script');
    script_jquery.type = 'text/javascript';
    script_jquery.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js";
    document.getElementsByTagName('head')[0].appendChild(script_jquery);

    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = 'td {overflow-y: scroll;max-width: 700px; word-wrap: break-word;} /* Popup box BEGIN */ .hover_bkgr_fricc{ background:rgba(0,0,0,.4); cursor:pointer; display:none; height:100%; position:fixed; text-align:center; top:-5px; width:100%; z-index:10000;}.hover_bkgr_fricc .helper{ display:inline-block; height:100%; vertical-align:middle;}.hover_bkgr_fricc > div {    background-color: #fff;    box-shadow: 10px 10px 60px #555; display: inline-block; height: auto; max-width: 1000px; min-height: 100px; vertical-align: middle; width: 60%; position: relative; border-radius: 8px; padding: 15px 5%;} .popupCloseButton {    background-color: #fff;    border: 3px solid #999;    border-radius: 50px;    cursor: pointer;    display: inline-block;    font-family: arial;    font-weight: bold;    position: absolute;    top: -20px;    right: -20px;    font-size: 25px;    line-height: 30px;    width: 30px;    height: 30px;    text-align: center;} .popupCloseButton:hover {    background-color: #ccc;} .trigger_popup_fricc {    cursor: pointer;    font-size: 20px;    margin: 20px;    display: inline-block;    font-weight: bold;}/* Popup box BEGIN */';
    document.getElementsByTagName('head')[0].appendChild(style);

    let popup_html = '<span class="helper"></span><div style="width: 800px;">'
        + '<div class="popupCloseButton" onclick="$(\'.hover_bkgr_fricc\').hide();">&times;</div>'
        + '<div style="width: 100%; height: 100%; border:0px solid black; padding: 2px; text-align: left;">'
        + '<table>'
        + '<tr>'
        + '<td >'
        + (typeof message === 'object' ? JSON.stringify(message) : message)
        + '</td>'
        + '</tr>'
        + '</table>'
        + '</div>';
    + '</div></div>';

    let div = document.getElementById("debugDialog");
    if (div === null) {
        div = document.createElement('div');
        div.id = "debugDialog";
        div.className = "hover_bkgr_fricc";
        document.body.appendChild(div);
    }
    div.innerHTML = popup_html;

    let script = document.createElement("script");
    script.type = "text/javascript";
    script.innerHTML = 'setTimeout(function() { $(".hover_bkgr_fricc").show(); }, 500);';
    document.body.appendChild(script);

    if (typeof timeout !== 'undefined' && timeout > 0) {

        // var script = document.createElement("script");
        // script.type = "text/javascript";
        // script.innerHTML = 'setTimeout(function() { $(".hover_bkgr_fricc").hide(); }, ' + timeout + ');';
        // document.body.appendChild(script);

        return new Promise((resolve, reject) => {
            setTimeout(function () { $(".hover_bkgr_fricc").hide(); resolve(); }, timeout);
        });

    }
}
popupDivDisplay(message);

