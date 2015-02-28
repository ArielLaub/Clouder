var _addProperty = function(k, v, w) { Object.defineProperty(module.exports, k, { value: v, writable: !!w}); };

_addProperty('httpServerPort',
    process.env.PORT || 8080);

_addProperty('stormpathApplicationHref',
    process.env.STORMPATH_APPLICATION_HREF || 'https://api.stormpath.com/v1/applications/6MUBQuemYC5PRyraVXtuxM');

_addProperty('stormpathApiKey',
    process.env.STORMPATH_API_KEY_ID || '25PVBCEZC2DE9PJ7EIAIW575E');

_addProperty('stormpathApiSecret',
    process.env.STORMPATH_API_SECRET || 'mOiM5W3yVYE3EjG2RhFyoqK6yIB6ab/noOa5BnlrbF0');

_addProperty('mongoDbConnectionString',
    process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017/labour-cloud');




