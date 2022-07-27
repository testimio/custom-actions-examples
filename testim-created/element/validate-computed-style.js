/*
 *  Validate Computed Style
 *  
 *      Validates any/all style(s) of an element by getting the computed styles and validating them against expected styles 
 * 
 *  Parameters
 * 
 *  		element        (HTML) : Target Element
 *  		expectedStyles (JS)   : expected styles formatted as JSON 
 *  	 		Example:  {"alignContent": "left", "alignItems": "center", "backgroundColor": "rgb(56, 234, 100)", "backgroundImage": "none", "border": "0px none rgb(49, 49, 49)" }
 *   
 *  Returns
 * 
 *      actualStyles
 * 
 *  Notes
 * 
 *  	Actual values are copied to the clipboard and can be used as extected values either in whole or in part
 *      To start, run this without an expectedStyles set to capture the current values that can then be set as expectedStyles 
 *      The configuration variable 'supportedStyles' (below) can be modified to filter captured styles to just those of interest to you as there are a ton by default
 * 
 *  Use
 *      Set the element to the target element to be validated
 *      Run the step with an empty expectedStyles value\
 *      After a successful run, all current styles will be in the clipboard and can be pasted into the expectedStyles parameter
 *      Optionally, you can edit expectedStyles to just those that you want to validate
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      Custom Validation
 */

// Used for debugging.  Enable/disable writing interim data to the console
let verbose = false;

/* supportedStyles.computedStyles is used to filter which styles we are interested in.  If left blank then all computed styles will be captured/validated
 */
let supportedStyles = {
    computedStyles: {
    }
};

/* An example of some common styles for validation
 */
supportedStyles = {
    computedStyles: {
        "alignContent": "", "alignItems": "", "background": "", "backgroundColor": "", "backgroundImage": "", "borderStyle": "", "color": "", "display": "", "float": "", "font": ""
        , "fontSize": "", "fontStyle": "", "fontWeight": "", "left": "", "margin": "", "maxHeight": "", "maxWidth": "", "minHeight": "", "minWidth": "", "overflow": ""
        , "padding": "", "position": "", "textAlign": "", "top": "", "visibility": "", "width": "", "x": "", "y": "", "zIndex": "", "zoom": "",
    }
};

/* globals expectedStyles, document, window, element */

const copyToClipboard = str => { const el = document.createElement('textarea'); el.value = str; el.setAttribute('readonly', ''); el.style.position = 'absolute'; el.style.left = '-9999px'; document.body.appendChild(el); const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false; el.select(); document.execCommand('copy'); document.body.removeChild(el); if (selected) { document.getSelection().removeAllRanges(); document.getSelection().addRange(selected); } };

function computedStylesValidate(element, expectedStyles) {

    // Get Expected Values.  Use default (all known if undefined)
    //
    let expected_styles;
    if (typeof expectedStyles !== 'undefined' && expectedStyles !== null) {

        expected_styles = expectedStyles;

        // If Expected Values is not JSON, attempt to convert to JSON
        //
        if (typeof expected_styles === 'string') {
            if (expected_styles.startsWith("{") === false) {
                expected_styles = "{" + expected_styles.replace("=", ":") + "}";
            }
            expected_styles = JSON.parse(expected_styles);
        }

        supportedStyles.computedStyles = expected_styles;
    }

    if (verbose)
        console.log("EXPECTED STYLES", JSON.stringify(expected_styles, null, 2));

    // Get Actual Computed Styles
    //
    let actual_styles = {};
    let elementStyles = window.getComputedStyle(element, null)
    for (let key in elementStyles) {
        if (isNaN(key) && key != "cssText") {
            if (key.length > 0 && elementStyles[key] !== null && elementStyles[key].length > 0) {
                if (typeof (supportedStyles?.computedStyles) === 'undefined' || supportedStyles?.computedStyles === null || Object.keys(supportedStyles.computedStyles).length === 0 || supportedStyles.computedStyles.hasOwnProperty(key)) {
                    actual_styles[key] = elementStyles[key];
                }
            }
        }
    }

    // Save actual styles to the clipboard.  These can be used to set expected values
    //
    copyToClipboard(JSON.stringify(actual_styles, null, 1));
    exportsTest["actualStyles"] = JSON.stringify(actual_styles);
    if (verbose)
        console.log("ACTUAL STYLES", JSON.stringify(actual_styles, null, 2));

    // Validate
    //
    let result = true;
    let differences = { "Type": element.tagName, "Text": element.innerText };
    if (typeof expected_styles !== 'undefined') {
        for (let key in expected_styles) {
            if (verbose)
                console.log("Validate " + key + "Expected: [" + expected_styles[key] + "], Actual:[" + actual_styles[key] + "]");

            if (Object.prototype.hasOwnProperty.call(supportedStyles.computedStyles, key) && Object.prototype.hasOwnProperty.call(actual_styles, key)) {

                if (actual_styles[key] != expected_styles[key]) {
                    differences[key] = { "Actual": actual_styles[key], "Expected": expected_styles[key] };
                    if (result)
                        result = false;
                    if (verbose)
                        console.log("    MISMATCH:: " + key + " => \nExpected: [" + expected_styles[key] + "], \nActual: [" + actual_styles[key] + "]");
                }
            }
        }
    }

    // If failed, echo to console and report an error
    //
    if (!result) {
        if (verbose) {
            console.log("expected_styles", JSON.stringify(expected_styles));
            console.log("actual_styles", JSON.stringify(actual_styles));
        }
        console.log("Validate Computed Style(s): ", JSON.stringify(differences, null, 2));
        throw new Error("Validate Computed Style(s)\n" + JSON.stringify(differences, null, 2));
    }

}
computedStylesValidate(element, expectedStyles);
