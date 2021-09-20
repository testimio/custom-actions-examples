/**
 *  isEnabled
 * 
 *      Vaildate that an element is enabled (or disabled)
 * 
 *  Parameters
 *  
 *      element (HTML)
 *      isEnabled (JS) - Element enabled/not enabled flag true/false.  Default (true). 
 * 
 *  Base Step
 *      Custom Validation
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 **/

function isEnabled(element, isEnabled) {

    /* Validate required parameters
     */
    if (typeof (element) === 'undefined' || element === null)
        throw new Error("Target element has not been specified.");

    let expected_value = (typeof (isEnabled) !== 'undefined' && isEnabled !== null) ? isEnabled : true;

    let actual_value = element.hasAttribute('disabled');
    if (actual_value !== expected_value)
        return true;
    else
        throw new Error("Element is " + ((expected_value) ? "ENABLED" : "DISABLED") + " when it should be " + ((!expected_value) ? "ENABLED" : "DISABLED"));
}

return isEnabled(element, isEnabled);