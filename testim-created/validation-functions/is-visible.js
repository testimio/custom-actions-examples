/**
 *  isVisible
 * 
 *      Vaildate that an element is visible
 * 
 *  Parameters
 *  
 *      element (HTML)
 * 
 *  Base Step
 *      Custom Validation
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 */
function isVisible(element) {

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
            return $style.position === 'fixed' || isVisible(element.parentNode);
        }
    }
}
return isVisible(element);