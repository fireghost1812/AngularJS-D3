module.exports = ['d3Factory',
  function (d3Factory) {
    //DDO -directive definition object
    return {
      scope:true,
      restrict:'A',
      link:function($scope,$element,$attrs){
        d3Factory.then(function (d3) {
          $scope.shape = {
            dragBehavior:{
              dragOrigin:{
                x:0,
                y:0
              },
              snapFactor: 2
            },
            svg:{
              rootNode: $element[0],
              d3Object:d3.select($element[0])
            }
          };

          $scope.setDragOrigin = function(x,y){
            $scope.shape.dragBehavior.dragOrigin.x = x;
            $scope.shape.dragBehavior.dragOrigin.y = y;
          };

          $scope.snaptoGrid = function(coords, factor){
            if (!typeof factor === 'undefined'){
              snapFactor = $scope.shape.dragBehavior.snapFactor
            } else {
              snapFactor = factor;
            }

            const a = $scope.editor.sizeXMm/snapFactor*
              $scope.editor.grid.sizeXMm*
              $scope.editor.features.pixelsPerMm;
            const b = $scope.editor.sizeYMm/snapFactor*
              $scope.editor.grid.sizeYMm*
              $scope.editor.features.pixelsPerMm;

            return {
              x: Math.round(coords.x/a)*a,
              y: Math.round(coords.y/b)*b
            }

          };

          $scope.moveTo = function (x,y,shouldSnap){
            $scope.setDragOrigin(x,y);
            let coords ={
              x:x,
              y:y
            };

            if(shouldSnap){
              coords = $scope.snaptoGrid(coords, $scope.shape.dragBehavior.snapFactor)
            }
            $scope.shape.svg.d3Object.attr('transform',
            'translate(`${coords.x},${coords.y}`)');

          };

          let dragInitiated = false;

          $scope.shape.dragBehavior.dragObject = d3.behavior.drag()
            .origin(function () {
              return $scope.shape.dragBehavior.dragOrigin;
            })
            .on('dragstart',function () {
              const e = d3.event.sourceEvent;
              e.stopPropagation();

              if(e.which === 1 || e instanceof TouchEvent){
                dragInitiated = true;
                $scope.editor.behavior.draqqing = true;
              }
            })
            .on('drag',function () {
              if(dragInitiated){
                $scope.moveTo(d3.event.x, d3,event.y, true);
              }
            })
            .on('dragend',function () {
              dragInitiated = false;
              $scope.editor.behavior.draqqing = false;
            });

          $scope.shape.svg.d3Object.call($scope.shape.dragBehavior.dragObject);

        });
      }
    };
  }];
