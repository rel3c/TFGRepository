/*
 ************************************************************************************
 * Copyright (C) 2015-2016 Openbravo S.L.U.
 * Licensed under the Openbravo Commercial License version 1.0
 * You may obtain a copy of the License at http://www.openbravo.com/legal/obcl.html
 * or in the legal folder of this module distribution.
 ************************************************************************************
 */
/**
 * Class which launch Openbravo fake system server to listen Product, Price and Services petition:
 * - localhost:8082/openbravo/ws/com.openbravo.but.integration.master.load/product
 * - localhost:8082/openbravo/ws/com.openbravo.but.integration.master.load/price
 * - localhost:8082/openbravo/ws/com.openbravo.but.integration.master.load/service
 * 
 * @author Kepa Choperena
 * 
 */
var express = require('express'),
    app = express(),
    fs = require('fs'),
    http = require('http'),
    url = require('url'),
    request = require('request'),
    encodedData = new Buffer('openBravo:openBravo').toString('base64'), //AUTH Credentials
	randomValue = Math.random(),
	reqBody = "",  // Request body string format
    jsonValue, // Request body JSON format
    jsonObj; // Response body JSON

//Init Server and start listening
var server = app.listen(8082, function(req, res) {
    console.log("Openbravo Fake server listening at http://localhost:%s", server.address().port);
	console.log("  -> /openbravo/ws/com.openbravo.but.integration.master.load/product");
	console.log("  -> /openbravo/ws/com.openbravo.but.integration.master.load/price");
	console.log("  -> /openbravo/ws/com.openbravo.but.integration.master.load/service");
});

//Post petition /openbravo/ws/com.openbravo.but.integration.master.load/product
app.post('/openbravo/ws/com.openbravo.but.integration.master.load/product', function(req, resp) {
    req.on('data', function(data) {
		if(randomValue + 0.1 >= 0.5){
			reqBody += data.toString();
        	jsonValue = JSON.parse(reqBody);
			console.log('|> Product update process');
		    console.log('|--> JSON get.. \n');
			console.log(jsonValue);
			jsonObj = {
				   "status":"200",
				   "message":"Ok"
				};
			resp.type('application/json;charset=UTF-8');
			resp.send(jsonObj);
		}else{
			console.log('|> Product update process refused');
			randomValue = Math.random();
            if (randomValue >= 0.75) {
                console.log('|--> Send Status Code 400: ');
                console.log('|	      A_004:  Unknown output format requested.');
                console.log('|');
                jsonObj = {
				   "status":"400",
				   "code":" A_004",
				   "message":"Unknown output format requested."
				};
				resp.type('application/json;charset=UTF-8');
                resp.send(jsonObj);
            } else if (randomValue >= 0.5) {
                console.log('|--> Send Status Code 400: ');
                console.log('|	      A_003:  API call (input parameter “request”) not specified, or unknown API call.');
                console.log('|');
                jsonObj = {
				   "status":"400",
				   "code":" A_003",
				   "message":"API call (input parameter “request”) not specified, or unknown API call."
				};
				resp.type('application/json;charset=UTF-8');
                resp.send(jsonObj);
            } else if (randomValue >= 0.25) {
                console.log('|--> Send Status Code 503: ');
                console.log('|	      A_002:  Cannot connect to account database.');
                console.log('|');
                jsonObj = {
				   "status":"503",
				   "code":" A_002",
				   "message":"Cannot connect to account database."
				};
				resp.type('application/json;charset=UTF-8');
                resp.send(jsonObj);
            } else if (randomValue >= 0) {
                console.log('|--> Send Status Code 503: ');
                console.log('|	      A_001:  Service is under maintenance, please try again later.');
                console.log('|');
                jsonObj = {
				   "status":"503",
				   "code":" A_001",
				   "message":"Service is under maintenance, please try again later."
				};
				resp.type('application/json;charset=UTF-8');
                resp.send(jsonObj);
            }
		}
        reqBody = "";
		randomValue = Math.random();
    });
});

