/**
 *  Element - Wait Not Visible
 * 
 *      Wait for an element to optionally visible and then not be visible 
 * 
 *  Parameters
 *  
 *      element (HTML)
 *      validateVisible (JS) [optional] : Wait for target element to first be visible before being hidden.  Default: true
 * 
 *  Base Step
 * 
 *      Custom Validation
 * 
 *  Notes
 * 
 *  Version     Date            Author              Notes             
 *    1.0.0     10/24/2022      Barry Solomon       Initial Version
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 **/

let verbose = false;

/* Validate required parameters
 */
if (typeof (element) === 'undefined')
    throw new Error("Target element has not been specified.");

let validate_visible = true;
if (typeof (validateVisible) !== 'undefined' && validateVisible !== null)
    validate_visible = validateVisible;

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

let is_visible = _isVisible(element);
let has_been_visible = !validate_visible || is_visible;

return new Promise((resolve, reject) => {

    /* If we are not validating an element is initially visible
     * then check to see if the element currently is_visible
     */
    is_visible = _isVisible(element);
    if (!validate_visible && !is_visible) {
        resolve();
    }

    // Only add the observer once
    //
    if (validate_visible && typeof observer === 'undefined' || observer === null) {

        const observer = new MutationObserver(function (mutations) {

            mutations.forEach(function (mutation) {

                if (mutation.type === 'attributes') {

                    if (verbose)
                        console.log('target.style.visibility = ' + mutation.target.style.visibility);

                    is_visible = _isVisible(element);
                    if (has_been_visible !== true && is_visible)
                        has_been_visible = true;

                    if (has_been_visible && !is_visible) {
                        observer.disconnect();
                        resolve();
                    }

                }

            });
        });

        let observerConfig = {
            attributes: true,
            attributeFilter: ['style'],
        };

        try {
            observer.observe(element, observerConfig);
        }
        catch (e) {
            console.error(e);
        }

    }

});
