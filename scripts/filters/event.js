'use strict';

angular
  .module('2ViVe')
  .filter('responseIs', function() {
    return function(invitees, responseType) {
      return invitees && invitees.filter(function(invitee) {
        return invitee.reply.toUpperCase() === responseType.toUpperCase();
      });
    };
  })
  .filter('responseIsNot', function() {
    return function(invitees, responseType) {
      return invitees && invitees.filter(function(invitee) {
        return invitee.reply.toUpperCase() !== responseType.toUpperCase();
      });
    };
  })
  .filter('isActive', function() {
    return function(events) {
      return events && events.filter(function(event) {
        var closeDate = moment(event.orderCloseTime);
        return closeDate.isAfter(moment());
      });
    };
  })
  .filter('periodIs', function() {
    return function(events, period) {
      return events && events.filter(function(event) {
        var startTimeIsBeforeNow = moment(event.startTime).isBefore();
        return startTimeIsBeforeNow ? period === 'recent' : period === 'upcoming';
      });
    };
  });
