/**
 *  Open Link in New Tab/Window
 * 
 *      Open a link in a new tab or window
 * 
 *  Parameters
 * 
 *      url (JS) : URL to navigate to in the tab
 *      targetFrame (JS) [optional] : Where to open the link ("_parent", "_blank", "_self", "_top").  Default: "_blank"
 *      windowFeatures (JS) [optional] : Optional specifications for new window
 * 
 *  Notes   
 *      https://developer.mozilla.org/en-US/docs/Web/API/Window/open
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      Custom Action
 * 
 */

/* eslint-disable camelcase */
/* globals window, url, targetFrame, windowFeatures */

/* Validate url is defined
 */
if (typeof url === 'undefined' || url === null) {
    throw new Error("url is not defined");
}

let target_url = url;
if (!url.startsWith('http'))
    target_url = 'http://' + url;

let target_frame = "_blank";
if (typeof targetFrame !== 'undefined' && targetFrame !== null) {
    target_frame = targetFrame;
}

let window_features = null;
if (typeof windowFeatures !== 'undefined' && windowFeatures !== null) {
    window_features = windowFeatures;
}

let _window = window.open(target_url, target_frame, window_features);

