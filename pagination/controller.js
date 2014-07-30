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
        numberPerPage: '@',
        startPage: '@',
        refresh: '=',
        total: '=',
        onNextPage: '=',
        onPreviousPage: '=',
        onGoToPage: '=',
        templateUrl: '@',
        limitArr : '='
      },
      controller: ['$scope', '$attrs', '$timeout', function($scope, $attrs, $timeout) {
        function refresh(total) {
          $scope.pageNumber = Math.ceil(total / $scope.numberPerPage);
          if ($scope.startPage === 'first') {
            $scope.currentPage = 1;
            $scope.offset = 0;
          } else if ($scope.startPage === 'last') {
            $scope.currentPage = $scope.pageNumber;
            $timeout(function() {
              $scope.offset = total - 1;
              $scope.onGoToPage($scope.offset, $scope.numberPerPage);
            });
          }

          $scope.pages = [];
          for (var i = 1; i <= $scope.pageNumber; i++) {
            $scope.pages.push(i);
          }
        }

        if ($attrs.refresh !== undefined) {
          $scope.refresh = refresh;
        }

        if ($scope.startPage === undefined) {
          $scope.startPage = 'first';
        }
        refresh($scope.total);

        $scope.goTo = function(page) {
          $scope.currentPage = page;
          $scope.offset = ($scope.currentPage - 1) * 25;
          $scope.onGoToPage($scope.offset, $scope.numberPerPage);
        };

        $scope.previousPage = function() {
          if ($scope.currentPage > 1) {
            $scope.currentPage--;
            $scope.onPreviousPage($scope.currentPage);
          }
        };

        $scope.nextPage = function() {
          if ($scope.currentPage < $scope.pageNumber) {
            $scope.currentPage++;
            $scope.onNextPage($scope.currentPage);
          }
        };

        $scope.updateLimit = function(){
          $scope.onGoToPage($scope.offset, $scope.numberPerPage);
        }
      }]
    };
  });
