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
 *  Notes
 * 
 *  Version       Date          Author          Details
 *      1.1.0     10/28/2022    Barry Solomon   Handle nested player and some new weird methods instead of properties found for a specific player
 *  
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 **/

 function IsPlaying(element, expectedIsPlaying) {

    let current_time = element.currentTime ?? element?.player?.currentTime();
    let has_started  = element.hasStarted ?? element?.player?.hasStarted();
    let ready_state  = element.readyState ?? element?.player?.readyState();
    let paused       = element.paused ?? element?.player?.paused();
    let ended        = element.ended ?? element?.player?.ended();
    
    let actual_isplaying = !!(current_time > 0 && !paused && !ended && ready_state > 2 && has_started !== false) ? true : false;

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

var video_element = element;
if (video_element.tagName.toLowerCase() === 'div') {
    video_element = element.querySelector("player");
    if (video_element === null) {
        video_element = element.querySelector("video");
    }
}

let is_playing = (typeof isPlaying !== 'undefined' && isPlaying !== null) ? isPlaying : true;

return IsPlaying(video_element, is_playing);