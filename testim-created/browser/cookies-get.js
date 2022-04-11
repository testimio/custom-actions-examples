/**
 *  Cookies-Get
 *
 *      Get all cookies and return in currentCookies
 * 
 *  Returns:
 * 
 *      currentCookies : Array of all cookies currently defined in a session
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
 *      Create a new "Custom Action" named "Cookies-Get"
 *      Set the new custom action's function body to this javascript
 *      Exit the step editor
 *      Save the test
 *      Bob's your uncle
 *
**/

var cookies = document.cookie.split(";");
for (var i = 0; i < cookies.length; i++)
 {   
   var spcook =  cookies[i].split("=");
   console.log(spcook);
 }

 exportsTest.currentCookies = cookies;

