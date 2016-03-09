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
          var json = data

          console.log(json)

          // var diseaseSet = ['asthma']

          var margin = {top:50,bottom:100,right:50,left:50}

          var w = parseInt(attrs.width)-margin.left-margin.right;
          var h = parseInt(attrs.height)-margin.top-margin.bottom;;
          var p = parseInt(attrs.padding);

          var svg = d3.select(element[0])
          .append("svg")
        	.attr("width",w + margin.left + margin.right)
        	.attr("height",h + margin.top + margin.bottom)
        	.append("g")
        	.attr("transform","translate("+margin.left+","+margin.top+")");


          // d3.json(scope.data, function(error, json) {

          var force = d3.layout.force()
          .gravity(.05)
          .distance(100)
          .charge(-100)
          .size([w, h]);

              var edges = [];
                json.Links.forEach(function(e) {
                var sourceNode = json.Nodes.filter(function(n) { return n.Id === e.Source; })[0],
                targetNode = json.Nodes.filter(function(n) { return n.Id === e.Target; })[0];

                edges.push({source: sourceNode, target: targetNode, value: e.Value});
                });

                console.log(edges)

              force
                  .nodes(json.Nodes)
                  .links(edges)
                  .start();

              var link = svg.selectAll(".link")
                  .data(edges)
                .enter().append("line")
                  .attr("class", "link");

              var node = svg.selectAll(".node")
                  .data(json.Nodes)
                .enter().append("g")
                  .attr("class", "node")
                  .call(force.drag);

              node.append("circle")
                  .attr("class", "node")
                  .attr("r", 5);

              // node.append("svg:a")
              //     .attr("xlink:href", function(d){return d.Url;})
              //     .append("text")
              //     .attr("dx", 12)
              //     .attr("dy", ".35em")
              //     .text(function(d) { return d.Name})


              force.on("tick", function() {
                link.attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });

                node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
              });
            // });

        });

        // element.text('this is the diseaseviz directive');
      }
    };
  });
