var _           = require('underscore');
var stormpath   = require('stormpath');
var mongoose    = require('mongoose');
var config      = require('./config');

mongoose.connect(config.mongoDbConnectionString);
var client = new stormpath.Client({apiKey: new stormpath.ApiKey( config.stormpathApiKey, config.stormpathApiSecret)});
client.getApplication(config.stormpathApplicationHref, function(err, application) {
    if (err) throw new Error(err);
    var express     = require('express');
    var morgan      = require('morgan');
    var bodyParser  = require('body-parser');
    var api = require('./api');
    var router = express.Router();

    var commandByPath = {};
    router.use(function(req, res, next) {
        // do logging
        var caller = 'anonymous';
        var command = commandByPath[req.path];
        req.stormpath = application;
        if (command && command.permission == 'api') {
            application.authenticateApiRequest({request: req}, function(err, authResult){
                if (err) {
                    console.log('ERROR: '+JSON.stringify(err));
                    return res.send(403, err);
                }
                authResult.getAccount(function(err, account){
                    if (err) return next(err);
                    console.log('api execute: '+req.originalUrl + '('+account.email+')');
                    req.account = account;
                    next();
                });
            });
        } else {
            console.log('api execute: '+req.originalUrl + '('+req.ip+')');
            next();
        }
    });

    _.forEach(_.keys(api), function(groupName) {
        console.log('binding api group '+groupName);
        _.forEach(_.keys(api[groupName]), function(commandName) {
            var command = api[groupName][commandName];
            console.log('binding api command '+commandName+' to '+command.path);
            var route = router.route(command.path);
            if (command.post) route.post(command.post);
            if (command.get) route.get(command.get);
            if (command.put) route.put(command.put);
            if (command.delete) route.delete(command.delete);
            commandByPath[command.path] = command;
        });
    });

    var app         = express();
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use('/api', router);
    app.use('/', express.static(__dirname + '/client'));
    app.post('/oauth/token',function (req,res){
        application.authenticateApiRequest({
            request: req
        }, function(err,authResult){
            if(!err){
                res.json(authResult.tokenResponse);
            }
        });
    });
    app.listen(config.httpServerPort);
    console.log('Magic happens on port ' + config.httpServerPort);
});

