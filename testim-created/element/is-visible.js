/**
 *  isVisible
 * 
 *      Vaildate that an element is visible (or not visible)
 * 
 *  Parameters
 *  
 *      element (HTML)
 *      isVisible (JS) - Element visible/not visible flag true/false.  Default (true). 
 * 
 *  Base Step
 *      Custom Validation
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 **/

/* Validate required parameters
 */
if (typeof (element) === 'undefined')
    throw new Error("Target element has not been specified.");

function _isVisible(element) {

    while (element) {
        if (element === document) {
            return true;
        }
        var $style = window.getComputedStyle(element, null);
        if (!element) {
            return false;
        } else if (!$style) {
            return false;
        } else if ($style.display === 'none') {
            return false;
        } else if ($style.visibility === 'hidden') {
            return false;
        } else if (+$style.opacity === 0) {
            return false;
        } else if (($style.display === 'block' || $style.display === 'inline-block') &&
            $style.height === '0px' && $style.overflow === 'hidden') {
            return false;
        } else if (element.offsetWidth === 0 && element.offsetHeight === 0) {
            return false;
        }
        else {
            return $style.position === 'fixed' || _isVisible(element.parentNode);
        }
    }
}

let expected_value = (typeof (isVisible) !== 'undefined' && isVisible !== null) ? isVisible : true;
let actual_value = (element === null) ? false : _isVisible(element);
console.log("Element visible is " + actual_value + " when it should be " + expected_value);

if (actual_value === expected_value)
    return true;
else {
    throw new Error("Element is " + ((actual_value) ? "VISIBLE" : "NOTVISIBLE") + " when it should be " + ((expected_value) ? "VISIBLE" : "NOTVISIBLE"));
}
