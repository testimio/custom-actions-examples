/**
 *  File Upload - Set File
 * 
 *      Create/Set a file upload with custom data 
 * 
 *  Parameters
 *  
 *      element (HTML) : Target file upload control
 *      fileData (JS)  : File data.  Should accept text, JSON or binary data
 *      fileType (JS) [optional] : Default: 'text/plain'
 *      fileName (JS) [optional] : Name of uploaded file.  Default: testimGeneratedFile.txt
 * 
 *  Returns
 * 
 *  Notes
 * 
 *  Version       Date          Author          Details
 *      1.0.0     12/19/2022    Barry Solomon   Initial Version
 *  
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 */
/* globals File, DataTransfer, FileReader, element, fileName, fileType, fileData */
/* eslint-disable camelcase */

// var element = document.querySelector('#file_browser');
// let fileName = "testimFile.txt";
// let fileData = document.querySelector("#FileData").value;
// let fileType = "text/plain";

/* Validate element is defined
 */
if (typeof element === 'undefined' || element === null) {
    throw new Error("element is not defined");
}

/* Validate fileData is defined
 */
if (typeof fileData === 'undefined' || fileData === null) {
    throw new Error("fileData is not defined");
}

let file_name = (typeof (fileName) !== 'undefined' && fileName !== null) ? fileName : 'testimGeneratedFile.txt';
let file_type = (typeof (fileType) !== 'undefined' && fileType !== null) ? fileType : 'text/plain';

function loadDataToInputControl(element, fileName, fileType, fileData) {

    let file = new File([fileData], fileName, {
        type: fileType,
    });

    let container = new DataTransfer();
    container.items.add(file);
    element.files = container.files;

    let reader = new FileReader();
    reader.onload = function (e) {
        console.log("File Upload: "+ 
        "\n===========================================\n" +
        "fileName: " + file_name +
        "\n-------------------------------------------\n" +
        e.target.result +
        "\n===========================================");
    }
    reader.readAsText(element.files[0]);

}

loadDataToInputControl(element, file_name, file_type, fileData);