//Post petition /openbravo/ws/com.openbravo.but.integration.master.load/price
app.post('/openbravo/ws/com.openbravo.but.integration.master.load/price', function(req, resp) {
    req.on('data', function(data) {
        if(randomValue + 0.1 >= 0.5){
			reqBody += data.toString();
        	jsonValue = JSON.parse(reqBody);
			resp.type('application/text;charset=UTF-8');
			console.log('|> Price update process');
		    console.log('|--> JSON get.. \n');
			console.log(jsonValue);
			jsonObj = {
				   "status":"200",
				   "message":"Ok"
				};
			resp.type('application/json;charset=UTF-8');
			resp.send(jsonObj);
		}else{
			console.log('|> Price update process refused');
			randomValue = Math.random();
            if (randomValue >= 0.75) {
                console.log('|--> Send Status Code 400: ');
                console.log('|	      A_004:  Unknown output format requested.');
                console.log('|');
                jsonObj = {
				   "status":"400",
				   "code":" A_004",
				   "message":"Unknown output format requested."
				};
				resp.type('application/json;charset=UTF-8');
                resp.send(jsonObj);
            } else if (randomValue >= 0.5) {
                console.log('|--> Send Status Code 400: ');
                console.log('|	      A_003:  API call (input parameter “request”) not specified, or unknown API call.');
                console.log('|');
                jsonObj = {
				   "status":"400",
				   "code":" A_003",
				   "message":"API call (input parameter “request”) not specified, or unknown API call."
				};
				resp.type('application/json;charset=UTF-8');
                resp.send(jsonObj);
            } else if (randomValue >= 0.25) {
                console.log('|--> Send Status Code 503: ');
                console.log('|	      A_002:  Cannot connect to account database.');
                console.log('|');
                jsonObj = {
				   "status":"503",
				   "code":" A_002",
				   "message":"Cannot connect to account database."
				};
				resp.type('application/json;charset=UTF-8');
                resp.send(jsonObj);
            } else if (randomValue >= 0) {
                console.log('|--> Send Status Code 503: ');
                console.log('|	      A_001:  Service is under maintenance, please try again later.');
                console.log('|');
                jsonObj = {
				   "status":"503",
				   "code":" A_001",
				   "message":"Service is under maintenance, please try again later."
				};
				resp.type('application/json;charset=UTF-8');
                resp.send(jsonObj);
            }
		}
        reqBody = "";
		randomValue = Math.random();
    });
});

//Post petition /openbravo/ws/com.openbravo.but.integration.master.load/service
app.post('/openbravo/ws/com.openbravo.but.integration.master.load/service', function(req, resp) {
    req.on('data', function(data) {
    	if(randomValue + 0.1 >= 0.5){
			reqBody += data.toString();
        	jsonValue = JSON.parse(reqBody);
			console.log('|> Service update process');
		    console.log('|--> JSON get.. \n');
			console.log(jsonValue);
			jsonObj = {
				   "status":"200",
				   "message":"Ok"
				};
		}else{
			console.log('|> Service update process refused');
			randomValue = Math.random();
            if (randomValue >= 0.75) {
                console.log('|--> Send Status Code 400: ');
                console.log('|	      A_004:  Unknown output format requested.');
                console.log('|');
                jsonObj = {
				   "status":"400",
				   "code":" A_004",
				   "message":"Unknown output format requested."
				};
            } else if (randomValue >= 0.5) {
                console.log('|--> Send Status Code 400: ');
                console.log('|	      A_003:  API call (input parameter “request”) not specified, or unknown API call.');
                console.log('|');
                jsonObj = {
				   "status":"400",
				   "code":" A_003",
				   "message":"API call (input parameter “request”) not specified, or unknown API call."
				};
            } else if (randomValue >= 0.25) {
                console.log('|--> Send Status Code 503: ');
                console.log('|	      A_002:  Cannot connect to account database.');
                console.log('|');
                jsonObj = {
				   "status":"503",
				   "code":" A_002",
				   "message":"Cannot connect to account database."
				};
            } else if (randomValue >= 0) {
                console.log('|--> Send Status Code 503: ');
                console.log('|	      A_001:  Service is under maintenance, please try again later.');
                console.log('|');
                jsonObj = {
				   "status":"503",
				   "code":" A_001",
				   "message":"Service is under maintenance, please try again later."
				};
            }
		}
		resp.send(jsonObj);
        reqBody = "";
		randomValue = Math.random();
    });
});
