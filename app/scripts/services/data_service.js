'use strict';

var baseUrl = 'http://localhost:5000/'

/**
 * @ngdoc service
 * @name yeomanD3App.dataService
 * @description
 * # dataService
 * Service in the yeomanD3App.
 */
angular.module('yeomanD3App')

.service('Diseases', function ($http) {

  var dataService = {};

  dataService.getAll = function(){

   return  $http.get(baseUrl+'diseases/names').then(function(res){
      return res.data;
    })
  }

  dataService.crawl = function(code){

		var req = {
			method:'POST',
			url:baseUrl +'crawl',
			headers: {
				'Content-Type': 'application/json'
			},
			data:{
				'code': code
			}
		}

		return $http(req).then(function(res){
			return res;
		});

  }

  dataService.selected = function(selected_values){

		var req = {
			method:'POST',
			url: baseUrl+ 'diseases/selected',
			headers: {
				'Content-Type': 'application/json'
			},
			data:{
				'selected_values': selected_values
			}
		}

		return $http(req).then(function(res){
			return res;
		});

  }

  return dataService;

});
