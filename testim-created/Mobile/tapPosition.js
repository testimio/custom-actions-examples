
/*
Ian Flanagan Tricentis 2023


 *  Parameters

 *      parentElement (HTML) [required] : Parent element for localizing the area to tap (only works for mobile)

  Disclaimer
  This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim

  To use 
*/

async function tapPosition(width, height) {

  try

  {

console.log(`Starting tapPosition with coordinates width: ${width} height: ${height}`);

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