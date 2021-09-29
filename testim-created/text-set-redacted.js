/* eslint-disable camelcase */
/**
 *  Set Text (Redacted)
 * 
 *      Redacts a field and then sets its text
 * 
  	Parameters
  		element (HTML)   : Element with the value to be set
  		text (JS)        : Text to be set
 										 
    Disclaimer:
        This is an example and not supported by Testim in any way, shape or form
        
 *  Base Step
 *      Custom Action
 * 
 *  Installation
 *      Create a new "Custom Action"
 *      Name it "Set Text (Redacted)"
 *      Create parameters
 *          element (HTML)
 *          text (JS)
 *      Set the new custom action's function body to this javascript
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 * 
 ***/

/* globals window, element, document, Event, text, lastValue */

//
// Set element fore/background color to black
//

element.style.color = "black";
element.style.backgroundColor = "black";

//
// create an opaque black div element to cover the target element
//

let element_computed_style = window.getComputedStyle(element);

let div = document.createElement('div');

div.style.background = 'black';

div.style.position = element_computed_style.position == 'fixed' ? 'fixed' : 'absolute';
div.style.zIndex = parseInt(element_computed_style.zIndex) + 1;

div.style.top = element.offsetTop + 'px';
div.style.left = element.offsetLeft + 'px';
div.style.width = element.offsetWidth + 'px';
div.style.height = element.offsetHeight + 'px';

element.appendChild(div);

//
// Set the text
//

function doEvent(element, eventName) {
    let event = new Event(eventName, { target: element, bubbles: true, composed : true });   
    event.simulated = true; // React 15   
    let tracker = element._valueTracker; // React 16
    if (tracker) {
        tracker.setValue(lastValue);
    }
    return element ? element.dispatchEvent(event) : false;
}

element.value = text;
element.text  = text;
doEvent(element, 'input');
doEvent(element, 'change');
