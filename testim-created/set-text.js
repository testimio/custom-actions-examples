/**
    Set Text

        Parameters
            element (HTML)  : Element with the value to be set
            text (JS)       : text to be set
                                         
    Note:

    Disclaimer:
        This is an example and not supported by Testim in any way, shape or form

**/

function doEvent(obj, event) {
    var event = new Event(event, { target: obj, bubbles: true, composed : true });   
    event.simulated = true; // React 15   
    let tracker = element._valueTracker; // React 16
    if (tracker) {
        tracker.setValue(lastValue);
    }
    return obj ? obj.dispatchEvent(event) : false;
}

element.value = text;
element.text  = text;
doEvent(element, 'input');
doEvent(element, 'change');
