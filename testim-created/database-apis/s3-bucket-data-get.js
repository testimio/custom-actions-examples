/**
 *	S3 - Bucket Data Get
 * 
 * 		Retrieve data from an AWS S3 Bucket 
 * 
 *  Parameters
 * 
 *      bucketName (JS)
 *      keyName (JS)
 * 		awsRegion (JS) [optional]  : Default 'us-east-1'
 * 
 *      returnVariableName (JS) [optional] : Name of the variable return results to Testim 
 *                              Default: "s3Data"
 * 
 * 		aws_sdk (Package) [optional] : aws-sdk @ latest
 * 		_aws_sdk_client_s3 (Package) [optional] : @aws-sdk/client-s3 @ latest
 * 
 *  Returns
 *      s3Data or whatever returnVariableName is set to (if returnVariableName is set that is) will contain the updated bucket data
 * 
 * 	Base Step 
 * 		CLI Action
 * 
 * 	Notes
 * 		
 * 		You will need to configure for access to Amazon cloud.
 * 			set awsAccessKeyId     = '<YOUR ACCESS KEY ID>';
 *			and awsSecretAccessKey = '<YOUR SECRET ACCESS KEY ID>'
 *      to valid credentials
 *
 * 		If you do not use step params for aws_sdk and _aws_sdk_client_s3 package params then you will need to install these npm packages
 *   		npm install aws-sdk
 *   		npm install @aws-sdk/client-s3
 * 		
 * 		https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-creating-buckets.html
 * 		https://console.aws.amazon.com/iamv2/home?#/home
 * 		https://console.aws.amazon.com/iamv2/home?#/users
 * 		
 * 		https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html
 * 		https://s3.console.aws.amazon.com/s3/home?region=us-east-1
 * 		
 * 		Amazon S3 Bucket Naming Requirements;
 *		The bucket name can be between 3 and 63 characters long, and can contain only lower-case characters, numbers, periods, and dashes.
 *		Each label in the bucket name must start with a lowercase letter or number.
 *		The bucket name cannot contain underscores, end with a dash, have consecutive periods, or use dashes adjacent to periods.
 *		The bucket name cannot be formatted as an IP address (198.51.100.24).
 * 
 *  Version       Date          Author          Details
 *      1.0.0     12/08/2022    Barry Solomon   Initial Version
 * 
 *  Disclaimer
 *      This Custom Action is provided "AS IS".  It is for instructional purposes only and is not officially supported by Testim
 * 
 **/

/* globals require, Promise */

// var bucketName = "bds-testim-testdata";
// var keyName = "TestResults.json";
// var awsRegion = 'us-east-1';

let DEFAULT_RETURN_VARIABLE_NAME = "s3Data";
let DEFAULT_AWS_REGION = "us-east-1";

var awsAccessKeyId = '<YOUR ACCESS KEY ID>';
var awsSecretAccessKey = '<YOUR SECRET ACCESS KEY ID>';

if (typeof awsAccessKeyId === 'undefined' || awsAccessKeyId === null || awsAccessKeyId === '<YOUR ACCESS KEY ID>')
	throw new Error("ERROR: awsAccessKeyId must be defined");
if (typeof awsSecretAccessKey === 'undefined' || awsSecretAccessKey === null || awsSecretAccessKey === '<YOUR SECRET ACCESS KEY ID>')
	throw new Error("ERROR: awsSecretAccessKey must be defined");

let return_variable_name = (typeof returnVariableName !== 'undefined' && returnVariableName !== null) ? returnVariableName : DEFAULT_RETURN_VARIABLE_NAME;

let aws_region = (typeof awsRegion !== 'undefined' && awsRegion !== null) ? awsRegion : DEFAULT_AWS_REGION;

if (typeof bucketName === 'undefined' || bucketName === null)
	throw new Error("ERROR: bucketName must be defined");
if (typeof keyName === 'undefined' || keyName === null)
	throw new Error("ERROR: keyName must be defined");

