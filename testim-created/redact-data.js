/**
 *  Redact Data
 *
 *    Redact Data will hide most any element from step screenshots in order to protect sensitive data 
 *    It does this by placing a covering div over the target element 
 *    as well as setting both fore and background colors to black
 *
 *  	Parameters
 *  		element (HTML) : Element to be redacted
 *		
 *    Notes:
 *        To hide the value from a set text screenshot, you will need to call this BEFORE the set text
 *
 *    Base Testim Step
 *        Custom Action
 *
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *    Installation:
 *        Create a new shared custom action
 *        Name it "Redact Data"
 *        Add an HTML parameter named 'element' (It defaults to 'element')
 *        Set the new custom action's function body to this javascript
 *        Exit the step editor
 *        Share the step if not already done so
 *        Save the test
 *        Bob's your uncle
 *
**/

/* globals element, window, document */

//
// Set element fore/background color to black
//

element.style.color           = "black";
element.style.backgroundColor = "black";

//
// create an opaque black div element to cover the target element
//

let element_computed_style = window.getComputedStyle(element);

let div = document.createElement('div');

div.style.background = 'black';

div.style.position   = element_computed_style.position == 'fixed' ? 'fixed' : 'absolute';
div.style.zIndex     = parseInt(element_computed_style.zIndex) + 1;

div.style.top        = element.offsetTop    + 'px';
div.style.left       = element.offsetLeft   + 'px';
div.style.width      = element.offsetWidth  + 'px';
div.style.height     = element.offsetHeight + 'px';

element.appendChild(div);
