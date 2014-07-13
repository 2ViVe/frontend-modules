'use strict';

angular.module('2ViVe')
  .directive('creditCardExpiration', function() {
    return {
      restrict: 'AC',
      controller: ['$scope', function($scope) {
        $scope.expirationYears = [];
        $scope.expirationMonths = [];
        var currentYear = moment().year();
        var maxYear = currentYear + 20;
        for (var year = currentYear; year < maxYear; year++) {
          $scope.expirationYears.push(year);
        }
        for (var month = 1; month < 13; month++) {
          $scope.expirationMonths.push(month);
        }

        $scope.onYearChange = function(year) {
          var month = 1;

          while($scope.expirationMonths.length) {
            $scope.expirationMonths.pop();
          }

          if (year === currentYear) {
            month = moment().month() + 1;
          }

          for (; month < 13; month++) {
            $scope.expirationMonths.push(month);
          }
        };
      }]
    };
  });
