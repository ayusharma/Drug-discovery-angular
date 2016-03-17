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


      $rootScope.diseases.userselected = [];
      $rootScope.diseases.default = '';
      $rootScope.diseases.datatypes = [];


      //data for visualizatons
      //setting null at startup
      $rootScope.diseases.vizdata = null;

      //function to get diseases
      //names in dropdown
      function get_diseases(){
        Diseases.getAll().then(function(data){
          $rootScope.diseases.names = data.data.hits;
          console.log($rootScope.diseases.names)
        });
      }


      //get data from server when visualizatons
      //is called
      function get_disease_data(){
        Diseases.selected($rootScope.diseases.userselected).then(function(res){
              $rootScope.diseases.vizdata = res.data;
          });
      }

      //call get_diseases
      get_diseases();

      $rootScope.submitForm = function(x){
        if ($rootScope.diseases.userselected.indexOf(x) < 0) {
            $rootScope.diseases.userselected.push(x);
            _.remove($rootScope.diseases.names,function (n) {
              return n.fields.name[0] === x.fields.name[0];
            });
            console.log($rootScope.diseases.names)
            get_disease_data();
        }
         else {}

      };

      $rootScope.submitDiseaseCode = function(){
        if ($rootScope.diseases.crawlcode !== null){
          $rootScope.modaltext = "Crawling Data";
          $('#myModal').modal("show");
          Diseases.crawl($rootScope.diseases.crawlcode).then(function(res){
            console.log(res.data);
            $rootScope.modaltext="";
            $('#myModal').modal("hide");
            get_diseases();
          });

        } else {
          alert("Please enter a value");
        }
      };

      $rootScope.removeDisease = function(x){
        //console.log(diseaseName)
        //console.log($rootScope.diseases.userselected)
        _.remove($rootScope.diseases.userselected,function (n) {
          get_disease_data();
          return n.fields.name[0] === x.fields.name[0]
        });

        if ($rootScope.diseases.names.indexOf(x) < 0) {
          $rootScope.diseases.names.push(x);
        }

      };

      $rootScope.dendogram = function () {

        if($rootScope.diseases.userselected.length) {
          $('#myModal').modal("show");

          var data = $rootScope.diseases.vizdata.hits.hits;
          $rootScope.diseases.datatypes = [];
          $rootScope.diseases.userselecteddatatypes = ["all"];

          data.forEach(function (k) {

            k._source.datatypes.forEach(function(f){
              if($rootScope.diseases.datatypes.map(_.property('datatype')).indexOf(f) < 0 ){
                var datatypes_obj = {};
                datatypes_obj['datatype'] = f;
                datatypes_obj['count'] = 0;
                datatypes_obj['value'] = false;
                datatypes_obj['diseases'] = 0;
                $rootScope.diseases.datatypes.push(datatypes_obj);
              }
            });

           k._source.facets.buckets.forEach(function(o){
             var result = $.grep($rootScope.diseases.datatypes, function(e){ return e.datatype === o.key; });
             if (result){
               result[0].count = result[0].count + o.doc_count;
             }
             else {
               result[0].count = 0;
             }
           });
         });
          dendogram();
         }
        else {
        alert("Please select a disease");
        }

      };

      $rootScope.updateViz= function() {

        _.remove($rootScope.diseases.userselecteddatatypes,function (n) {
          return n === 'all';
        });


        $rootScope.diseases.datatypes.forEach(function(k){
          if(k.value) {
              $rootScope.diseases.userselecteddatatypes.push(k);
          }
          else {
            _.remove($rootScope.diseases.userselecteddatatypes,function (n) {
                  return n.datatype === k.datatype;
            });
          }
        });

        if($rootScope.diseases.userselecteddatatypes.length === 0){
                $rootScope.diseases.userselecteddatatypes.push('all');
        }

        //console.log($rootScope.diseases.userselecteddatatypes);

        dendogram();

      };

      /*
      Main visualization function
      */
      function dendogram(){

        //store the all target drugs
        var targetSymbols = [],
            targetDiseases = [],
            totalTargetDiseases = [],
            userselectedTargets = [];


        d3.select("svg").remove();

        //tooltip on hover
         var tooltip = d3.select("body").append("div").attr("class","tooltip")
         .style("position","absolute")
         .style("padding","0 10px")
         .style("background","white")
         .style("opacity",0);

        //selected diseases data
        var data = $rootScope.diseases.vizdata.hits.hits;

        console.log(data);

        //adjustment of the visualization
        var width = $('.viz').width(),
            height = 1000000,
            margin = {top:50,bottom:100,right:50,left:50};

        var w = width-margin.left-margin.right,
            h = height-margin.top-margin.bottom;


      //extract the data for visualization
      //from data and compare that on basis
      //of selected datatypes
       data.forEach(function (k) {
         k._source.data.forEach(function(p){
           p.datatypes.forEach(function(z){
             if($rootScope.diseases.userselecteddatatypes.indexOf("all") >= 0 && z.association_score >= 0 ) {
               targetSymbols.push(p.target.symbol);
            } else if ($rootScope.diseases.userselecteddatatypes.map(_.property('datatype')).indexOf(z.datatype) >= 0 && z.association_score > 0){
               targetSymbols.push(p.target.symbol);
             }
           });

         });

        //  console.log(k._source.targetSymbols)

         totalTargetDiseases = _.uniq(totalTargetDiseases.concat(k._source.targetSymbols)).sort();

      });

       //removes the dunpicate values
       targetSymbols = _.uniqBy(targetSymbols);

        // totalTargetDiseases.forEach(function(k){

          targetSymbols.map(function(w){
            var yy = _.find(totalTargetDiseases,function(o){
              return o.symbol === w
            })

            // console.log(yy)
            targetDiseases = _.uniq(targetDiseases.concat(yy.disease)).sort();

          });
        // })


       var svg = d3.select(".viz")
                 .append("svg")
                 .attr({
                   "width":w + margin.left + margin.right,
                   "height":h + margin.top + margin.bottom
                 })
                 .append("g")
                 .attr("transform","translate("+margin.left+","+margin.top+")");

       var diseases = svg.append('g').attr("class","disease").selectAll("circle")
                     .data(data)
                     .enter()
                     .append("circle")
                     .attr({
                       "id": function(d,i){
                         return d._source.name.replace(/[\s'-+/".,]/g, "")+'node';
                       },
                       "cx": 0,
                       "cy": function(d,i){
                         return i*30;
                       },
                       "r":3
                   })
                   .on("mouseover",function(d){
                          d3.select(this).style("opacity",".8");
                          tooltip.transition().style("opacity","1");
                          // console.log(d)
                          tooltip.html(d._source.name)
                          .style("left",(d3.event.pageX)+"px")
                          .style("top",(d3.event.pageY)-15+"px");
                  })
                  .on("mouseout",function(d){
                      d3.select(this).style("opacity","1");
                      tooltip.transition().style("opacity","0");
                  });



       var diseasetext = svg.append('g').attr("class","disease-text").selectAll("text")
                         .data(data)
                         .enter()
                         .append("text")
                         .attr({
                           "width": 100,
                           "height": 30,
                           "x": 0,
                           "y": function(d,i){
                              return i*35;
                            }
                         })
                         .text(function(d,i){
                           return d._source.name;
                         })
                         .style({
                           "font-size":"10px"
                         })



      //
      // console.log(targetSymbols)


        data.forEach(function(k){

          var diseasePositionLeft = $('#'+k._source.name.replace(/[\s'-+/".,]/g, "")+'node' ).attr('cx');
          var diseasePositionTop = $('#'+k._source.name.replace(/[\s'-+/".,]/g, "")+'node' ).attr('cy');

          var target = svg.append('g').attr("class","target").selectAll("circle")
                        .data(targetSymbols)
                        .enter()
                        .append("circle")
                        .attr({
                          "id":function (d,i) {
                            return d.replace(/[\s'-+/".,]/g, "");
                          },
                          "cx":300,
                          "cy":function(d,i){
                            return i*30;
                          },
                          "r":3
                        });

          var targetDiseasesDot = svg.append('g').attr("class","target-diseases").selectAll("circle")
                        .data(targetDiseases)
                        .enter()
                        .append("circle")
                        .attr({
                          "id":function (d,i) {
                            return d.replace(/[\s'-+/".,]/g, "");
                          },
                          "cx":700,
                          "cy":function(d,i){
                            return i*30;
                          },
                          "r":5
                        })


          var targetDiseasesText = svg.append('g').attr("class","target-diseases-text").selectAll("text")
                      .data(targetDiseases)
                      .enter()
                      .append("text")
                      .attr({
                        "width":100,
                        "height":30,
                        "x":750,
                        "y":function(d,i){
                          return i*30;
                        }
                      })
                      .text(function(d,i){
                        return d;
                      })
                      .style({
                        "font-size":"10px"
                      })


          var text = svg.append('g').attr("class","target-text").selectAll("text")
                      .data(targetSymbols)
                      .enter()
                      .append("text")
                      .attr({
                        "width":100,
                        "height":30,
                        "x":320,
                        "y":function(d,i){
                            return i*30;
                        }
                      })
                      .text(function(d,i){
                        return d;
                      })
                      .on("click",function(d){
                        var l = _.find(totalTargetDiseases, function(o) { return o.symbol === d; });
                        if($(this).hasClass("italic")) {
                          userselectedTargets.pop(d.trim());

                          l.disease.map(function(zz){
                            // co
                            $("line."+d+"-"+zz.replace(/[\s'-+/".,]/g, ""))
                            .attr("stroke-width",0.2)
                            .attr("stroke","green")
                            .css('opacity',0);

                          })
                          $(this).removeClass("italic");
                          if(userselectedTargets.length === 0) {
                            $('line').css('opacity',1);
                          }

                        } else {

                          userselectedTargets.push(d.trim());
                          $('line').css('opacity',0);
                          //
                          userselectedTargets.map(function(mm){
                            $('.'+mm+'-disease-line').children().css('opacity',1).attr("stroke-width",2)
                            .attr("stroke","purple")
                          })


                          $(this).addClass("italic");

                          console.log(userselectedTargets)
                        }
                      })
                      .style({
                        "font-size":"10px"
                      })



          var line = svg.append("g").attr("class","line").selectAll("line")
              .data(k._source.data)
              .enter()
              .append("line")
              .attr({
                "id": function(d,i){
                  return d.target.id;
                },
                "x1":diseasePositionLeft,
                "y1":diseasePositionTop,
                "x2":function(d,i){
                  if($('#'+d.target.symbol.replace(/[\s'-+/".,]/g, "") ).attr('cx')) {
                    return $('#'+d.target.symbol.replace(/[\s'-+/".,]/g, "") ).attr('cx');
                  }
                  else {
                   return diseasePositionLeft;
                 }
               },
               "y2":function(d,i){
                 if( $('#'+d.target.symbol.replace(/[\s'-+/".,]/g, "") ).attr('cy') ) {
                   return $('#'+d.target.symbol.replace(/[\s'-+/".,]/g, "") ).attr('cy');
                 }
                 else {
                   return diseasePositionTop;
                 }
               },
               "stroke":"red",
               "stroke-width":"0.2"
              })

          k._source.targetSymbols.forEach(function(j){

            var diseasehypoPositionLeft = $('#'+j.symbol.replace(/[\s'-+/".,]/g, "") ).attr('cx');
            var diseasehypoPositionTop = $('#'+j.symbol.replace(/[\s'-+/".,]/g, "") ).attr('cy');
            if ( diseasehypoPositionLeft && diseasehypoPositionTop) {
            // d.disease.forEach(function(g){
              var targetDiseasesline = svg.append("g")
                  .attr("id",function(){
                     return 'line';
                  })
                  .attr("class",function(){
                     return j.symbol+'-'+'disease-line';
                  })
                  .selectAll("line")
                  .data(j.disease)
                  .enter()
                  .append("line")
                  .attr({
                    "class": function(d,i){
                      return j.symbol+'-'+d.replace(/[\s'-+/".,]/g, "")
                    },
                    "x1": diseasehypoPositionLeft,
                    "y1":diseasehypoPositionTop,
                    "x2":function(d,i){
                      if($('#'+d.replace(/[\s'-+/".,]/g, "") ).attr('cx')) {
                        return $('#'+d.replace(/[\s'-+/".,]/g, "") ).attr('cx');
                      }
                      else {
                       return diseasehypoPositionLeft;
                     }
                   },
                   "y2":function(d,i){
                     if( $('#'+d.replace(/[\s'-+/".,]/g, "") ).attr('cy') ) {
                       return $('#'+d.replace(/[\s'-+/".,]/g, "") ).attr('cy');
                     }
                     else {
                       return diseasehypoPositionTop;
                     }
                   },
                   "stroke":"green",
                   "stroke-width":"0.2"
                  })
          }
          });

        });
        $('#myModal').modal("hide");
    }
  }
  ]);
