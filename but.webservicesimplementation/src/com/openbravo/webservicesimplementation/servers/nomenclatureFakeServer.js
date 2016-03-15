/*
 ************************************************************************************
 * Copyright (C) 2015-2016 Openbravo S.L.U.
 * Licensed under the Openbravo Commercial License version 1.0
 * You may obtain a copy of the License at http://www.openbravo.com/legal/obcl.html
 * or in the legal folder of this module distribution.
 ************************************************************************************
 */
/**
 * Class which launch BUT fake system server to listen nomenclature petition:
 * - localhost:31300/rest/BUT_WS_Nomenclature/v1_0/services/pub/nomenclature/Domaine
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
    obj = JSON.parse(fs.readFileSync('/home/openbravo/Entornos/FakeEnvironment/FakeServer/files/arc-response-nomenclature.json', 'utf8'));

//Init Server and start listening
var server = app.listen(31300, function(req, res) {
    console.log("BUT Nomenclature Fake Server listening at http://localhost:%s", server.address().port);
	console.log("  -> /rest/BUT_WS_Nomenclature/v1_0/services/pub/nomenclature/Domaine");
});

//Post petition /openbravo/ws/com.openbravo.but.integration.master.load/product
app.post('/rest/BUT_WS_Nomenclature/v1_0/services/pub/nomenclature/Domaine', function(req, resp) {
    var randomValue; // Request random value.
    req.on('data', function(data) {
        randomValue = Math.random();
        if ((randomValue) >= 0.5) {
            resp.setHeader('200', 'Ok');
            resp.type('application/json;charset=UTF-8');
            console.log('|--> Send Product Category JSON..');
            console.log('|');
            resp.json(obj);
        } else {
            randomValue = Math.random();
            if (randomValue >= 0.75) {
                console.log('|--> Send Status Code 400: ');
                console.log('|	      A_004:  Unknown output format requested.');
                console.log('|');
                resp.setHeader('400', 'Service Unavailable');
                resp.type('Content-Type": "text/plain; charset=UTF-8');
                resp.write('A_004: Unknown output format requested.');
                resp.end();
            } else if (randomValue >= 0.5) {
                console.log('|--> Send Status Code 400: ');
                console.log('|	      A_003:  API call (input parameter “request”) not specified, or unknown API call.');
                console.log('|');
                resp.setHeader('400', 'Service Unavailable');
                resp.type('Content-Type": "text/plain; charset=UTF-8');
                resp.write('A_003: API call (input parameter “request”) not specified, or unknown API call.');
                resp.end();
            } else if (randomValue >= 0.25) {
                console.log('|--> Send Status Code 503: ');
                console.log('|	      A_002:  Cannot connect to account database.');
                console.log('|');
                resp.setHeader('503', 'Service Unavailable');
                resp.type('Content-Type": "text/plain; charset=UTF-8');
                resp.write('A_002: Cannot connect to account database.');
                resp.end();
            } else if (randomValue >= 0) {
                console.log('|--> Send Status Code 503: ');
                console.log('|	      A_001:  Service is under maintenance, please try again later.');
                console.log('|');
                resp.setHeader('503', 'Service Unavailable');
                resp.type('Content-Type": "text/plain; charset=UTF-8');
                resp.write('A_001: Service is under maintenance, please try again later.');
                resp.end();
            }
        }
    });
});
