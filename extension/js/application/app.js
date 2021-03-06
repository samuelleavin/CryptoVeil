'use strict';
window.app = angular.module('CryptoveilExt', ['ui.router', 'ui.bootstrap', 'fsaPreBuilt', 'ngMaterial']);

app.config(

    function ($urlRouterProvider, $locationProvider, $mdThemingProvider) {

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');
    
    $mdThemingProvider.theme('default')
      .primaryPalette('green', {
          'default': '400',
          'hue-1': '100',
          'hue-2': '200',
          'hue-3': '700'
    })

});


// This app.run is for controlling access to specific states.
app.run(function ($rootScope, AuthService, $state, BackgroundFactory) {

    // The given state requires an authenticated user.
    var destinationStateRequiresAuth = function (state) {
        return state.data && state.data.authenticate;
    };

        $rootScope.isLoggedIn = false;

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

    });

});