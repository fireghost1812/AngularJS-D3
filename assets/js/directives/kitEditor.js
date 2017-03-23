module.exports = ['d3Factory',function (d3Factory) {
  //DDO -directive definition object
  return {
    scope:true,
    restrict:'A',
    link:function($scope,$element,$attrs){
      $scope.myProperty=41;
      console.log($scope.myProperty);
    }
  }
}];