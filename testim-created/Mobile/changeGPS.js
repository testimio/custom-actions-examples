
/**

 Ian Flanagan Tricentis 2023 

 *  changeGPS method, will change location of device based on lat, long coordinates (only works on mobile)
 *  Notes
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 *  Base Step
 *      Custom Action
 * 
 */

async function changeGPS(lat,long) {

console.log(`Changing GPS based on these coordinates lat: ${lat} long: ${long} `);

try {

 	await driver.setGeoLocation({latitude: lat, longitude: long});
}
catch (error) {

    console.log(`Can\'nt change GPS based on these coordinates lat: ${lat} long: ${long} ` +error);
    throw new Error(`Can\'nt change GPS based on these coordinates lat: ${lat} long: ${long} `);

            }
}
