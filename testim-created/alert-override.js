/**
 *  Alert Override
 *
 *      Overrides the window.alert function to display an alert as a popup div to enable validation of javascript alert
 * 
 *  Parameters:
 *
 *      timeout (JS) [optional] : Time to display popup
 *                    If unset then popup will not go away by itself and test will continue
 *                    If set then popup (and step) will block until timeout has expired.
 * 
 *      intervalTimeout (JS) [optional] : Time to trigger readding the window.alert override
 *                    If unset then the interval is set to 2000 ms.
 *     
 *  Notes
 * 
 *      You can add a subsequent step that dismisses the popup to capture a screenshot of the alert
 *      and/or validate the alert text
 * 
 *      Note that Testim playback is insistent on overriding the window.alert function (which it totally understandable), 
 *      so this uses a setInterval() to keep adding it back every X milliseconds
 *      
 *      For each page that loads, this function will need to be run.  
 *      
 *      This step can also be added to the BeforeStep hook to re-add it all the time (like whack-a-mole)
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
  * 
 *  Base Step
 *      Custom Action
 * 
 *  Installation
 *      Create a new "Custom Action"
 *      Name it "Alert Override"
 *      Create parameters
 *          timeout (JS)
 *      Set the new custom action's function body to this javascript
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 *
**/

/* globals timeout */

(function (proxied) {
    window.alert = function () {
        console.log(arguments)
        return proxied.apply(this, arguments);
    };
})(window.alert);

// function over riding. Redirecting to Console with Firebug installed.
function alert(message) {
    console.info(message);
}

window.alert = function (actualAlert) {

    console.log(`Alert() called with message: ${actualAlert}`);

    let alert_html = '<span class="alertDivHelper"></span><div onclick="$(\'.alert_override_popup\').hide();" style="width: 400px; vertical-align: middle; ">'
        + '<div style="width: 100%; height: 100%; border:0px solid black; padding: 2px; text-align: center; ">'
        + '<table>'
        + '<tr>'
        + '<td>'
        + (typeof actualAlert === 'object' ? JSON.stringify(actualAlert) : actualAlert)
        + '</td>'
        + '</tr>'
        + '</table>'
        + `<br/><input type="button" onclick="$('.alert_override_popup').hide();" value="ok" />`
        + '</div>';
    + '</div></div>';

    let div = document.getElementById("alert_override_popup");
    if (div === null) {
        let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '/* Popup box BEGIN */ .alert_override_popup{ background:rgba(0,0,0,.4); cursor:pointer; display:visible; height:100%; position:fixed; text-align:center; top:-5px; width:100%; z-index:10000;}.alert_override_popup .alertDivHelper{ display:inline-block; height:100%; vertical-align:middle;}.alert_override_popup > div {    background-color: #fff;    box-shadow: 10px 10px 60px #555; display: inline-block; height: auto; max-width: 600px; min-height: 100px; vertical-align: middle; width: 60%; position: relative; border-radius: 8px; padding: 15px 5%;} .popupCloseButton {    background-color: #fff;    border: 3px solid #999;    border-radius: 50px;    cursor: pointer;    display: inline-block;    font-family: arial;    font-weight: bold;    position: absolute;    top: -20px;    right: -20px;    font-size: 25px;    line-height: 30px;    width: 30px;    height: 30px;    text-align: center;} .popupCloseButton:hover {    background-color: #ccc;} .trigger_popup_fricc {    cursor: pointer;    font-size: 20px;    margin: 20px;    display: inline-block;    font-weight: bold;}/* Popup box BEGIN */';
        document.getElementsByTagName('head')[0].appendChild(style);

        div = document.createElement('div');
        div.id = "alertOverridePopup";
        div.className = "alert_override_popup";
        document.body.appendChild(div);
    }
    div.innerHTML = alert_html;

    if (typeof timeout !== 'undefined' && timeout > 0) {
        return new Promise((resolve, reject) => {
            setTimeout(function () { $(".alert_override_popup").hide(); resolve(); }, timeout);
        });
    }

    return actualAlert;
};
window.alertOverride = window.alert;

/* Attempting to re-add window.alert override function as Testim insists on removing it
 * Only use when not in a step hook (_stepData will be defined when in a hook and undefined otherwise)
 */
if (typeof _stepData === 'undefined') {

    let interval_timeout = 2000;
    setInterval(function () {

        window.alert = function (actualAlert) {

            console.log(`Alert() called with message: ${actualAlert}`);

            let alert_html = '<span class="alertDivHelper"></span><div onclick="$(\'.alert_override_popup\').hide();" style="width: 400px; vertical-align: middle; ">'
                + '<div style="width: 100%; height: 100%; border:0px solid black; padding: 2px; text-align: center; ">'
                + '<table>'
                + '<tr>'
                + '<td>'
                + (typeof actualAlert === 'object' ? JSON.stringify(actualAlert) : actualAlert)
                + '</td>'
                + '</tr>'
                + '</table>'
                + `<br/><input type="button" onclick="$('.alert_override_popup').hide();" value="ok" />`
                + '</div>';
            + '</div></div>';

            let div = document.getElementById("alert_override_popup");
            if (div === null) {
                let style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = '/* Popup box BEGIN */ .alert_override_popup{ background:rgba(0,0,0,.4); cursor:pointer; display:visible; height:100%; position:fixed; text-align:center; top:-5px; width:100%; z-index:10000;}.alert_override_popup .alertDivHelper{ display:inline-block; height:100%; vertical-align:middle;}.alert_override_popup > div {    background-color: #fff;    box-shadow: 10px 10px 60px #555; display: inline-block; height: auto; max-width: 600px; min-height: 100px; vertical-align: middle; width: 60%; position: relative; border-radius: 8px; padding: 15px 5%;} .popupCloseButton {    background-color: #fff;    border: 3px solid #999;    border-radius: 50px;    cursor: pointer;    display: inline-block;    font-family: arial;    font-weight: bold;    position: absolute;    top: -20px;    right: -20px;    font-size: 25px;    line-height: 30px;    width: 30px;    height: 30px;    text-align: center;} .popupCloseButton:hover {    background-color: #ccc;} .trigger_popup_fricc {    cursor: pointer;    font-size: 20px;    margin: 20px;    display: inline-block;    font-weight: bold;}/* Popup box BEGIN */';
                document.getElementsByTagName('head')[0].appendChild(style);

                div = document.createElement('div');
                div.id = "alertOverridePopup";
                div.className = "alert_override_popup";
                document.body.appendChild(div);
            }
            div.innerHTML = alert_html;

            if (typeof timeout !== 'undefined' && timeout > 0) {
                return new Promise((resolve, reject) => {
                    setTimeout(function () { $(".alert_override_popup").hide(); resolve(); }, timeout);
                });
            }

            return actualAlert;
        };
        window.alertOverride = window.alert;

    }, interval_timeout);

}