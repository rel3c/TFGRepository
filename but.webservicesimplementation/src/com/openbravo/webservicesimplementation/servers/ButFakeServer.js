/*
 ************************************************************************************
 * Copyright (C) 2015-2016 Openbravo S.L.U.
 * Licensed under the Openbravo Commercial License version 1.0
 * You may obtain a copy of the License at http://www.openbravo.com/legal/obcl.html
 * or in the legal folder of this module distribution.
 ************************************************************************************
 */
/**
 * Class which launch BUT fake system server to listen nomenclature petition and orders reception:
 * - localhost:31300/rest/BUT_WS_Nomenclature/v1_0/services/pub/nomenclature/Domaine
 * - localhost:31300/rest/BUT_SaleOrder/v1_0/services/pub/SaleOrder
 * 
 * @author Kepa Choperena
 * 
 */
var express = require('express'),
    app = express(),
    fs = require('fs'),
    http = require('http'),
    url = require('url'),
    req = require('request'),
    obj = JSON.parse(fs.readFileSync('/home/openbravo/Entornos/FakeEnvironment/FakeServer/files/arc-response-nomenclature.json', 'utf8')),
    jsonObj,
    newDate = new Date();

//Init Server and start listening
var server = app.listen(31300, function(error, req, res) {
	var datetime = "Connection: " + newDate.today() + " @ " + newDate.timeNow();
	console.log(datetime);
    console.log("BUT Fake Server listening at http://localhost:%s", server.address().port);
	console.log("  --> /rest/BUT_WS_Nomenclature/v1_0/services/pub/nomenclature/Domaine");
	console.log("  --> /rest/BUT_SaleOrder/v1_0/services/pub/SaleOrder");
	console.log("");
});

//Post petition /rest/BUT_WS_Nomenclature/v1_0/services/pub/nomenclature/Domaine
var nomenclature = app.post('/rest/BUT_WS_Nomenclature/v1_0/services/pub/nomenclature/Domaine', function(req, resp) {
	console.log('|> Nomenclature');
    var randomValue;  // Request random value.
    req.on('data', function(data) {
		randomValue = Math.random();
		if(true){	
			resp.setHeader('200','Success');
			resp.type('application/json;charset=UTF-8');
			console.log('|--> Send Product Category JSON..');
			console.log('|');
			resp.send(obj);
		}else{
			randomValue = Math.random();	
			if(randomValue >= 0.75){
				console.log('|--> Send Status Code 400: ');
				console.log('|	      A_004:  Unknown output format requested.');
				console.log('|');
				jsonObj = {
				   "status":"400",
				   "code":"A_001",
				   "message":"Unknown output format requested."
				};
				resp.type('application/json;charset=UTF-8');
                resp.send(jsonObj);
			}else if(randomValue >= 0.5){
				console.log('|--> Send Status Code 400: ');
				console.log('|	      A_003:  API call (input parameter “request”) not specified, or unknown API call.');
				console.log('|');
				jsonObj = {
				   "status":"400",
				   "code":"A_003",
				   "message":"API call (input parameter “request”) not specified, or unknown API call."
				};
				resp.type('application/json;charset=UTF-8');
                resp.send(jsonObj);
			}else if(randomValue >= 0.25){
				console.log('|--> Send Status Code 503: ');
				console.log('|	      A_002:  Cannot connect to account database.');
				console.log('|');
				jsonObj = {
				   "status":"503",
				   "code":"A_002",
				   "message":"Cannot connect to account database."
				};
				resp.type('application/json;charset=UTF-8');
                resp.send(jsonObj);
			}else if(randomValue >= 0){
				console.log('|--> Send Status Code 503: ');
				console.log('|	      A_001:  Service is under maintenance, please try again later.');
				console.log('|');
				 jsonObj = {
				   "status":"503",
				   "code":"A_001",
				   "message":"Service is under maintenance, please try again later."
				};
				resp.type('application/json;charset=UTF-8');
                resp.send(jsonObj);
			}
		}
		
    });
}).on("error", function(e){
	console.log("Got error: " + e.message);	
}); 

//Post petition /rest/BUT_SaleOrder/v1_0/services/pub/SaleOrder
var order = app.post('/rest/BUT_SaleOrder/v1_0/services/pub/SaleOrder', function(req, resp) {
    var randomValue, // Request random value.
    reqBody = "",  // Request body string format
    jsonValue
    isJson = true;
	console.log('|> Order receipt');
    req.on('data', function(data) {
		try {
			reqBody += data.toString();
			jsonValue = JSON.parse(reqBody);
		} catch (e) {
			isJson = false;
		};
		if(isJson){
			randomValue = Math.random() + 0.1;
			if ((randomValue) >= 0.5) {
				console.log('|--> Send Order Response JSON..');
				console.log('|');
				jsonObj = {
					   "DocumentNo": jsonValue['DocumentNo'],
					   "DocumentStatus" : "Complete",
					   "status":"200",
					   "code":"0",
					   "message":"Ok"
					};

				resp.setHeader('200','Success');
				resp.setHeader("Content-Type", "application/json");
				resp.send(jsonObj);
				
			} else {
				randomValue = Math.random();
				if (randomValue >= 0.75) {
					console.log('|--> Send Status Code 400: ');
					console.log('|	      A_004:  Unknown output format requested.');
					console.log('|');
					jsonObj = {
					   "status":"400",
					   "code":"-1",
					   "message":"Unknown output format requested."
					};

					resp.setHeader('400','Unknown output format requested');
					resp.setHeader("Content-Type", "application/json");
					resp.send(jsonObj);
				} else if (randomValue >= 0.5) {
					console.log('|--> Send Status Code 400: ');
					console.log('|	      A_003:  API call (input parameter “request”) not specified, or unknown API call.');
					console.log('|');
					jsonObj = {
					   "status":"400",
					   "code":"-1",
					   "message":"API call (input parameter “request”) not specified, or unknown API call."
					};
					resp.setHeader('400','Unknown output format requested');
					resp.setHeader("Content-Type", "application/json");
					resp.send(jsonObj);
				} else if (randomValue >= 0.25) {
					console.log('|--> Send Status Code 503: ');
					console.log('|	      A_002:  Cannot connect to account database.');
					console.log('|');
					jsonObj = {
					   "status":"503",
					   "code":"-1",
					   "message":"Cannot connect to account database."
					};
					resp.setHeader('503','Cannot connect to account database');
					resp.setHeader("Content-Type", "application/json");
					resp.send(jsonObj);
				} else if (randomValue >= 0) {
					console.log('|--> Send Status Code 503: ');
					console.log('|	      A_001:  Service is under maintenance, please try again later.');
					console.log('|');
					jsonObj = {
					   "status":"503",
					   "code":"-1",
					   "message":"Service is under maintenance, please try again later."
					};
					resp.setHeader('503','ervice is under maintenance');
					resp.setHeader("Content-Type", "application/json");
					resp.send(jsonObj);
				}
			}
		}else{
			console.log('|--> Send Status Code 400: ');
			console.log('|	      A_003:  API call (input parameter “request”) not specified, or unknown API call.');
			console.log('|');
			jsonObj = {
					   "status":"400",
					   "code":"-1",
					   "message":"API call (input parameter “request”) not specified, or unknown API call."
			};
			resp.setHeader('400','Cannot connect to account database');
			resp.setHeader("Content-Type", "application/json");
			resp.send(jsonObj);
		}
    });
}); 

app.use(function(err, req, res, next) {
  console.log('Launch error..');
  res.send(500);
});

// For todays date;
Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}


