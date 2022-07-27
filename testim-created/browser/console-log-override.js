/**
 *  Console - Override
 *
 *      Override Console Log/Warn/Err/Debug and window onerror to capture all subsequent output.
 * 
 *  Parameters
 *
 *  Returns
 * 
 *  Notes
 *      This step will need to be executed after each page load
 *      I found the following javascript in a Stack Overflow thread
 * 
 *  Version       Date       Author          Details
 *      1.0.0     07/18/2022  Barry Solomon   Inital implementation
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      Custom Action
 *
 **/

/* eslint-disable camelcase */
/* globals window */

if (console.everything === undefined) {

    console.everything = [];
    function TS() {
        return (new Date).toLocaleString("sv", { timeZone: 'UTC' }) + "Z"
    }
    window.onerror = function (error, url, line) {
        console.everything.push({
            type: "exception",
            timeStamp: TS(),
            value: { error, url, line }
        })
        return false;
    }
    window.onunhandledrejection = function (e) {
        console.everything.push({
            type: "promiseRejection",
            timeStamp: TS(),
            value: e.reason
        })
    }

    function hookLogType(logType) {
        const original = console[logType].bind(console)
        return function () {
            console.everything.push({
                type: logType,
                timeStamp: TS(),
                value: Array.from(arguments)
            })
            original.apply(console, arguments)
        }
    }

    ['log', 'error', 'warn', 'debug'].forEach(logType => {
        console[logType] = hookLogType(logType)
    })
}
