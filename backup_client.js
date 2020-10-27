/**
dynamic_client.js
Jake Levy
Sept 2020
A simple client for the dynamic server.  But this is boring.
Look at the server in your web-browser. (http://localhost:3000)

For this to work, the server must already be running.
1) Start the node server
2) run this program in separate window/tab OR look at the server in a web-
browser

*/
var http = require("http");

//Create the options object to help set up the connection
var options = {
  hostname: "localhost",
  port: "3000",
};

//generate a request
http
  .request(options, function (response) {
    //declare a string to hold the text-based response
    let serverResp = "";

    //when the response recieves data, add the data to the string
    response.on("data", function (chunk) {
      serverResp += chunk;
    });

    //when its done, print the response
    response.on("end", function () {
      console.log("Response Status: " + response.statusCode);
      console.log(serverResp);
    });
  })
  .end(); //end the request
