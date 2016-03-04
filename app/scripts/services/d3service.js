'use strict';

/**
 * @ngdoc service
 * @name yeomanD3App.d3Service
 * @description
 * # d3Service
 * Factory in the yeomanD3App.
 */
angular.module('yeomanD3App')

.service('d3Service', function () {
  // Service logic
  // ...

  var meaningOfLife = 42;

  var bardata = [5,20,100,15,20]

  // Public API here
  return {
    someMethod: function () {
      return meaningOfLife;
    }
    ,
    barMethod: function () {
      return bardata;
    }
  };
})

.service('d3dataService',function($http){

  var dataService = {};

  dataService.getDataofAsthma = function(){

   return  $http.get('https://www.targetvalidation.org/api/latest/search?size=99999&from=0&q=asthma').then(function(res){
      return res;
    })
  }

  return dataService;

})
