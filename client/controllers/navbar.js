(function() {
    var app = angular.module('NavbarApp', []);

    app.controller('NavbarController', ['$rootScope', '$cookieStore', '$location', function($rootScope, $cookieStore, $location) {
        var loggedInAccount = $cookieStore.get('labour_account');
        if (loggedInAccount)
            $rootScope.loggedInAccount = loggedInAccount;

        $rootScope.$on('login', function(event, result) {
            $rootScope.loggedInAccount = result.account;
            $cookieStore.put('labour_account', result.account);
            $cookieStore.put('labour_token', result.token);
            $rootScope.changeView('home');
        });

        $rootScope.$on('logout', function() {
            delete $rootScope.loggedInAccount;
            $cookieStore.remove('labour_account');
            $cookieStore.remove('labour_token');
            $rootScope.changeView('login');
        });

        $rootScope.changeView = function(view){
            $location.path(view); // path not hash
        };

        $rootScope.getCurrentView = function() {
            return $location.path();
        };

        $rootScope.isCurrentView = function(view) {
            var loc = this.getCurrentView();
            return (loc.indexOf(view) === 0 || loc.indexOf('/'+view) === 0);
        }
    }]);
})();