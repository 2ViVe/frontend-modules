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
      controller: ['$scope', function($scope) {
        $scope.$errorMessages = {};
      }]
    };
  }]);
