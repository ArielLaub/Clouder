(function() {
    var app = angular.module('LabourAdmin', ['ngRoute', 'ngCookies', 'NavbarApp', 'AccountsApp', 'ApiServices']);


    app.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
                when('/login', {
                    templateUrl: 'views/login.html',
                    controller: 'LoginController'
                }).
                when('/home', {
                    templateUrl: 'views/home.html'
                }).
                when('/apiKeys', {
                    templateUrl: 'views/apiKeys.html',
                    controller: 'ApiKeysController'
                }).
                otherwise({
                    redirectTo: '/home'
                });
        }]);
})();
