'use strict';

angular
  .module('2ViVe')
  .directive('sponsorPanel', [function() {
    return {
      templateUrl: function(el, attr) {
        var tpl = 'bower_components/2ViVe/panels/views/sponsor-panel.html';

        if (attr.tpl) {
          tpl = attr.tpl;
        }

        return tpl;
      },
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
            });
        };
      }]
    };
  }])
  .controller('HandlerLocateModalController', ['$scope', '$location', 'Handlers', '$modalInstance', 'Registration.Countries', function($scope, $location, Handlers, $modalInstance, Countries) {
    $scope.input = {};
    $scope.submit = function(){
      Handlers.fetch($scope.input.microchipId, $scope.input.firstName, $scope.input.lastName).then(function(results){
        $scope.results = results;
        $scope.errorMessage = '';
        if (results.length == 0){
          $scope.errorMessage = 'Handler Not Found';
        }
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
    Countries.fetch().then(function(countries) {
      $scope.countries = countries.data;
    });

    $scope.changeState = function(){
      $scope.states = $scope.country.states;
    };
    $scope.direct = function(handler){
      $modalInstance.close(handler);
    };
    $scope.results = [];
    $scope.targetHandler = '';
  }]);
