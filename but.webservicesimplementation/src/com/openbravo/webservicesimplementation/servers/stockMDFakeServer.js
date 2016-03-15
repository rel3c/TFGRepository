/*
 ************************************************************************************
 * Copyright (C) 2015-2016 Openbravo S.L.U.
 * Licensed under the Openbravo Commercial License version 1.0
 * You may obtain a copy of the License at http://www.openbravo.com/legal/obcl.html
 * or in the legal folder of this module distribution.
 ************************************************************************************
 */
/**
 * Class which launch BUT fake system server to listen StockMD petition:
 * - localhost:5555/rest/BUT_WS_WebPos_Stock/v1_0/resources/stock/
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
    encodedData = new Buffer('openBravo:openBravo').toString('base64'); 

//Init Server and start listening
var server = app.listen(5555, function(req, res) {
    console.log("BUT StockMD Fake Server listening at http://localhost:%s", server.address().port);
	console.log("  -> /rest/BUT_WS_WebPos_Stock/v1_0/resources/stock/");
});

//Post petition
app.post('/rest/BUT_WS_WebPos_Stock/v1_0/resources/stock/', function(req, resp) {
    var jsonObject, // Response JSON object
    reqBody = "",  // Request body string format
    jsonValue; // Request body JSON format
    req.on('data', function(data) {
        if (req.headers.authorization) {
            var credentialsBase64 = req.headers.authorization.split(' ')[1];
            if (encodedData.localeCompare(credentialsBase64) === 0) {
                reqBody += data.toString();
                jsonValue = JSON.parse(reqBody);
                //If it's OtherStore petition
                if (jsonValue['enteteTechnique'].nom_operation === "GET_DISPO_VENTE_DETAIL_v1_0") {
                    //If store id unknown -- change if sentence
                    if (jsonValue['idMagasin'] === '777') {
                        jsonObject = {
                            getDispoVenteDetailResponse: {
                                erreur: {
                                    code: 'F_001',
                                    libelle: 'L\'identifiant du magasin est inconnu.'
                                },
                                idMagasin: '777',
                                idProduit: '9990000148959'
                            }
                        };
                    } else {
                        jsonObject = {
                            getDispoVenteDetailResponse: {
                                idMagasin: '108',
                                idProduit: '9990000148959',
                                qteDispoVenteTotale: '7',
                                listeProduitDepot: [{
                                    qteDispoVenteDepot: '7',
                                    idDepot: '1080000100002',
                                    flagDepotDefaut: '0',
                                    typeDepot: '2',
                                    depotSuggere: '1507'
                                }, {
                                    qteDispoVenteDepot: '0',
                                    idDepot: '1080000100003',
                                    flagDepotDefaut: '1',
                                    typeDepot: '12',
                                    depotSuggere: '5'
                                }, {
                                    qteDispoVenteDepot: '2',
                                    idDepot: '1080000100001',
                                    flagDepotDefaut: '0',
                                    typeDepot: '1',
                                    depotSuggere: '0'
                                }],
                                nbRecherche: '0'
                            }
                        };
                    }
                    //If it's store petition	
                } else if (jsonValue['enteteTechnique'].nom_operation === 'GET_DISPO_VENTE_v1_0') {
                    //If store idMgasin or idProduitList are empty
                    if (!jsonValue['idMagasinListe'].idMagasin.length || !jsonValue['idProduitListe'].idProduit.length) {
                        jsonObject = {
                            getDispoVenteResponse: {
                                erreur: {
                                    code: 'F_007',
                                    libelle: 'Veuillez renseigner au moins un magasin et un produit ou ean13 en paramètre.'
                                }
                            }
                        };
                    } else {
                        jsonObject = {
                            getDispoVenteResponse: {
                                listeMagasin: [{
                                    idMagasin: '005',
                                    listeProduit: [{
                                        erreur: {
                                            code: 'F_003',
                                            libelle: 'Le produit ne dispose pas de stock.'
                                        },
                                        idProduit: '1080000073023',
                                        ean13: '2010810391555',
                                        qteDispoVenteTotale: '0',
                                        qteDispoVenteTotaleParDepot: '0',
                                        qteDispoVenteTotaleParSDV: '0',
                                        qteDispoVenteTotaleParExpo: '0'
                                    }, {
                                        idProduit: '9990000065196',
                                        ean13: '2099901058010',
                                        qteDispoVenteTotale: '0',
                                        qteDispoVenteTotaleParDepot: '0',
                                        qteDispoVenteTotaleParSDV: '0',
                                        qteDispoVenteTotaleParExpo: '0'
                                    }, {
                                        idProduit: '9990000129761',
                                        ean13: '3185280350704',
                                        qteDispoVenteTotale: '0',
                                        qteDispoVenteTotaleParDepot: '0',
                                        qteDispoVenteTotaleParSDV: '0',
                                        qteDispoVenteTotaleParExpo: '1'
                                    }]
                                }, {
                                    idMagasin: '108',
                                    listeProduit: [{
                                        idProduit: '1080000073023',
                                        ean13: '2010810391555',
                                        qteDispoVenteTotale: '0',
                                        qteDispoVenteTotaleParDepot: '0',
                                        qteDispoVenteTotaleParSDV: '0',
                                        qteDispoVenteTotaleParExpo: '1'
                                    }, {
                                        idProduit: '9990000065196',
                                        ean13: '2099901058010',
                                        qteDispoVenteTotale: '0',
                                        qteDispoVenteTotaleParDepot: '0',
                                        qteDispoVenteTotaleParSDV: '0',
                                        qteDispoVenteTotaleParExpo: '0'
                                    }, {
                                        idProduit: '9990000129761',
                                        ean13: '3185280350704',
                                        qteDispoVenteTotale: '2',
                                        qteDispoVenteTotaleParDepot: '1',
                                        qteDispoVenteTotaleParSDV: '1',
                                        qteDispoVenteTotaleParExpo: '0'
                                    }]
                                }]
                            }
                        };
                    }
                }
                resp.type('application/json;charset=UTF-8');
                resp.send(jsonObject);
                console.log('|--> JSON response send.. \n');
            } else {
                resp.writeHead(401, 'Access Denied: incorrect username or password');
                resp.end();
            }
        } else {
            resp.writeHead(401, 'Access Denied: authentication required');
            resp.end();
        }
    });
});
