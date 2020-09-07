'use strict'

var express = require('express')
var app = express()
var fs = require('fs');
var path = require('path');

var basePath = path.join(__dirname, 'data');

app.get('/accounts', function (req, res) {

    var psu = req.header('X-Payment-Service-User');
    console.log('Reading accounts of %s', psu);
    fs.readFile(path.join(basePath, 'account.out.json'), function(err, data) {
        var accounts = JSON.parse(data);
        res.end(JSON.stringify(accounts, null, 4));
    });
});

app.get('/accounts/:accountId', function (req, res) {

    fs.readFile(path.join(basePath, 'account.out.json'), function(err, data) {
        var accountId = req.params.accountId;
        console.log("Requesting details of account %s", accountId);
        var accounts = JSON.parse(data);

        var found = false;
        accounts.forEach(function(account) {
            if (account.AccountId === accountId) {
                found = true;
                res.end(JSON.stringify(account, null, 4));
            }
        });

        if (!found) {
            res.status(404).send('Not found');
        }
    });
});

var server = app.listen(process.env.PORT || 3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Open Banking - Data Store Mock app at https://%s:%s", host, port);
});