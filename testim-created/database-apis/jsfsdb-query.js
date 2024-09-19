/**
 *  JSONDBFS Query
 * 
 *      Read/write data from/to local json files on disk using NoSQL query syntax.
 * 
 *  Parameters
 * 
 *      operation (JS)       : CRUD operation to perform
 *                              Supported operations are: "insert", "update", "upsert", "retrieve", "delete", "count"
 *      criteria (JS)        : NoSQL JSON style criteria (query) for "retrieve", "delete", "count" operations  
 *                              Example: { "resultId": "d3ITrTYvoh0FS3tR" }
 *      data (JS)            : NoSQL JSON data for "insert", "update", "upsert" operations 
 *                              Example: { "resultId": 'd3ITrTYvoh0FS3tR', "TestDataJSON": { "email": "barry@testim.io", "password": "%SD^AF^%F^&", "role": "user", "username": "John", "value": "$1183.46" } }
 *      returnVariableName (JS) [optional] : Name of the variable return results to Testim 
 *                              Default: "jsondbfsResults"
 *      collectionName (JS) [optional] : Name of the collection json file.  
 *                              Default = "TestData" which would create/use the file TestData.json in the databasePath directory
 *      databasePath (JS) [optional] : Directory containing the collection json file.  
 *                              Default is current directory where CLI is running
 *      jsondbfs (NPM) : jsondbfs npm package.  Set this to jsondbfs @ latest
 * 
 *  Returns
 * 
 *      jsondbfsResults or whatever returnVariableName is set to (if returnVariableName is set that is)
 * 
 *  Notes
 * 
 *      jsondbfs npm package - https://github.com/mcmartins/jsondbfs
 * 
 *  Base Step
 * 
 *      CLI Action
 * 
 */

/* eslint-disable camelcase */
/* globals require, Promise, operation, criteria, data, databasePath, collectionName, returnVariableName */

// let operation = "count"
// let criteria = { "resultId": "d3ITrTYvoh0FS3tR" };
// let data = { "resultId": 'd3ITrTYvoh0FS3tR', "TestDataJSON": { "email": "barry@testim.io", "password": "%SD^AF^%F^&", "role": "user", "username": "John", "value": "$3183.46" } }

let verbose = true;

let JSONDBFSDriver = (typeof jsondbfs === 'undefined') ? require('jsondbfs') : jsondbfs;

const SUPPORTED_OPERATIONS = ["insert", "update", "upsert", "get", "retrieve", "delete", "count"];
const DEFAULT_JSONDBFS_PATH = ".";
const DEFAULT_JSONDBFS_COLLECTIONNAME = "TestData";
const DEFAULT_RETURN_VARIABLE_NAME = "jsondbfsResults";

/*
 *  Process and Validate Parameters
 */
let database_path = (typeof databasePath !== 'undefined' && databasePath !== null) ? databasePath : DEFAULT_JSONDBFS_PATH;
let collection_name = (typeof collectionName !== 'undefined' && collectionName !== null) ? collectionName : DEFAULT_JSONDBFS_COLLECTIONNAME;
let return_variable_name = (typeof returnVariableName !== 'undefined' && returnVariableName !== null) ? returnVariableName : DEFAULT_RETURN_VARIABLE_NAME;

if (typeof operation === 'undefined' || !SUPPORTED_OPERATIONS.includes(operation))
    throw new Error("ERROR: Invalid or undefined operation.  Parameter 'operation' must be specified");

switch (operation) {
    case "insert":
        if (typeof (data) === 'undefined' || data === null)
            throw new Error("  ERROR:  Parameter 'data' must be specified for 'insert' operations");
        break;
    case "update":
    case "upsert":
        if (typeof (data) === 'undefined' || data === null)
            throw new Error("  ERROR:  Parameter 'data' must be specified for 'update', 'upsert' operations");
        if (typeof (criteria) === 'undefined' || criteria === null)
            throw new Error("  ERROR:  criteria json must be specified for 'update' and 'upsert' operations");
        break;
    case "count":
    case "get":
    case "retrieve":
    case "delete":
        if (typeof (criteria) === 'undefined' || criteria === null)
            throw new Error("  ERROR:  Parameter 'criteria' must be specified for 'count', 'get', 'retrieve' and 'delete' operations");
        break;
}

