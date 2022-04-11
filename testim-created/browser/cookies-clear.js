/**
 *  Cookies Clear
 *
 *      Clears all cookies
 * 
 *  Parameters:
 *     
 *  Notes
 * 
 *      https://stackoverflow.com/questions/179355/clearing-all-cookies-with-javascript
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
  * 
 *  Base Step
 *      Custom Action
 * 
 *  Installation
 *      Create a new "Custom Action" named "Cookies-Clear"
 *      Set the new custom action's function body to this javascript
 *      Exit the step editor
 *      Save the test
 *      Bob's your uncle
 *
**/

(function () {
    var cookies = document.cookie.split("; ");
    for (var c = 0; c < cookies.length; c++) {
        var d = window.location.hostname.split(".");
        while (d.length > 0) {
            var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
            var p = location.pathname.split('/');
            document.cookie = cookieBase + '/';
            while (p.length > 0) {
                document.cookie = cookieBase + p.join('/');
                p.pop();
            };
            d.shift();
        }
    }
})();
