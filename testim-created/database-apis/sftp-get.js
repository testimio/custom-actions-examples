/**
 *  SFTP - File Get
 * 
 *  Parameters
 * 
 *      fullFilePath (JS)
 *      hostName (JS)
 *      portNumber (JS)
 *      userName (JS)
 *      userPass (JS)
 * 
 *  Returns
 * 
 *      sftpFileData
 * 
 *      https://openbase.com/js/ssh2-sftp-client#org5950004
 * 
 */

//let Client = require('ssh2-sftp-client');
let sftp = new Client();

let file_name = undefined;
if (typeof fullFilePath !== 'undefined' && fullFilePath !== null)
    file_name = fullFilePath;
if (typeof file_name === undefined)
    throw new Error('fullFilePath is undefined')

let user_name = undefined;
if (typeof userName !== 'undefined' && userName !== null)
    user_name = userName;
if (typeof user_name === undefined)
    throw new Error('userName is undefined')

let user_pass = undefined;
if (typeof userPass !== 'undefined' && userPass !== null)
    user_pass = userPass;
if (typeof user_pass === undefined)
    throw new Error('userPass is undefined')

let host_name = undefined;
if (typeof hostName !== 'undefined' && hostName !== null)
    host_name = hostName;
if (typeof host_name === undefined)
    throw new Error('hostName is undefined')

let port_number = "22";
if (typeof portNumber !== 'undefined' && portNumber !== null)
    port_number = portNumber;


function csvToJSON(csv) {

    // Convert the data to String and
    // split it in an array
    var array = csv.toString().split("\r");

    // All the rows of the CSV will be
    // converted to JSON objects which
    // will be added to result in an array
    let result = [];

    // The array[0] contains all the
    // header columns so we store them
    // in headers array
    let headers = array[0].split(", ")

    // Since headers are separated, we
    // need to traverse remaining n-1 rows.
    for (let i = 1; i < array.length - 1; i++) {
        let obj = {}

        // Create an empty object to later add
        // values of the current row to it
        // Declare string str as current array
        // value to change the delimiter and
        // store the generated string in a new
        // string s
        let str = array[i]
        let s = ''

        // By Default, we get the comma separated
        // values of a cell in quotes " " so we
        // use flag to keep track of quotes and
        // split the string accordingly
        // If we encounter opening quote (")
        // then we keep commas as it is otherwise
        // we replace them with pipe |
        // We keep adding the characters we
        // traverse to a String s
        let flag = 0
        for (let ch of str) {
            if (ch === '"' && flag === 0) {
                flag = 1
            }
            else if (ch === '"' && flag == 1) flag = 0
            if (ch === ', ' && flag === 0) ch = '|'
            if (ch !== '"') s += ch
        }

        // Split the string using pipe delimiter |
        // and store the values in a properties array
        let properties = s.split("|")

        // For each header, if the value contains
        // multiple comma separated data, then we
        // store it in the form of array otherwise
        // directly the value is stored
        for (let j in headers) {
            if (properties[j].includes(", ")) {
                obj[headers[j]] = properties[j]
                    .split(", ").map(item => item.trim())
            }
            else obj[headers[j]] = properties[j]
        }

        // Add the generated object to our
        // result array
        result.push(obj)
    }

    // Convert the resultant array to json and
    // generate the JSON output file.
    let json = JSON.stringify(result);

    return (json);
}

return new Promise((resolve, reject) => {

    sftp.connect({
        host: host_name,
        port: port_number,
        username: user_name,
        password: user_pass,
    })
        .then(() => {
            return sftp.cwd();
        })
        .then(p => {
            console.log(`Remote working directory is ${p}`);
        })
        .then(() => {
            return sftp.get(file_name);
        }).then(data => {

            let json = csvToJSON(csv) ;
            exportsTest.sftpFileData = json;
            console.log("FileData:", data);
            console.log("FileDataAsJSON:", json);
            sftp.end();
            resolve();

        }).catch(err => {
            console.log(err, 'catch error');
            reject(err);
        });

});