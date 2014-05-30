'use strict';

angular
  .module('2ViVe')
  .directive('accountPanel', [function() {
    return {
      templateUrl: 'bower_components/2ViVe/panels/views/account-panel.html',
      scope: {
        account: '=',
        submitted: '='
      }
    };
  }]);
