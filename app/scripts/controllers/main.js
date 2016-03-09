'use strict';

/**
 * @ngdoc function
 * @name yeomanD3App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the yeomanD3App
 */
angular.module('yeomanD3App')
  .controller('MainCtrl',['$rootScope','$scope','Diseases',function ($rootScope,$scope,Diseases) {

    $rootScope.diseases = {};
    $rootScope.diseases.userselected = []
    $rootScope.diseases.default = ''

    //data for visualizatons
    //setting null at startup
    $rootScope.diseases.vizdata = null;

    //function to get diseases
    function get_diseases(){
      Diseases.getAll().then(function(data){
        console.log(data.data.hits)
        $rootScope.diseases.names = data.data.hits;
        // $rootScope.form = ''
      })
    }

    //call get_diseases
    get_diseases();


    $rootScope.onSelectChange = function(){


      if (_.findIndex($rootScope.diseases.userselected, $rootScope.diseases.default) < 0) {
        $rootScope.diseases.userselected.push($rootScope.diseases.default)

        Diseases.selected($rootScope.diseases.userselected).then(function(res){
            $rootScope.diseases.vizdata = res.data;
        })

      }
       else {

      }


    }

    $rootScope.submitDiseaseCode = function(){
      if ($rootScope.diseases.crawlcode != null){

        Diseases.crawl($rootScope.diseases.crawlcode).then(function(res){
          console.log(res)
          get_diseases();
        })

      } else {
        alert("Please enter a value")
      }
    }

    //function to draw dendogram visualization

    $rootScope.dendogram = function(){

      console.log($rootScope.diseases.vizdata.hits.hits);

      var data = $rootScope.diseases.vizdata.hits.hits;

      var width = $('.viz').width(),
          height = 1000000,
          margin = {top:50,bottom:100,right:50,left:50}

      var w = width-margin.left-margin.right,
          h = height-margin.top-margin.bottom;

      var svg = d3.select(".viz")
      .append("svg")
    	.attr("width",w + margin.left + margin.right)
    	.attr("height",h + margin.top + margin.bottom)
    	.append("g")
    	.attr("transform","translate("+margin.left+","+margin.top+")");

      var diseases = svg.append('g').attr("class","disease").selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("id",function(d,i){
                      return d._source.name.replace(/\s/g, "")
                    })
                    .attr("cx",width/10)
                    .attr("cy",function(d,i){
                      return i*40
                    })
                    .attr("r",10)



      var diseasetext = svg.append('g').attr("class","disease-text").selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("width",100)
        .attr("height",30)
        .attr("x",width/8)
        .attr("y",function(d,i){
            return i*40
        })
        .text(function(d,i){
          return d._source.name
        })

     var targetSymbols = []

     data.forEach(function (k) {

       k._source.data.forEach(function(p){
         console.log(p)
         if(_.findIndex(targetSymbols, p.target.symbol) < 0) {
           targetSymbols.push(p.target.symbol)
         }
       })

     })

      data.forEach(function(k){

        var diseasePositionLeft = $('#'+k._source.name.replace(/\s/g, "") ).attr('cx')
        var diseasePositionTop = $('#'+k._source.name.replace(/\s/g, "") ).attr('cy')


        // console.log(k)


        var target = svg.append('g').attr("class","target").selectAll("circle")
            .data(targetSymbols)
            .enter()
            .append("circle")
            .attr("id",function (d,i) {
              return d.replace(/\s/g, "")
            })
            .attr("cx",width-300)
            .attr("cy",function(d,i){
              return i*40
            })
            .attr("r",10)


        var text = svg.append('g').attr("class","target-text").selectAll("text")
          .data(targetSymbols)
          .enter()
          .append("text")
          .attr("width",100)
          .attr("height",30)
          .attr("x",width-400)
          .attr("y",function(d,i){
              return i*40
          })
          .text(function(d,i){
            return d
          })


        var line = svg.append("g").attr("class","line").selectAll("line")
            .data(targetSymbols)
            .enter()
            .append("line")
            .attr("x1",diseasePositionLeft)
            .attr("y1",diseasePositionTop)
            .attr("x2",function(d,i){
              return $('#'+d.replace(/\s/g, "") ).attr('cx')
            })
            .attr("y2",function(d,i){
              return $('#'+d.replace(/\s/g, "") ).attr('cy')
            })
            .attr("stroke","blue")
            .attr("stroke-width","0.4")

      })

    }


  }
]);
