/**
 * Network Validate Requests
 * 
 *      Validate that network requests were made and optionally validate response status(es) and/or request(s) are not slower than maxDuration (ms)
 * 
 *  Parameters
 *      requestUrlsFilter (JS)               : Target network request filter.  Partial match to URL to pick a subset of requests to validate
 *                                              Examples: "demo.testim.io" or ["demo.testim.io/login", "demo.testim.io/checkout"]
 * 
 *      networkRequestMethod (JS) [optional] : Expected networkRequestMethod for all validated network calls
 *                                              Examples: "GET", "POST"
 * 
 *      networkRequestType (JS) [optional]   : Array of response types to include
 *                                              Example: ["Image", "Media", "Document", "Stylesheet", "Script", "Font", "XHR"]
 * 
 *      statusCode (JS) [optional]           : Expected status code(s) to be returned for all validated network calls
 *                                              Examples: 200 or [200, 204]
 * 
 *      maxDuration (JS) [optional]          : max response time for all validated network calls
 *          
 *  Base Step
 *      Network Validation
 * 
 *  Notes
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      Network Validation
 * 
 *  Installation
 *      Create a new "Network Validation"
 *      Name it "Network Validate Request"
 *      Create parameters
 *          requestUrlsFilter (JS)
 *      Optional - add optional parameters
 *          statusCode (JS) [optional]
 *          networkRequestMethod (JS) [optional]
 *          networkRequestType (JS) [optional]
 *          maxDuration (JS) [optional] 
 *      Set the new custom action's function body to this javascript
 *      Override timeout => Step timeout (milliseconds) = 1000
 *      Exit the step editor
 *      Share the step if not already done so
 *      Save the test
 *      Bob's your uncle
 */

/* eslint-disable no-var */
/* eslint-disable camelcase */
/* globals networkRequests, requestUrlsFilter, statusCode, maxDuration, networkRequestMethod, networkRequestType, networkValidationCheckIndex */

/*  Used for debugging.  Enable/disable writing interim data to the console
 */
var verbose = true;

// Validate that requestUrlsFilter is defined
//
if (typeof requestUrlsFilter === 'undefined' || requestUrlsFilter === null)
    throw new Error("requestUrlsFilter is undefined");

/* Default optional parameters
 */
var _networkRequestTypes = null;
if (typeof networkRequestType !== 'undefined')
    _networkRequestTypes = (typeof networkRequestType === 'object') ? networkRequestType : [networkRequestType];

var _networkRequestMethods = null;
if (typeof networkRequestMethod !== 'undefined')
    _networkRequestMethods = (typeof networkRequestMethod === 'object') ? networkRequestMethod : [networkRequestMethod];

var _statusCodes = null;
if (typeof statusCode !== 'undefined')
    _statusCodes = (typeof statusCode === 'object') ? statusCode : [statusCode];

eval('maxDuration          = (typeof maxDuration !== "undefined" && maxDuration !== null) ? maxDuration : null ');

var expectedNetworkRequests = [];
if (typeof requestUrlsFilter === 'string') {
    expectedNetworkRequests.push({
        "url": requestUrlsFilter,
        "statusCodes": _statusCodes,
        "networkRequestMethod": _networkRequestMethods?.map(function(x){ return x.toUpperCase(); }),
        "networkRequestType": _networkRequestTypes,
        "maxDuration": maxDuration,
    });
}
else {
    requestUrlsFilter.forEach((requestUrl) => {
        if (typeof requestUrl === 'string') {
            expectedNetworkRequests.push({
                "url": requestUrl,
                "statusCodes": _statusCodes,
                "networkRequestMethod": _networkRequestMethods?.map(function(x){ return x.toUpperCase(); }),
                "networkRequestType": _networkRequestTypes,
                "maxDuration": maxDuration,
            });
        }
        else {
            expectedNetworkRequests = requestUrlsFilter;
        }
    });
}
if (verbose) {
    console.log("requestUrlsFilter", requestUrlsFilter);
    console.log("expectedNetworkRequests", JSON.stringify(expectedNetworkRequests));
}

// Only consider requests since last time 
//
var networkValidationCheckIndexLast = 0;
if (typeof networkValidationCheckIndex !== 'undefined' && networkValidationCheckIndex !== null)
    networkValidationCheckIndexLast = networkValidationCheckIndex;

exportsTest.networkValidationCheckIndex = networkRequests.length;

if (verbose)
    console.table(networkRequests)

// Result object
//
var networkValidationResults = {
    success: false,
    numMatchedURLs: 0,
    errorDetails: {
        url: null,
        errors: [],
    },
    matchingRequests: []
}

