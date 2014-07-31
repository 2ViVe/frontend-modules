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
        hidePageNumber: '=',
        numberPerPage: '=',
        startPage: '@',
        refresh: '=',
        total: '=',
        onNextPage: '=',
        onPreviousPage: '=',
        onGoToPage: '=',
        templateUrl: '@',
        availableNumberPerPage: '@'
      },
      controller: ['$scope', '$attrs', function($scope, $attrs) {
        function refresh(total) {
          refreshPage(total, $scope.limit);
          if ($scope.startPage === 'first') {
            $scope.currentPage = 1;
            $scope.offset = 0;
          } else if ($scope.startPage === 'last') {
            $scope.currentPage = $scope.pageNumber;
            $scope.offset = total - 1;
          }
        }

        function refreshPage(total, limit) {
          $scope.pageNumber = Math.ceil(total / limit);
          $scope.pages = [];
          for (var i = 1; i <= $scope.pageNumber; i++) {
            $scope.pages.push(i);
          }
        }

        $scope.limit = parseInt($scope.numberPerPage);
        $scope.limits = [];
        if ($attrs.availableNumberPerPage !== undefined) {
          angular.forEach($scope.availableNumberPerPage.split(','), function(limit) {
            $scope.limits.push(parseInt(limit));
          });
        }

        if ($scope.startPage === undefined) {
          $scope.startPage = 'first';
        }

        $scope.refresh = refresh;
        refresh($scope.total);

        $scope.goTo = function(page) {
          $scope.currentPage = page;
          $scope.offset = ($scope.currentPage - 1) * $scope.limit;
          $scope.onGoToPage(page, $scope.offset, $scope.limit);
        };

        $scope.previousPage = function() {
          if ($scope.currentPage > 1) {
            $scope.currentPage--;
            $scope.onPreviousPage($scope.currentPage, $scope.offset, $scope.limit);
          }
        };

        $scope.nextPage = function() {
          if ($scope.currentPage < $scope.pageNumber) {
            $scope.currentPage++;
            $scope.onNextPage($scope.currentPage, $scope.offset, $scope.limit);
          }
        };

        $scope.updateLimit = function() {
          refreshPage($scope.total, $scope.limit);
          if ($scope.currentPage > $scope.pageNumber) {
            $scope.currentPage = $scope.pageNumber;
          }
          $scope.onGoToPage($scope.currentPage, $scope.offset, $scope.limit);
        };
      }]
    };
  });
