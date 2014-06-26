'use strict';

angular.module('2ViVe')
  .directive('vivePagination', function() {
    return {
      restrict: 'E',
      templateUrl: function(element, attr) {
        var templateUrl = attr.templateUrl;
        return templateUrl ? templateUrl : 'bower_components/2ViVe/pagination/view.html';
      },
      scope: {
        hidePageNumber: '@',
        numberPerPage: '=',
        startPage: '@',
        refresh: '=',
        total: '=',
        onNextPage: '=',
        onPreviousPage: '=',
        onGoToPage: '=',
        templateUrl: '@'
      },
      controller: ['$scope', function($scope) {
        function refresh(total) {
          $scope.pageNumber = Math.ceil(total / $scope.numberPerPage);
          if ($scope.startPage === 'first') {
            $scope.currentPage = 1;
          } else if ($scope.startPage === 'last') {
            $scope.currentPage = $scope.pageNumber;
            $scope.onGoToPage($scope.pageNumber);
          }

          $scope.pages = [];
          for (var i = 1; i <= $scope.pageNumber; i++) {
            $scope.pages.push(i);
          }
        }

        $scope.refresh = refresh;
        if ($scope.startPage === undefined) {
          $scope.startPage = 'first';
        }
        refresh($scope.total);

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
