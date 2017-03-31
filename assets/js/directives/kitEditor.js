module.exports = ['d3Factory',
  '$q','$rootScope','$window',
  function (d3Factory,$q,$rootScope,$window) {
    //DDO -directive definition object
    return {
      scope:true,
      restrict:'A',
      link:function($scope,$element,$attrs){
        d3Factory.then(function (d3) {

          /**
           * Перемещение рабочей области в заданную точку
           * @param {Object}pt
           * @param {number}pt.x
           * @param {number}pt.y
           * @returns {Promise}
           */
          $scope.translateTo = function (pt) {
            return $q(function (resolve,reject) {
              //logic
              d3.transition('translateTo')
                .duration(DURATION)
                .tween('translateTo',function () {
                  //return function
                  //step - функция от t
                  //step(0)[0] - $scope.editor.position.x
                  //step(0)[1] - $scope.editor.position.y
                  //step(1)[0] - pt.x
                  //step(1)[1] - pt.y
                  const step = d3.interpolate(
                    [$scope.editor.position.x,$scope.editor.position.y],
                    [pt.x,pt.y]
                  );

                  function translateToInternal(x,y){
                    $scope.editor.behavior.d3.zoom.translate([x,y]);
                    $scope.editor.behavior.d3.zoom.event($scope.editor.svg.container);
                    $scope.editor.position.x = x;
                    $scope.editor.position.y = y;

                  }
                  /**
                   * @param t - нормализованный интервал [0,1]
                   */
                  return function (t) {
                    translateToInternal(step(t)[0],step(t)[1]);
                  }
                }).each('end',function () {
                resolve(`Translated to ${pt.x};${pt.x} successfully`);
              });

            });
          };

          $scope.center = function () {
            const scale = $scope.editor.behavior.d3.zoom.scale();
            const editorWidth = $scope.editor.pageProperties.widthMm*
              $scope.editor.features.pixelsPerMm*scale;
            const editorHeight = $scope.editor.pageProperties.widthMm*
              $scope.editor.features.pixelsPerMm*scale;
            const center = {
              x:($window.innerWidth - editorWidth)/2,
              y:($window.innerHeight - editorHeight)/2
            };

            return $scope.translateTo(center);
          };



          $scope.editor = {
            behavior:{},
            grid:{
              sizeXMm:5,
              sizeYMm:5
            },
            position:{
              x:0,
              y:0
            },
            pageProperties:{
              widthMm:297,
              heightMm:210
            },
            svg:{},
            features:{}
          };

          $scope.editor.svg.rootNode = d3.select($element[0]).append('svg')
            .attr('id','svg-editor');

          const conversionRect = $scope.editor.svg.rootNode.append('rect')
            .attr('width','1mm')
            .attr('height','1mm');

          $scope.editor.features.pixelsPerMm = conversionRect.node().getBBox().width;
          conversionRect.remove();

          const g = $scope.editor.svg.rootNode.append('g')
            .attr('transform','translate(0,0)');

          $scope.editor.svg.underlay = g.append('rect')
            .attr('class','underlay')
            .attr('width','100%')
            .attr('height','100%');

          $scope.editor.svg.container = g.append('g')
            .attr('class','svg-container');

          const gGridX = $scope.editor.svg.container.append('g')
            .attr('class','x axis');
          const gGridY = $scope.editor.svg.container.append('g')
            .attr('class','y axis');

          const borderFrame = $scope.editor.svg.container.append('rect')
            .attr('class','svg-border')
            .attr('x','0')
            .attr('y','0')
            .attr('weight','0')
            .attr('height','0');

          const DURATION = 1800;

          const pageWidth = $scope.editor.pageProperties.widthMm*
            $scope.editor.features.pixelsPerMm;
          const pageHeight = $scope.editor.pageProperties.heightMm*
            $scope.editor.features.pixelsPerMm;

          borderFrame
            .transition()
            .duration(DURATION)
            .attr('weight',pageWidth)
            .attr('height',pageHeight);

          const linesX = gGridX.selectAll('line').data(d3.range(0,pageHeight,$scope.editor.grid.sizeXMm*
            $scope.editor.features.pixelsPerMm));
          const linesY = gGridY.selectAll('line').data(d3.range(0,pageWidth,$scope.editor.grid.sizeYMm*
            $scope.editor.features.pixelsPerMm));

          linesX.enter().append('line')
            .attr('x1',0)
            .attr('x2',0)
            .attr('y1',function (d) {
              return d;
            })
            .transition()
            .duration(DURATION)
            .attr('x2',pageWidth)
            .attr('y2',function (d) {
              return d;
            });

          linesY.enter().append('line')
            .attr('y1',0)
            .attr('y2',0)
            .attr('x1',function (d) {
              return d;
            })
            .transition()
            .duration(DURATION)
            .attr('y2',pageHeight)
            .attr('x2',function (d) {
              return d;
            });

          //console.log(d3.behavior);
          $scope.editor.behavior.d3 = {
            zoom: d3.behavior.zoom()
                    .scale(1)
                    .scaleExtent([.2,10])
                    .on('zoom',function () {
                      const t = d3.event.translate;

                      //$scope.editor.svg.container.attr('transform','`translate(${t})scale(${d3.event.scale})`');
                      $scope.editor.svg.container.attr('transform','translate(' +
                        t + ')scale(' + d3.event.scale + ')');

                       const newT = t.toString().split(',');
                      $scope.editor.position.x = newT[0];
                      $scope.editor.position.y = newT[1];
                    })
          };
          g.call($scope.editor.behavior.d3.zoom);
          $scope.editor.behavior.d3.zoom.event($scope.editor.svg.container);

          $scope.center().then(function (message) {
            console.log(message);
          })



        });/*.catch(function (error) {
          *console.log(`Have an error =>${error}`);
        });*/
      }
    }
  }];
