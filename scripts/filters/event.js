'use strict';

angular
  .module('2ViVe')
  .filter('responseIs', function() {
    return function(invitees, responseType) {
      return invitees && invitees.filter(function(invitee) {
        return invitee.response === responseType;
      });
    };
  });
