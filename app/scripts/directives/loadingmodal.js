'use strict';

/**
 * @ngdoc directive
 * @name yeomanD3App.directive:loadingmodal
 * @description
 * # loadingmodal
 */
angular.module('yeomanD3App')
  .directive('loadingmodal', function () {
    return {
      templateUrl: 'views/loadingmodal.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        // element.text('this is the loadingmodal directive');
      },
      controller : function($rootScope){
        $rootScope.modaltext = ''
      }
    };
  });
