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
      .otherwise({
        redirectTo: '/'
      });
  })

  .run(function($rootScope){
    //disease object
    $rootScope.diseases = {};
    //array to store the user selected datatype
    $rootScope.diseases.userselecteddatatypes = ["all"];

  });
