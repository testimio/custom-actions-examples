/**
 *  isPlaying
 *  
 *      Validate that a video/media element is currently playing video (or not)
 *  
 *  Parameters
 *  
 *      element (HTML)
 *      isPlaying (JS) - Element playing/not playing true/false.  Default (true). 
 *  
 *  Base Step
 *      Custom Validation
 *  
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 **/

 function IsPlaying(element, expectedIsPlaying) {

    let actual_isplaying = !!(element.currentTime > 0 && !element.paused && !element.ended && element.readyState > 2) ? true : false;

    console.log("actual_isplaying", actual_isplaying, "expectedIsPlaying", expectedIsPlaying);

    if (actual_isplaying === expectedIsPlaying)
        return true;
    else
        throw new Error("Element is " + ((expectedIsPlaying) ? "NOT PLAYING" : "PLAYING") + " when it should be " + ((!expectedIsPlaying) ? "NOT PLAYING" : "PLAYING"));

}

/* Validate required parameters
 */
if (typeof (element) === 'undefined' || element === null)
    throw new Error("Target element has not been specified.");

let is_playing = (typeof isPlaying !== 'undefined' && isPlaying !== null) ? isPlaying : true;

return IsPlaying(element, is_playing);
