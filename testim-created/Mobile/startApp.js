

/*
Ian Flanagan Tricentis 2023


 *  Parameters

 *      JS  [required] : call the parameter myApp

 myApp will be the app name to obtain in testim click on 'mobile apps'
 for example if the app is listed as 

 MyOnlineShop
 com.example.myonlineshop

 myApp will be set to 'com.example.myonlineshop'

  Disclaimer
  This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
  
  
*/

console.log('Starting app now ' +myApp);

try {
  
  await driver.activateApp(myApp);

} catch (error) {
    
    console.log(`Can\'t start the app ${myApp} ` +error);
    throw new Error("Error message");
  
}
