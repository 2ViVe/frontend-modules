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
  });
