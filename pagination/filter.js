'use strict';

angular.module('2ViVe')
  .filter('pagination', function() {
    return function(items, currentPage, numberPerPage) {
      var begin = (currentPage - 1) * numberPerPage,
        end = begin + numberPerPage;
      return items.slice(begin, end);
    };
  });
