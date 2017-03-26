module.exports = ['d3Factory',function (d3Factory) {
  //DDO -directive definition object
  return {
    scope:true,
    restrict:'A',
    link:function($scope,$element,$attrs){
      d3Factory.then(function (d3) {
        $scope.editor = {
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
          .attr('class','svg-container')

        const borderFrame = $scope.editor.svg.container.append('rect')
          .attr('class','svg-border')
          .attr('x','0')
          .attr('y','0')
          .attr('weight','0')
          .attr('height','0');

        const DURATION = 800;

        const pageWidth = $scope.editor.pageProperties.widthMm*
          $scope.editor.features.pixelsPerMm;
        const pageHeight = $scope.editor.pageProperties.widthMm*
          $scope.editor.features.pixelsPerMm;

        borderFrame
          .transition()
          .duration(DURATION)
          .attr('weight',pageWidth)
          .attr('height',pageHeight);

      }).catch(function (error) {
        console.log(error);
      });
    }
  }
}];