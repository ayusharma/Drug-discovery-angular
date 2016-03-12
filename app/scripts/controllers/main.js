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


    //function to get a unique value from array
      function unique(m){
        var prev = m[0];
        var m_sort = [];
        m_sort.push(prev);
        for (var i = 0; i < m.length; i++) {
          if(m[i] != prev){
            m_sort.push(m[i]);
            prev = m[i];
          }
        };
        return m_sort;
      }


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

    function get_disease_data(){
      Diseases.selected($rootScope.diseases.userselected).then(function(res){
            $rootScope.diseases.vizdata = res.data;
        })
    }


    $rootScope.onSelectChange = function(){


      if (_.findIndex($rootScope.diseases.userselected, $rootScope.diseases.default) < 0) {
        $rootScope.diseases.userselected.push($rootScope.diseases.default)

        get_disease_data()

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

    $rootScope.removeDisease = function($event, diseaseName){
      console.log(diseaseName)
      console.log($rootScope.diseases.userselected)
      _.remove($rootScope.diseases.userselected,function (n) {
        get_disease_data()
        return n === diseaseName
      })

    }

    $rootScope.dendogram = function () {
      dendogram();
    }

    //function to draw dendogram visualization
    /////////////////////////////
    //////////////////////////////
    /////////////////////////////



    function dendogram(){


      var targetSymbols = []
      var datatypes = []


      d3.select("svg").remove();

      var data = $rootScope.diseases.vizdata.hits.hits;

      var datatypeFlag = 'all'

      var width = $('.viz').width(),
          height = 1000000,
          margin = {top:50,bottom:100,right:50,left:50}

      var w = width-margin.left-margin.right,
          h = height-margin.top-margin.bottom;



     data.forEach(function (k) {

      datatypes = _.uniqBy( _.concat(datatypes, k._source.datatypes))

       k._source.data.forEach(function(p){

        //  if(targetSymbols.indexOf (p.target.symbol) < 0) {
        //    targetSymbols.push(p.target.symbol)
        //  }

         p.datatypes.forEach(function(z){

           if($rootScope.diseases.userselecteddatatypes.indexOf("all") >= 0 && z.association_score >= 0 ) {
             targetSymbols.push(p.target.symbol)
             console.log("dlfmekmf kk")
           } else if ($rootScope.diseases.userselecteddatatypes.indexOf(z.datatype) >= 0 && z.association_score > 0){
             targetSymbols.push(p.target.symbol)
             console.log(z.datatype)
           }

         })

       })

     })

     targetSymbols = _.uniqBy(targetSymbols)


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
                   .attr("cx",300)
                   .attr("cy",function(d,i){
                     return i*40
                   })
                   .attr("r",5)



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


     var buttons = d3.select(".buttons-d3").selectAll("button")
                  .data(datatypes)
                  .enter()
                  .append("button")
                  .attr("class","btn btn-default")
                  .attr("width",100)
                  .attr("height",20)
                  .attr("fill",'#ccc')
                  .attr("x",0)
                  .attr("y",function(d,i){
                    return i*40
                  })
                  .text(function (d) {
                    return d
                  })
                  .on('click' , function(d){

                    _.remove($rootScope.diseases.userselecteddatatypes,function (n) {
                      return n === 'all'
                    })

                    if($rootScope.diseases.userselecteddatatypes.indexOf(d) < 0) {
                        $rootScope.diseases.userselecteddatatypes.push(d)

                        dendogram();
                    }

                  });


      data.forEach(function(k){

        var diseasePositionLeft = $('#'+k._source.name.replace(/\s/g, "") ).attr('cx')
        var diseasePositionTop = $('#'+k._source.name.replace(/\s/g, "") ).attr('cy')

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
            .attr("r",5)


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
            .data(k._source.data)
            .enter()
            .append("line")
            .attr("id",function(d,i){
              return "line"+d
            })
            .attr("x1",diseasePositionLeft)
            .attr("y1",diseasePositionTop)
            .attr("x2",function(d,i){
              if(d)
              return $('#'+d.target.symbol.replace(/\s/g, "") ).attr('cx')
            })
            .attr("y2",function(d,i){
              return $('#'+d.target.symbol.replace(/\s/g, "") ).attr('cy')
            })
            .attr("stroke","red")
            .attr("stroke-width","0.4")

      })

    }

  }
]);
