

var textNode = Array.from(element.childNodes).find(node => node.nodeType === 3);
if(!textNode) {
  throw new Error("failed to find text node");
}

if (start < 0)
  start = 0;
if (end > textNode.length)
  end = textNode.length - 1;

var startOffset = start;
var endOffset   = end;

var sel = window.getSelection();
var range = document.createRange();
sel.removeAllRanges();
range.setStart(textNode, startOffset);
range.setEnd(textNode, endOffset);
sel.addRange(range);

var clickEvent = document.createEvent ('MouseEvents');
clickEvent.initEvent("mouseup", true, true);
element.dispatchEvent(clickEvent);

copyToClipboard(sel.toString());
console.log("selection = " + sel.toString());
exportsTest.copiedText = sel.toString();
