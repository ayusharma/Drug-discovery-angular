'use strict';

/**
 * @ngdoc overview
 * @name yeomanD3App
 * @description
 * # yeomanD3App
 *
 * Main module of the application.
 */
angular
  .module('yeomanD3App', [
    'ngRoute',
    'ngSanitize',
    'angular-loading-bar'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  })

  .run(function($rootScope){
    $rootScope.diseases = {};
    $rootScope.diseases.userselecteddatatypes = ["all"];

  });
