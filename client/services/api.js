(function() {
    var apiServices = angular.module('ApiServices', []);
    var _apiAction = function($http, $cookieStore, method, url, requiresAuthentication) {
        return function(data) {
            var req = {
                method: method,
                url: '/api/'+url,
                data: {grant_type: 'client_credentials'}
            };
            if (data) _.extend(req.data, data);
            if (requiresAuthentication)
                req.headers = {Authorization: 'Bearer '+$cookieStore.get('labour_token')};
            return $http(req);
        }
    };

    apiServices.factory('Accounts', ['$http', '$cookieStore',
        function($http, $cookieStore){
            return {
                signup:         _apiAction($http, $cookieStore, 'POST', 'accounts/signup',  false),
                login:          _apiAction($http, $cookieStore, 'POST', 'accounts/login',   false),
                createApiKey:   _apiAction($http, $cookieStore, 'POST', 'accounts/apiKeys', true),
                getApiKeys:     _apiAction($http, $cookieStore, 'GET',  'accounts/apiKeys', true)
            };
        }]);
})();

