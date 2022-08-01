/*

 NAME unzip-files-validation.js
 Author: Ian Flanagan Testim 2021 

 Unzips .zip file and extracts files and file contents in memory which can be used to validations

 Required Parameters:

 NPM AdmZip
 adm-zip @latest

 filedir 
 <directory where the file download will take place (if run locally on users workstation)>


 fileArray
 <pass in a list of files to validate where extracted via the .zip file> 
 example: ['myfiletwo','myfileone'] 
 
 NOTE: each are files also be aware of the array order in the way the files are extracted via the unzip 
 and listed in memory the fileArray needs to have the same order

expectedFileContent
<used to pass in an array of expected content for each file 
example ['Test','This is a test']

NOTE: 'Test' is the content of the first file and 'This is a test' is the content of the second file

 encoding
 <NOTE for text files use encoding of 'UTF-8' for .jpg file is Base64> Check type of file for encoding needed is 
 it will vary 

 Optional parameters:

This is an CLI action step in testim.io so make sure the agent is running 
 in another terminal window if running locally. Command to run is as follows:

 npm i -g @testim/testim-cli && testim connect
 
 NOTE code here is AS-IS and you are own your own in terms of support.

 save your changes and run!
*/

// Define variables
var fs = require('fs');
let filename = `${filedir}${fileName}`;
let zipEntries = [];
let newArray = [];
let results = [];

// check if required parameters are empty or undefined and throw an error 

if (typeof filedir === '' || typeof filedir === 'undefined') {
    throw new Error('Enter a file dirctory');
}

if (typeof encoding === '' || typeof encoding === 'undefined') {
    throw new Error('Enter valid encoding string');
}
// extract zip file and load into an array of records (files)
console.log('File name is ' +filename);
let zip = new AdmZip(filename);
zipEntries = zip.getEntries();   

// zip entries is an object so to compare files there is only need for the file name 
// get file name and load into new array
zipEntries.forEach(file => newArray.push(file.name)); 

// perform valiation loop over array of extracted files
for (let i=0; i<= newArray.length; i++) {

     // if the extracted file name matches with our expected file name then set the result to true and add  to the results array
     // otherwise set the result to false
     
    if (newArray[i] === fileArray[i]) {
        console.log(`File from extracted zip ${newArray[i]} is the same as file to validate: ${fileArray[i]}`);
        results.push(true);
    } else {
         console.log(`File from extracted zip ${newArray[i]} is not the same as file to validate: ${fileArray[i]}`);
         results.push(false);
    }
}

// print out file content which could be used for validation of what is in a file as well expectedFileContent
// if there is a need to loop all files uncomment 

/*
for (let i=0; i<= zipEntries.length; i++ ) {

    let extractedFileContent = zipEntries[i].getData().toString(encoding);
    console.log('Extracted file data: ' +extractedFileContent);

    if (extractedFileContent === expectedFileContent[i]) {
         results.push(true);
    } else {
         console.log(`Extracted data: ${extractedFileContent} did not match expected data: ${expectedFileContent[i]}`);
         results.push(false);
    }
}
*/

zipEntries.forEach(file => console.log(`File Name ${file.name} File content ${file.getData().toString(encoding)}`));

let myFirstFileContent = zipEntries[0].getData().toString(encoding);
//console.log('First file content = ' +myFirstFileContent);

let mySecondFileContent = zipEntries[1].getData().toString(encoding);
//console.log('Second file content = ' +mySecondFileContent);

if (myFirstFileContent = expectedFileContent[0]) {
            results.push(true);
} else {
            console.log(`Extracted file contents: ${myFirstFileContent} does\'nt match expected file contents: ${expectedFileContent[0]}`);
            results.push(false);
}

if (mySecondFileContent = expectedFileContent[1]) {
           // console.log('First file content = ' +myFirstFileContent);
            results.push(true);
} else {
            console.log(`Extracted file contents: ${mySecondFileContent} does\'nt match expected file contents: ${expectedFileContent[1]}`);
            results.push(false);
}



// validate the results array and check if there are any false entries if so throw an error and fail the step 
// in testim.io 

console.log(results);

if (results.includes(false)) {
    throw new Error('File extract validation failed!');
} else {
    console.log('File extract validation passed!');
    return true;
}




