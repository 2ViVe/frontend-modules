'use strict';

angular
  .module('2ViVe')
  .directive('personalPanel', [function() {
    return {
      templateUrl: 'bower_components/2ViVe/panels/views/personal-panel.html',
      scope: {
        account: '=',
        submitted: '='
      },
      controller: ['$scope', function($scope) {
        $scope.isUseSSN = true;
        $scope.$watch('account.socialSecurityNumber', function(SSN) {
          if ($scope.isUseSSN) {
            $scope.account.taxId = SSN;
          }
        });
      }]
    };
  }]);