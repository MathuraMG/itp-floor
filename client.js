/*
  HTTP/HTTPS request example to Enertiv
  Does basic Oauth2 exchange to get access token
  then makes first API request with the token.
  This is a quick-and-dirty solution, and should be improved upon.
  You'll need to add a file, cred.js, to the same directory as this file,
  with the following in it:

  var creds = {
      username : your_username,
      password : your_password,
      clientID : your_client_id,
      clientSecret : your_client_secret
  }
  module.exports = creds;

  created 25 Feb 2015 by Tom Igoe
  updated 06 Jan 2016 by John Farrell
*/


var https = require('https');
var querystring = require('querystring');
var clientData;

// Bring in login information from our cred file
var loginData = querystring.stringify({
	'client_id': process.env.ENERTIV_CLIENT_ID,
	'client_secret': process.env.ENERTIV_CLIENT_SECRET,
	'grant_type': 'password',
	'username': process.env.ENERTIV_USERNAME,
	'password': process.env.ENERTIV_PASSWORD,
});

// set up the HTTPS request options. You'll modify and
// reuse this for subsequent calls:
var options = {
  rejectUnauthorized: false,
  method: 'POST',
  host: 'api.enertiv.com',
  port: 443,
  path: '/oauth2/access_token/',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': loginData.length
  }
};

// Module
var enertiv = function() {
  var self = this;
  var callback;
  var accessToken;

  // Authenticate with Enertiv API
  // Login runs callback to saveToken
  this.login = function(cb){
    callback = cb;
		console.log('inside login');
    var request = https.request(options, self.saveToken);  // start it
		console.log('inside login -- got request');
      request.write(loginData);                           // add  body of  POST request
			console.log(loginData);
			console.log('inside login -- got logindata');
      request.end();
			console.log('inside login -- end');
  };

  // Parse response and save auth token
  // Pass that token to further API calls
  this.saveToken = function(response){
    var result = '';    // String to hold the response
		console.log('inside saveToken');
    // As each chunk comes in, add it to the result string:
    response.on('data', function (data) {
			console.log('checking result in saveToken');
			console.log(result);
      result += data;
    });

    // When the final chunk comes in, grab the access token
    // Then run our callback function
    response.on('end', function () {

			console.log(result);
			result = JSON.parse(result);
			console.log(result);
			console.log('inside saveToken -- got result');
      accessToken = result.access_token;
			console.log('inside saveToken -- got accesToken');
      callback();
    });
  };

  // Generic function for API calls using access token
  this.apiCall = function (path, cb){

    var callback = cb;
    options.method = 'GET';  // Change to a GET request
    options.path = path;     // Set our path to the argument
    options.headers = {      // Change authorization header to include our token
      'Authorization': 'Bearer ' + accessToken
    }

    // Make the API call
    request = https.get(options, function (response) {
      var result = '';
      // As each chunk comes in, add it to the result string:
      response.on('data', function (data) {
        result += data;
      });

      request.on('error', function (err){
        console.log(err);
      });
      // When the final chunk comes in, print it out
      // Then run our callback function
      response.on('end', function () {
        //console.log("result: " + result);
        callback(result);
      });
    });
  };
}

module.exports = enertiv;
