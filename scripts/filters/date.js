'use strict';

angular
  .module('2ViVe')
  .filter('readableTimestampFrom', function() {
    return function(from, to) {
      var fromDate = moment(from);
      var toDate = to === 'now' ? moment() : moment(to);
      return fromDate.from(toDate);
    };
  });
