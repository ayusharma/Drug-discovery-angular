'use strict';

/**
 * @ngdoc directive
 * @name yeomanD3App.directive:diseaseviz
 * @description
 * # diseaseviz
 */
angular.module('yeomanD3App')
  .directive('diseaseviz', function (d3dataService) {
    return {
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        d3dataService.getDataofAsthma().then(function(data){
          scope.data = data.data;

          var w = parseInt(attrs.width);
          var h = parseInt(attrs.height);
          var p = parseInt(attrs.padding);

          var svg = d3.select(element[0])
          .append('svg')
          .attr('width',w)
          .attr('height',h)






        });

        element.text('this is the diseaseviz directive');
      }
    };
  });
