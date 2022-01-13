/**
 *  Element Select Text
 * 
 *      Select text within an element based on index or substring matches
 * 
 *  Parameters
 * 
 *      element (HTML) : Target textual element
 *
 *      startPosition (JS) [optional] : String or index of selection
 * 
 *      endPosition (JS) [optional] : String or index of selection
 * 
 *  Notes
 * 
 *      The selection will include the end search string if using string matching
 */

/* eslint-disable camelcase */
/* globals window, document, element, startPosition, endPosition */

let verbose = false;

let textNode = Array.from(element.childNodes).find(node => node.nodeType === 3);
if (!textNode) {
    throw new Error("failed to find text node");
}

let startOffset = 0;
let endOffset = textNode.length;

if (typeof startPosition !== 'undefined' && startPosition !== null) {
    if (typeof startPosition === 'string')
        startOffset = textNode.data.toLowerCase().indexOf(startPosition.toLowerCase());
    else
        startOffset = startPosition;
}
if (typeof endPosition !== 'undefined' && endPosition !== null) {
    if (typeof endPosition === 'string')
        endOffset = textNode.data.toLowerCase().indexOf(endPosition.toLowerCase()) + endPosition.length;
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

let selection = window.getSelection();
let range = document.createRange();

selection.removeAllRanges();

range.setStart(textNode, startOffset);
range.setEnd(textNode, endOffset);

selection.addRange(range);