// Loop all requests and look for matches/status
//
var _networkRequestMatches = networkRequests.filter((request, index) => {

    /* Only consider requests since last instantiation 
     */
    if (index < networkValidationCheckIndexLast) {
        return false;
    }

    var expected_network_request_match = null;

    var expected_network_request_matches = Array.from(expectedNetworkRequests).filter(expectedNetworkRequest => {
        return (request.url.includes(expectedNetworkRequest.url));
    });

    if (verbose)
        console.log("expected_network_request_matches?.length", expected_network_request_matches?.length);

    var match = (expected_network_request_matches?.length > 0);
    if (match) {

        expected_network_request_match = expected_network_request_matches[0];
        if (verbose)
            console.log("expected_network_request_match", JSON.stringify(expected_network_request_match, null, 2));

        // Calculate call duration
        //
        request.duration = (request.endTime !== undefined && request.startTime != undefined) ? request.endTime - request.startTime : 0;

        // Run all checks and note statuses
        //
        request.validateMethod = (typeof expected_network_request_match.networkRequestMethod === 'undefined' || expected_network_request_match.networkRequestMethod === null || expected_network_request_match.networkRequestMethod.includes(request.method)) ? true : false;
        request.validateType = (typeof expected_network_request_match.networkRequestType === 'undefined' || expected_network_request_match.networkRequestType === null || expected_network_request_match.networkRequestType.includes(request.type)) ? true : false;
        request.validateStatusCode = (typeof expected_network_request_match.statusCodes === 'undefined' || expected_network_request_match.statusCodes === null || expected_network_request_match.statusCodes.includes(request.statusCode)) ? true : false;
        request.validateMaxDuration = (typeof expected_network_request_match.maxDuration === 'undefined' || expected_network_request_match.maxDuration === null || request.duration <= expected_network_request_match.maxDuration) ? true : false;

        // Mark success based on sub-check validations
        //
        request.status = (request.validateMaxDuration && request.validateMethod && request.validateType && request.validateStatusCode);
        if (!request.status) {

            networkValidationResults.success = false;

            networkValidationResults.errorDetails.url = request.url;

            if (request.validateMethod === false)
                networkValidationResults.errorDetails.errors.push("Error: (Method) Expected: " + expected_network_request_match.networkRequestMethod + ", Actual: " + request.method + " ==> " + request.url);
            if (request.validateType === false)
                networkValidationResults.errorDetails.errors.push(request.url + "Error: (Type) Expected: " + expected_network_request_match.networkRequestType + ", Actual: " + request.type + " ==> " + request.url);
            if (request.validateStatusCode === false)
                networkValidationResults.errorDetails.errors.push(request.url + "Error: (StatusCode) Expected: " + expected_network_request_match.statusCodes + ", Actual: " + request.statusCode + " ==> " + request.url);
            if (request.validateMaxDuration === false)
                networkValidationResults.errorDetails.errors.push(request.url + "Error: (MaxDuration) Actual: " + request.duration + " Expected MaxDuration " + expected_network_request_match.maxDuration + " ==> " + request.url);
        
        }

        networkValidationResults.numMatchedURLs += 1;

        if (verbose)
            console.table("networkValidationResults.success", networkValidationResults.success);

    }

    return (match);

});

if (_networkRequestMatches != null)
    networkValidationResults.matchingRequests = _networkRequestMatches.map(({ url, status, validateStatusCode, validateMethod, validateType, validateMaxDuration, duration, responseSize, protocol, networkRequestMethod, statusCode, statusText, source, isBlocked, isDone, isCancelled, networkRequestType }) => ({ url, status, validateStatusCode, validateMethod, validateType, validateMaxDuration, duration, responseSize, protocol, networkRequestMethod, statusCode, statusText, source, isBlocked, isDone, isCancelled, networkRequestType }));

if (verbose)
    console.table(networkValidationResults.matchingRequests)

// Validate all expectedNetworkRequests were found
//       
Array.from(expectedNetworkRequests).forEach(expectedNetworkRequest => {
    // Validate all URLs were found
    if (!Array.from(networkValidationResults.matchingRequests).some(networkValidationResult => networkValidationResult.url.includes(expectedNetworkRequest.url))) {
        console.error(`${expectedNetworkRequest.networkRequestMethod} ${expectedNetworkRequest.url} not found in networkRequests`);
        throw new Error(`${expectedNetworkRequest.networkRequestMethod} ${expectedNetworkRequest.url} not found in networkRequests`);
    }
});

// Validate all URLs found have successful validations
//
if (networkValidationResults?.errorDetails?.errors?.length > 0) {
    console.error("Error: " + JSON.stringify(networkValidationResults?.errorDetails?.errors, null, 2));
    throw new Error("Error: " + JSON.stringify(networkValidationResults?.errorDetails?.errors, null, 2));
}