/*
 *  Database Functions
 */
function getCount(database, collectionName) {
    if (verbose)
        console.log("getCount()");
    return new Promise((resolve) => {
        database[collectionName].count(function (err, count) {
            if (verbose)
                console.log("  insertResults.count", count);
            resolve(count);
        });
    });
}
function insertResults(database, collectionName, data) {
    if (verbose)
        console.log("insertResults()");
    return new Promise((resolve) => {
        database[collectionName].insert(data, (err, document) => {
            if (verbose)
                console.log("  insertResults.document", document);
            resolve(document);
        });
    });
}
function updateResults(database, collectionName, criteria, data) {
    if (verbose)
        console.log("insertResults()");
    return new Promise((resolve) => {
        database[collectionName].update(criteria, data, { upsert: false, multi: true, retObj: true }, (err, document) => {
            if (verbose)
                console.log("  updateResults.document", document);
            resolve(document);
        });
    });
}
function upsertResults(database, collectionName, criteria, data) {
    if (verbose)
        console.log("insertResults()");
    return new Promise((resolve) => {
        database[collectionName].update(criteria, data, { upsert: true, multi: true, retObj: true }, (err, document) => {
            if (verbose)
                console.log("  insertResults.document", document);
            resolve(document);
        });
    });
}
function retrieveResults(database, collectionName, criteria) {
    if (verbose)
        console.log("retrieveResults()");
    return new Promise((resolve) => {
        database[collectionName].find(criteria, { multi: false }, (err, document) => {
            if (verbose)
                console.log("  retrieveResults.document", document);
            resolve(document);
        });
    });
}
function deleteResults(database, collectionName, criteria) {
    if (verbose)
        console.log("deleteResults()");
    return new Promise((resolve) => {
        database[collectionName].remove(criteria, { multi: true }, (err, document) => {
            if (verbose)
                console.log("  deleteResults.document", document);
            resolve(document);
        });
    });
}

return new Promise((resolve, reject) => {

    let driver = 'disk'; // 'disk' 'memory'
    let options = {
        "path": database_path,
        "driver": driver,
        memory: {
            flush: true,
            flushInterval: 10
        }
    }

    JSONDBFSDriver.connect([collection_name], options, (err, database) => {

        switch (operation) {
            case "insert":
                insertResults(database, collection_name, data)
                    .then((document) => {
                        console.log(return_variable_name, document);
                        exports[return_variable_name] = document;
                        resolve(document);
                    })
                    .catch((err) => {
                        reject(err);
                    });

                break;
            case "update":
                updateResults(database, collection_name, criteria, data)
                    .then((document) => {
                        console.log(return_variable_name, document);
                        exports[return_variable_name] = document;
                        resolve(document)
                    })
                    .catch((err) => {
                        reject(err);
                    });
                break;
            case "upsert":
                upsertResults(database, collection_name, criteria, data)
                    .then((document) => {
                        console.log(return_variable_name, document);
                        exports[return_variable_name] = document;
                        resolve(document)
                    })
                    .catch((err) => {
                        reject(err);
                    });
                break;
            case "count":
                getCount(database, collection_name)
                    .then((count) => {
                        console.log(return_variable_name, count);
                        exports[return_variable_name] = count;
                        resolve(count);
                    })
                    .catch((err) => {
                        reject(err);
                    });
                break;
            case "get":
            case "retrieve":
                retrieveResults(database, collection_name, criteria)
                    .then((document) => {
                        console.log(return_variable_name, document);
                        exports[return_variable_name] = document;
                        resolve(document)
                    })
                    .catch((err) => {
                        reject(err);
                    });
                break;
            case "delete":
                deleteResults(database, collection_name, criteria)
                    .then((document) => {
                        console.log(return_variable_name, document);
                        exports[return_variable_name] = document;
                        resolve()
                    })
                    .catch((err) => {
                        reject(err);
                    });
                break;
        }

    });

});
