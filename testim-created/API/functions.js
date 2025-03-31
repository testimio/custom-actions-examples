

const axios = require('axios');
const config = require('./config'); 

const fs = require('fs');
const FormData = require('form-data');

/*

Ian Flanagan tricentis 2025
Code is as-is and there is no ongoing support, use at your own risk
Detailed information regarding the testim.io API can be found here 
https://editor.swagger.io/?url=https://raw.githubusercontent.com/testimio/public-openapi/main/api.yaml

npm install axios is required to run the script, comment in or out any function then run

node functions.js 

*/


/*

Tests

get tests
put tests (change test status
post tests (execute test by name)
---not done 
get tests by name
get tests list all TMS test case IDS
)

*/

// general Testim.io API operations (methods)

function getTestStatus() {
  
    const apiUrl = `${config.apiBaseUrl}tests`;
    const apiKey = config.apiKey;
  
    // Define Request headers
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json'
    };
  
    // Make the API request
    return axios.get(apiUrl, { headers });
  }

function updateTestStatus(testId, newStatus) {

 // const myEndpoint = 'https://api.testim.io/tests/';
  const apiUrl = `${config.apiBaseUrl}tests/${testId}/status`;

  const payload = {
    branch: 'master',
    status: newStatus
  };

  const headers = {
    'Authorization': `Bearer ${config.apiKey}`,
    'Content-Type': 'application/json'
  };

  return axios.put(apiUrl, payload, { headers });
}


function runTest(testID) {
    
    const apiUrl = `${config.apiBaseUrl}tests/run/${testID}`;
    const apiKey = config.apiKey;

    console.log(`starting to execute a test by ID ${testID}`);
    console.log(`URL for request is ${apiUrl}`);

  
    // payload info
    const payload = {
      baseUrl: 'http://demo.com/',
      branch: 'master',
      grid: 'TESTIM-GRID',
      parallel: 1,

      resultLabels: [
        'IanAPITest'
      ],
      retries: 0,
      timeout: 600,
      turboMode: true
    };
  

    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  
    // Make the API request
    return axios.post(apiUrl, payload, { headers });
  }


function runTestPlan(testPlanID) {
    // API endpoint URL
    const apiUrl = `${config.apiBaseUrl}test-plans/run/${testPlanID}`;

    console.log(`Running test plan based on ID: ${testPlanID}`);
    console.log(`endpoint is ${apiUrl}`);
  
    // API key for authorization
    // const apiKey = '';
  
    // Request payload
    const payload = {
      branch: 'master',
      parallel: 1,
      resultLabels: [
        'TestPlanAPI'
      ],
      retries: 0,
      timeout: 600,
      turboMode: true
    };
  
    // Request headers
    const headers = {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  
    // Make the API request
    return axios.post(apiUrl, payload, { headers });
  }

  function runSuite(suiteID) {
    // API endpoint URL
    const apiUrl = `${config.apiBaseUrl}suites/run/${suiteID}`;
  
    // Request payload
    const payload = {
      baseUrl: config.baseURL,
      branch: config.branch,
      grid: config.grid,
      parallel: 1,
      resultLabels: [
        config.myResultLablel[0]
      ],
      retries: 0,
      timeout: 600,
      turboMode: config.turboMode[0]
    };
  
    // Request headers
    const headers = {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  
    // Make the API request
    return axios.post(apiUrl, payload, { headers });
  }
  

  function runLabels(myLableID) {
    // API endpoint URL
    const apiUrl = `${apiBaseUrl}labels/run/${myLableID}`;

    console.log(`Running runLabels() Method now`);
    console.log(`URL used is: ${apiUrl}`);
  
    // Request payload
    const payload = {
      baseUrl: 'http://demo.com/',
      branch: config.branch,
      grid: config.grid,
      parallel: 1,
      params: {
        paramName: 'paramValue'
      },
      resultLabels: [
        config.myResultLablel[1]
      ],
      retries: 0,
      timeout: 600,
      turboMode: true
    };
  
    // Request headers
    const headers = {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  
    // Make the API request
    return axios.post(apiUrl, payload, { headers });
  }
  

function getExecutionDetails(pagenumber,testpageSize, testfromDate,testtoDate, status,browser,execname, testbranch) {
    // API endpoint URL
    const apiUrl = `${config.apiBaseUrl}runs/executions`;
  
    // Query parameters
    const params = {
      page: pagenumber,
      pageSize: testpageSize,
      fromDate: testfromDate,
      toDate: testtoDate,
      status: status,
      browser: browser,
      name: execname,
      branch: testbranch
    };
  

    // Request headers
    const headers = {
      'Authorization': `Bearer ${config.apiKey}`,
      'Accept': 'application/json'
    };
  
    // Make the API request
    return axios.get(apiUrl, { params, headers });
  }


function getExecutionDetails(executionID) {
    // API endpoint URL
    const apiUrl = `${config.apiBaseUrl}runs/executions/${executionID}`;
  
    // Request headers
    const headers = {
      'Authorization': `Bearer ${config.apiKey}`,
      'Accept': 'application/json'
    };
  
    // Make the API request
    return axios.get(apiUrl, { headers });
  }

  function writeToFile(data, filePath) {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, data, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve('Data has been written to the file successfully.');
      });
    });
  }


