/**
 *  Element Select Text
 * 
 *      Select text within an element based on index or substring matches
 * 
 *  Parameters
 * 
 *      element (HTML) : Target textual element
 *
 *      startPosition (JS) [optional] : String or index of startOffset of selection
 * 
 *      endPosition (JS) [optional] : String or index of endOffset of selection
 * 
 *      excludeTags (JS) [optional] : Include or exclude start/end text tags if used
 * 
 *      leadingBlanks (JS) [optional] : Include or exclude start/end blanks from tags
 * 
 *      returnVariableName (JS) : string name of variable to store selected text
 *
 *  Returns
 *      selectedText (or returnVariableName if specified) will contain actual text selected
 *
 *  Notes
 * 
 *      The selection will include the end search string if using string matching 
 * 
 *  Version     Date            Author              Notes             
 *  1.5.0       09/19/2022      Barry Solomon       Added excludeTags and leadingBlanks handling
 * 
 */

/* eslint-disable camelcase */
/* eslint-disable no-var */
/* globals window, document, element, startPosition, endPosition, excludeTags, leadingBlanks, returnVariableName, Event */

let verbose = false;

let return_variable_name = 'selectedText';
if (typeof returnVariableName !== 'undefined' && returnVariableName !== null)
    return_variable_name = returnVariableName;

let exclude_tags = false;
if (typeof excludeTags !== 'undefined' && excludeTags !== null)
    exclude_tags = excludeTags;

let leading_blanks = true;
if (typeof leadingBlanks !== 'undefined' && leadingBlanks !== null)
    leading_blanks = leadingBlanks;

function doEvent(element, eventName, lastValue = null) {
    var event = new Event(eventName, { target: element, bubbles: true, composed: true });
    event.simulated = true; // React 15   
    let tracker = element._valueTracker; // React 16
    if (tracker) {
        tracker.setValue(lastValue);
    }
    return element.dispatchEvent(event);
}

const copyToClipboard = str => { const el = document.createElement('textarea'); el.value = str; el.setAttribute('readonly', ''); el.style.position = 'absolute'; el.style.left = '-9999px'; document.body.appendChild(el); const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false; el.select(); document.execCommand('copy'); document.body.removeChild(el); if (selected) { document.getSelection().removeAllRanges(); document.getSelection().addRange(selected); } };

let textNode = Array.from(element.childNodes).find(node => node.nodeType === 3);
if (!textNode) {
    throw new Error("failed to find text node");
}

let startOffset = 0;
let endOffset = textNode.length;

if (typeof startPosition !== 'undefined' && startPosition !== null) {
    if (typeof startPosition === 'string') {
        let start_position = (leading_blanks) ? startPosition.toLowerCase() + " " : startPosition.toLowerCase();
        startOffset = textNode.data.toLowerCase().indexOf(start_position);
        if (startOffset == -1) {
            start_position = startPosition.toLowerCase();
            startOffset = textNode.data.toLowerCase().indexOf(start_position);
        }
        if (exclude_tags)
            startOffset += start_position.length;
    }
    else
        startOffset = startPosition;
}
if (typeof endPosition !== 'undefined' && endPosition !== null) {
    if (typeof endPosition === 'string') {
        let end_position = (leading_blanks) ? " " + endPosition.toLowerCase() : endPosition.toLowerCase();
        endOffset = textNode.data.toLowerCase().indexOf(end_position);
        if (endOffset <= startOffset) {
            end_position = endPosition.toLowerCase();
            endOffset = textNode.data.toLowerCase().indexOf(end_position);
        }
        if (endOffset > startOffset && !exclude_tags)
            endOffset += end_position.length;
    }
    else
        endOffset = endPosition;
}

if (verbose)
    console.log("startOffset", startOffset, "endOffset", endOffset);

if (startOffset < 0 || startOffset >= textNode.length)
    startOffset = 0;
if (endOffset < 0 || endOffset >= textNode.length)
    endOffset = textNode.length;
if (startOffset >= endOffset) {
    throw new Error("startOffseting position (" + startOffset + ") can not be after endOffset positon (" + endOffset + ")");
}

doEvent(element, "mousedown");

let range = document.createRange();
range.setStart(textNode, startOffset);
range.setEnd(textNode, endOffset);

let selection = window.getSelection();
selection.removeAllRanges();
selection.addRange(range);
//window.getSelection().selectAllChildren(element);

copyToClipboard(selection.toString());
exportsTest[return_variable_name] = selection.toString();

doEvent(element, "mouseup");
