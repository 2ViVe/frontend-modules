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
      controller: ['$scope', '$modal', '$attrs', function($scope, $modal, $attrs) {
        var modalTpl = $attrs.modalTpl ? $attrs.modalTpl : 'bower_components/2ViVe/panels/views/handler-locate.html';
        $scope.$errorMessages = {};
        $scope.searchHandler = function(){
          $modal.open({
            templateUrl: modalTpl,
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
      Handlers.fetch($scope.input.microchipId, $scope.input.firstName, $scope.input.lastName, $scope.input.zipCode, $scope.stateId).then(function(results){
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
      $scope.input.country = countries.data[0];
      $scope.input.states = $scope.input.country.states;
    });

    $scope.direct = function(handler){
      $modalInstance.close(handler);
    };
    $scope.selectState = function(){
      $scope.stateId = $scope.input.state ? $scope.input.state.id : null;
    };
    $scope.results = [];
    $scope.targetHandler = '';
  }]);
