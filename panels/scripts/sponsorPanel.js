'use strict';

angular
  .module('2ViVe')
  .directive('sponsorPanel', [function() {
    return {
      templateUrl: 'bower_components/2ViVe/panels/views/sponsor-panel.html',
      scope: {
        account: '=',
        submitted: '=',
        required: '@'
      },
      controller: ['$scope', '$modal', function($scope, $modal) {
        $scope.$errorMessages = {};
        $scope.searchHandler = function(){
          $modal.open({
            templateUrl: 'bower_components/2ViVe/panels/views/handler-locate.html',
            controller: 'HandlerLocateModalController'
          }).result.then(function(result){
              $scope.account.sponsor = result.distributorId;
              console.log(result);
            });
        };
      }]
    };
  }])
  .controller('HandlerLocateModalController', ['$scope', '$location', 'Handlers', '$modalInstance', function($scope, $location, Handlers, $modalInstance) {
    $scope.input = {};
    $scope.submit = function(){
      Handlers.fetch($scope.input.microchipId, $scope.input.firstName, $scope.input.lastName).then(function(results){
        $scope.results = results;
      });

    };
    $scope.changeHandler = function(handler){
      $scope.targetHandler = handler;
    };

    $scope.connect = function(){
      if ($scope.targetHandler !== '') {
        $modalInstance.close($scope.targetHandler);
      }
    };
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
    $scope.results = [];
    $scope.targetHandler = '';
  }]);