// Load the AWS SDK for Node.js

function loadModules(moduleNames) {

    let modulesLoaded = [];
    function loadModule(moduleName) {
        let moduleNameVar = moduleName.replace(/\-/g, "_").replace(/\//g, "_").replace(/\@/g, "_");
        let _moduleNameVar = moduleName.replace(/\-/g, "_").replace(/\//g, "_").replace(/\@/g, "_");
        eval('try { ' + moduleNameVar + ' = (typeof ' + moduleNameVar + ' !== "undefined" && ' + moduleNameVar + ' !== null) ? ' + moduleNameVar + ' : require("' + moduleName + '"); if (moduleNameVar != null) modulesLoaded.push("' + moduleName + '"); } catch { console.log("Module: ' + moduleName + ' is not installed"); } ');
        if (modulesLoaded.includes(moduleName)) {
            console.log("Module " + moduleName + " is loaded as " + _moduleNameVar);
        }
    }

    moduleNames.forEach((moduleName) => {
        loadModule(moduleName);
    });

    console.log("Module " + modulesLoaded + " is loaded.");

}

// const aws_sdk = require('aws-sdk');
// const { GetObjectCommand, S3Client } = require('@aws-sdk/client-s3');
loadModules(["aws-sdk", "@aws-sdk/client-s3"]);
const { GetObjectCommand, S3Client } =_aws_sdk_client_s3;

aws_sdk.config.update({
	region: aws_region,
	accessKeyId: awsAccessKeyId,
	secretAccessKey: awsSecretAccessKey,
	credentials: {
		accessKeyId: awsAccessKeyId,
		secretAccessKey: awsSecretAccessKey,
	}
});

// Create S3 service object
let s3 = new aws_sdk.S3({
	apiVersion: '2006-03-01',
});

// LIST Buckets
//
new Promise(function (resolve) {

	// Call S3 to list the buckets
	s3.listBuckets(function (err, data) {
		if (err) {
			console.log("Error", err);
		} else {
			console.log("Buckets: ", data.Buckets.length, data.Buckets);
		}
		resolve();
	});

});

const client = new S3Client(
	{
		region: aws_region,
		accessKeyId: awsAccessKeyId,
		secretAccessKey: awsSecretAccessKey,
		credentials: {
			accessKeyId: awsAccessKeyId,
			secretAccessKey: awsSecretAccessKey,
		}
	}
) // Pass in opts to S3 if necessary

function getObject(Bucket, Key) {

	return new Promise(async (resolve, reject) => {

		const getObjectCommand = new GetObjectCommand({ Bucket, Key })

		try {

			const response = await client.send(getObjectCommand)

			// Store all of data chunks returned from the response data stream 
			// into an array then use Array#join() to use the returned contents as a String
			let responseDataChunks = []

			// Attach a 'data' listener to add the chunks of data to our array
			// Each chunk is a Buffer instance
			response.Body.on('data', chunk => responseDataChunks.push(chunk))

			// Once the stream has no more data, join the chunks into a string and return the string
			response.Body.once('end', () => resolve(responseDataChunks.join('')))

		} catch (err) {
			// Handle the error or throw
			return reject(err)
		}
	})
}

let s3ObjectParams = {
	Bucket: bucketName,
	Key: keyName,
};

return new Promise((tresolve, treject) => {

	getObject(s3ObjectParams.Bucket, s3ObjectParams.Key)
		.then((data) => {

			console.log("\ngetObject\n", data)

			if (typeof exportsTest !== 'undefined') {
				exportsTest[return_variable_name] = data;
				/* Create variables from top root response body json key/value pairs */
				//try { json = (typeof data === "string") ? JSON.parse(data) : data; Object.keys(json).forEach((key) => { console.log(`==> ${key} = ${json[key]}`); exportsTest[key] = json[key]; }) } catch (err) { console.log(err.message + ".  Auto variables not created"); };
			}
			tresolve();

		})

})
