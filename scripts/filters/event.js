'use strict';

angular
  .module('2ViVe')
  .filter('responseIs', function() {
    return function(invitees, responseType) {

      return invitees && invitees.filter(function(invitee) {
        if (!invitee.response) {
          return false;
        }
        return invitee.reply.toUpperCase() === responseType.toUpperCase();
      });
    };
  })
  .filter('responseIsNot', function() {
    return function(invitees, responseType) {
      return invitees && invitees.filter(function(invitee) {
        if (!invitee.response) {
          return false;
        }
        return invitee.reply.toUpperCase() !== responseType.toUpperCase();
      });
    };
  });
