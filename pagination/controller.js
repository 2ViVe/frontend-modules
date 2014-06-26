'use strict';

angular.module('2ViVe')
  .directive('vivePagination', function() {
    return {
      restrict: 'E',
      templateUrl: function(element, attr) {
        var templateUrl = attr.templateUrl;
        return templateUrl ? templateUrl : 'bower_components/2ViVe/pagination/views.html';
      },
      scope: {
        numberPerPage: '=',
        currentPage: '=',
        total: '=',
        onNextPage: '=',
        onPreviousPage: '=',
        onGoToPage: '=',
        templateUrl: '@'
      },
      controller: ['$scope', function($scope) {
        function calculatePage(total) {
          $scope.pageNumber = Math.ceil(total / $scope.numberPerPage);

          $scope.pages = [];
          for (var i = 1; i <= $scope.pageNumber; i++) {
            $scope.pages.push(i);
          }
        }

        $scope.$watch('total', calculatePage);

        $scope.goTo = function(page) {
          $scope.currentPage = page;
          $scope.onGoToPage(page);
        };

        $scope.previousPage = function() {
          if ($scope.currentPage > 1) {
            $scope.currentPage--;
            $scope.onPreviousPage();
          }
        };

        $scope.nextPage = function() {
          if ($scope.currentPage < $scope.pageNumber) {
            $scope.currentPage++;
            $scope.onNextPage();
          }
        };
      }]
    };
  });
