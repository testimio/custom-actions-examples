
/*


 *  Notes
 * Ian Flanagan Tricentis 2023
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      Custom Action (mobile)
 * 
 * To call the function example tapPosition(1.2, 0.5);

*/

async function tapPosition(width, height) {
  try
  {
const location = await element.getLocation();
const size = await element.getSize();
const x = location.x + size.width * width;
const y = location.y + size.height * height;
await driver.touchAction([
  { action: 'press', x, y },
  { action: 'wait', ms: 100 },
  { action: 'release' }
]);
  }
  catch (error) {
      console.log('Issue executing tapPosition ' +error);
  }
}
