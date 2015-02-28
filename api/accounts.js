var Account     = require('../models/account');
var _ = require('underscore');

var Login = function() {
    this.name       = 'login';
    this.path       = '/accounts/login';
    this.permission = 'public';

    this.post = function(req, res) {
        if (!req.body.email)     return res.send(403, 'missing_arg_email');
        if (!req.body.password)  return res.send(403, 'missing_arg_password');
        var authcRequest = {
            username: req.body.email, //username can be an email address too
            password: req.body.password
        };
        req.stormpath.authenticateAccount(authcRequest, function onAuthcResult(err, result) {
            //if successful, the result will have an account field with the successfully authenticated account:
            if (err) return res.send(401, err);
            console.log('Account '+req.body.email+' authenticated');
            result.getAccount(function(err, account) {
                if (err) return res.send(401, err);
                var token = null;
                function complete() {
                    req.stormpath.authenticateApiRequest({request: req}, function(err, result) {
                        if (err) return res.send(401, err);
                        res.json({
                            account: {
                                email: account.email,
                                givenName: account.givenName,
                                surname: account.surname
                            },
                            token: result.getAccessToken()
                        });
                    });
                }
                account.getApiKeys(function(err,result){
                    if (err) return res.send(401, err);
                    var apiKeys = result.items;
                    if (apiKeys.length > 0) {
                        req.headers['authorization'] = 'Basic '+new Buffer(apiKeys[0].id+':'+apiKeys[0].secret).toString('base64');
                        complete();
                    } else {
                        account.createApiKey(function(err,apiKey){
                            if (err) return res.send(401, err);
                            req.headers['authorization'] = 'Basic '+new Buffer(apiKey.id+':'+apiKey.secret).toString('base64');
                            complete();
                        });
                    }

                });
            });
        });
    };
};

var Signup = function() {
    this.name       = 'signup';
    this.path       = '/accounts/signup';
    this.permission = 'public';

    this.post = function(req, res) {
        if (!req.body.email)     return res.send(403, 'missing_arg_email');
        if (!req.body.givenName) return res.send(403, 'missing_arg_givenName');
        if (!req.body.surname)   return res.send(403, 'missing_arg_surname');
        if (!req.body.password)  return res.send(403, 'missing_arg_password');

        var account = new Account({
            email: req.body.email,
            givenName: req.body.givenName,
            surname: req.body.surname,
            status: 'Initial'
        });

        // save the account and check for errors
        account.save(function(err) {

            if (err) {
                console.error(err);
                return res.send(err);
            }
            console.log('account '+account.email+' stored. ');
            var stormAccount ={
                email: account.email,
                givenName: account.givenName,
                surname: account.surname,
                password: req.body.password
            };
            req.stormpath.createAccount(stormAccount, function(err, account) {
                if (err) {
                    Account.delete({ email: account.email});
                    console.error(err);
                    return res.send(401, err);
                }
                Account.update({ email: account.email }, { $set: { status: 'pending' }});
                res.json(account);
            });
        });
    };

    return this;
};

var ApiKeys = function() {
    this.name       = 'apiKeys';
    this.path       = '/accounts/apiKeys';
    this.permission = 'api';

    this.post = function(req, res) {
        req.account.createApiKey(function(err, result) {
            if (err) return res.send(401, err);

            res.json({id: result.id});
        });
    };

    this.get = function(req, res) {
        req.account.getApiKeys(function(err,collectionResult){
            if (err) return res.send(401, err);
            var result = [];
            if (collectionResult.items && collectionResult.items.length > 0)
                _.forEach(collectionResult.items, function(apiKey){
                    result.push({
                        id: apiKey.id,
                        status: apiKey.status
                    });
                });
            res.json(result);
        });
    };

    this.put = function(req, res) {

    };

    this.delete = function(req, res) {

    }
};

module.exports.login    = new Login();
module.exports.signup   = new Signup();
module.exports.apiKeys  = new ApiKeys();