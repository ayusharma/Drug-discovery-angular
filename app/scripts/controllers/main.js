'use strict';

/**
 * @ngdoc function
 * @name yeomanD3App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the yeomanD3App
 */
angular.module('yeomanD3App')
  .controller('MainCtrl',['$rootScope','$scope','$route','Diseases',function ($rootScope,$scope,$route,Diseases) {


    $rootScope.diseases.userselected = []
    $rootScope.diseases.default = ''
    $rootScope.diseases.datatypes = []


    //data for visualizatons
    //setting null at startup
    $rootScope.diseases.vizdata = null;

    //function to get diseases
    function get_diseases(){
      console.log("fired");
      Diseases.getAll().then(function(data){
        console.log(data.data.hits)
        $rootScope.diseases.names = data.data.hits;
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


      if ($rootScope.diseases.userselected.indexOf($rootScope.diseases.default) < 0) {
        $rootScope.diseases.userselected.push($rootScope.diseases.default)

        get_disease_data()

      }
       else {

      }


    }

    $rootScope.submitDiseaseCode = function(){
      if ($rootScope.diseases.crawlcode != null){
        $rootScope.modaltext = "Crawling Data"
        $('#myModal').modal("show")
        Diseases.crawl($rootScope.diseases.crawlcode).then(function(res){
          $rootScope.modaltext=""
          $('#myModal').modal("hide")
          get_diseases();
          console.log(res);
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

      if($rootScope.diseases.userselected.length) {
        $('#myModal').modal("show");
        dendogram()

       }
      else {
      alert("Please select a disease")
      }

    }

    $rootScope.updateViz= function() {

      _.remove($rootScope.diseases.userselecteddatatypes,function (n) {
        return n === 'all'
      })




      $rootScope.diseases.datatypes.forEach(function(k){
        if(k.value) {
            $rootScope.diseases.userselecteddatatypes.push(k)
            // k.value = true
        }
        else {
          _.remove($rootScope.diseases.userselecteddatatypes,function (n) {
                console.log("remoed")
                // k.value = false
                return n.datatype === k.datatype
              })
              if($rootScope.diseases.userselecteddatatypes.length === 0){
                      $rootScope.diseases.userselecteddatatypes.push('all')
                  }
        }
      })

      console.log($rootScope.diseases.userselecteddatatypes);


      // if(k === d.datatype) {
      //   this.sele = k
      // }
      // if() {
      //   console.log("dhjkfbhj");
      //   $scope.k = checked ;
      // } else {
      //
      // }

      // if ($(event.target).hasClass("active")) {
      //
      //   $(event.target).removeClass("active")
      //
      //     _.remove($rootScope.diseases.userselecteddatatypes,function (n) {
      //       console.log("remoed")
      //       return n.datatype === d.datatype
      //     })
      //     if($rootScope.diseases.userselecteddatatypes.length === 0){
      //         $rootScope.diseases.userselecteddatatypes.push('all')
      //     }
      // } else {
      //
      // $(event.target).addClass("active")
      // }

      dendogram();

    }
    //function to draw dendogram visualization
    /////////////////////////////
    //////////////////////////////
    /////////////////////////////



    function dendogram(){


      var targetSymbols = []



      d3.select("svg").remove();
      // d3.select(".buttons-d3").remove();


      var data = $rootScope.diseases.vizdata.hits.hits;

      console.log(data);

      var datatypeFlag = 'all'

      var width = $('.viz').width(),
          height = 1000000,
          margin = {top:50,bottom:100,right:50,left:50}

      var w = width-margin.left-margin.right,
          h = height-margin.top-margin.bottom;



     data.forEach(function (k) {



      // datatypes = _.uniqBy( _.concat(datatypes, k._source.datatypes))

       k._source.datatypes.forEach(function(f){
         if($rootScope.diseases.datatypes.map(_.property('datatype')).indexOf(f) < 0 ){
           var datatypes_obj = {}
           datatypes_obj["datatype"] = f;
           datatypes_obj["count"] = 0;
           datatypes_obj["value"] = false
           $rootScope.diseases.datatypes.push(datatypes_obj);
         }
       })


      k._source.facets.buckets.forEach(function(o){
        var result = $.grep($rootScope.diseases.datatypes, function(e){ return e.datatype == o.key; });
        if (result)
          result[0].count = result[0].count + o.doc_count
        else
          result[0].count = 0
      })

       k._source.data.forEach(function(p){


         p.datatypes.forEach(function(z){
           if($rootScope.diseases.userselecteddatatypes.indexOf("all") >= 0 && z.association_score >= 0 ) {
             targetSymbols.push(p.target.symbol)
          } else if ($rootScope.diseases.userselecteddatatypes.map(_.property('datatype')).indexOf(z.datatype) >= 0 && z.association_score > 0){
             targetSymbols.push(p.target.symbol)
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
              return d.target.id
            })
            .attr("x1",diseasePositionLeft)
            .attr("y1",diseasePositionTop)
            .attr("x2",function(d,i){
              if($('#'+d.target.symbol.replace(/\s/g, "") ).attr('cx'))
                return $('#'+d.target.symbol.replace(/\s/g, "") ).attr('cx')
              else
               return diseasePositionLeft
            })
            .attr("y2",function(d,i){
              if( $('#'+d.target.symbol.replace(/\s/g, "") ).attr('cy') )
                return $('#'+d.target.symbol.replace(/\s/g, "") ).attr('cy')
              else
                return diseasePositionTop
            })
            .attr("stroke","red")
            .attr("stroke-width","0.4")



      })
      $('#myModal').modal("hide")
    }

  }
]);