function readFromFile(filePath) {
    return new Promise((resolve, reject) => {
      // Read data from the file asynchronously
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });
  }


// mobile operations 

function getApplications(token) {
    const apiUrl = 'https://api.testim.io/mobile/applications';
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${config.mobileapiKey}`
    };
  
    return axios.get(config.apiMobileBaseUrl, { headers });
  }


  async function uploadApplication(token, filePath, fileName) {
    
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath), fileName);
  
    try {
      const response = await axios.post(config.apiMobileBaseUrl, formData, {
        headers: {
          ...headers,
          ...formData.getHeaders() // Required for multipart/form-data
        }
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
}


// comment out to call any functions

/*
updateTestStatus(config.myTestID, config.myTestStatusDraft[3])
  .then(response => {
    console.log('Response:', response.data);
  })
  .catch(error => {
    console.error('Error:', error.response.data);
  });


getTestStatus()
.then(response => {
  console.log('Response:', response.data);
})
.catch(error => {
  console.error('Error:', error.response.data);
});
*/

/*
runTest(config.myTestID)
  .then(response => {
    console.log('Response:', response.data);
  })
  .catch(error => {
    console.error('Error:', error.response.data);
  });


  runTestPlan(config.myTestPlanID)
  .then(response => {
    console.log('Response:', response.data);
  })
  .catch(error => {
    console.error('Error:', error.response.data);
  });
  

  runSuite(config.mySuiteID)
  .then(response => {
    console.log('Response:', response.data);
  })
  .catch(error => {
    console.error('Error:', error.response.data);
  });


getExecutionDetails(1,300,'2024-04-01', '2024-05-01','failed','Chrome','Demo', 'master')
.then(response => {
  console.log('Response:', response.data);
})
.catch(error => {
  console.error('Error:', error.response.data);
});

  runSuite(config.mySuiteID)
    .then(response => {
      //console.log('Response:', response.data[0]);
    const executionId = response.data.executionId;
    console.log('Execution ID:', executionId);
    })
    .catch(error => {
      console.error('Error:', error.response.data);
    });


getExecutionDetails(executionID)
  .then(response => {
    console.log('Execution details:', response.data);
  })
  .catch(error => {
    console.error('Error:', error.response.data);
  });


let executionID = '';
readFromFile(config.logFile)
  .then(data => {
    console.log('Data from file:', data);
    executionID = data;


getExecutionDetails(executionID)
.then(response => {
  console.log('Execution details:', response.data);
})
.catch(error => {
  console.error('Error:', error.response.data);
});
    
  })
  .catch(error => {
    console.error('Error reading file:', error);
  });


  getApplications(config.mobileapiKey)
  .then(response => {
    console.log('Applications:', response.data);
  })
  .catch(error => {
    console.error('Error:', error.response.data);
  });


  */
 
  /*

uploadApplication(config.mobileapiKey, config.filePath, 'MyOnlineShop-v2.apk')
  .then(data => {
    console.log('Upload successful:', data);
  })
  .catch(error => {
    console.error('Upload failed:', error);
  });
  */


  
  getApplications(config.mobileapiKey)
  .then(response => {
    console.log('Applications:', JSON.stringify(response.data));
  })
  .catch(error => {
    console.error('Error:', error.response.data);
  });
  

   /*
uploadApplication(config.mobileapiKey, config.filePath, 'MyOnlineShop-v2.apk')
.then(data => {
  console.log('Upload successful:', data);
})
.catch(error => {
  console.error('Upload failed:', error);
});
*/
