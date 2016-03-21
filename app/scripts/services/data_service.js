'use strict';

var baseUrlDisease = 'https://www.targetvalidation.org/api/latest/association?disease='

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

  // dataService.getAll = function(){



  //  return  $http.get(baseUrl+'diseases/names').then(function(res){
  //     return res.data;
  //   })
  // }

  dataService.crawl = function(code){

		var req = {
			method:'POST',
			url:'http://localhost:5000/crawl',
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

  dataService.selected = function(code,arr){

    var url = baseUrlDisease+code
    var param = ''
    if(arr.length){
      arr.map(function(k){
        param = param+'&filterbydatatype='+k
      })
    }

		var req = {
			method:'GET',
      url: url+param,
			headers: {
				'Content-Type': 'application/json'
			}
		};


		return $http(req).then(function(res){
			return res;
		});

  }
  //
  // dataService.DatatypeSelected = function(selected_datatypes,selected_diseases){
  //
	// 	var req = {
	// 		method:'POST',
	// 		url: baseUrl+ 'diseases/datatypes',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		data:{
	// 			'selected_datatypes': selected_datatypes,
  //       'selected_diseases': selected_diseases
	// 		}
	// 	}
  //
	// 	return $http(req).then(function(res){
	// 		return res;
	// 	});
  //
  // }

  return dataService;

});
