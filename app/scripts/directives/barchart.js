'use strict';

/**
 * @ngdoc directive
 * @name yeomanD3App.directive:barchart
 * @description
 * # barchart
 */
angular.module('yeomanD3App')
  .directive('barchart', function (d3Service) {
    return {
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        var data = d3Service.barMethod();

        var w = parseInt(attrs.width);
        var h = parseInt(attrs.height);
        var p = parseInt(attrs.padding);

        var svg = d3.select(element[0])
        .append('svg')
        .attr('width',w)
        .attr('height',h)

        svg.selectAll('rect')
        .data(data).enter()
        .append('rect')
        .attr('x',function(d,i){
          return (w/data.length)*i
        })
        .attr('y',function(d,i){
          return h-(d*4)
        })
        .attr('width',(w/data.length)-p)
        .attr('height',function(d){
          return d*4;
        })


      }
    };
  });
