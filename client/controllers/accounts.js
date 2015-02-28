(function() {
    var app = angular.module('AccountsApp', []);

    app.controller('LoginController', ['$scope', 'Accounts', function($scope, Accounts) {
        if (!$scope.email) $scope.email = '';
        if (!$scope.password) $scope.password = '';
        if (!$scope.givenName) $scope.givenName = '';
        if (!$scope.surname) $scope.surname = '';
        
        $scope.signup = function() {
            var account = {
                email: $scope.email,
                password: $scope.password,
                givenName: 'Ariel',
                surname: 'Laub'
            };
            Accounts.signup(account).success(function(data) {
                alert('signup success: '+JSON.stringify(data));
            }).error(function(err) {
                alert('signup failed: '+JSON.stringify(err));
            });
        };

        $scope.login = function() {
            if ($scope.loggingIn) return;

            $scope.loggingIn = true;
            var credentials = {
                email: $scope.email,
                password: $scope.password
            };
            Accounts.login(credentials).success(function(result) {
                delete $scope.loginFailed;
                delete $scope.loggingIn;
                $scope.$emit('login', result);
            }).error(function(err) {
                $scope.loginFailed = true;
                delete $scope.loggingIn;
            });
        }
    }]);

    app.controller('ApiKeysController', ['$scope', '$document', 'Accounts', function($scope, $document, Accounts) {
        $scope.apiKeys = [];
        $document.ready(function(){
            Accounts.getApiKeys().success(function(data) {
               $scope.apiKeys = data;
            }).error(function(err) {
                alert('error fetching api keys '+err);
            });
        });

        $scope.createApiKey = function() {
            Accounts.createApiKey().success(function(data) {
                $scope.apiKeys.push(data);
                alert('api key created successfully');
            }).error(function(err) {
                alert('api key creation failed: '+JSON.stringify(err));
            });
        };
    }]);
})();