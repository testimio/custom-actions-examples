/**
    Set Value

        Parameters
            element (HTML)  : Element with the value to be set
            value (JS)       : value to be set
                                         
    Note:

    Disclaimer:
        This is an example and not supported by Testim in any way, shape or form

**/

function doEvent(obj, event) {
    var event = new Event(event, { target: obj, bubbles: true, composed : true });
    // React 15
    event.simulated = true;
    // React 16
    let tracker = element._valueTracker;
    if (tracker) {
        tracker.setValue(lastValue);
    }
    return obj ? obj.dispatchEvent(event) : false;
}

element.value = (typeof value === 'undefined' || value === null) ? "" : value;

doEvent(element, 'input');
doEvent(element, 'change');
