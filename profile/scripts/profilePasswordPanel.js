'use strict';

(function() {
  angular.module('2ViVe')
    .directive('viveProfilePasswordPanel', function() {
      return {
        restrict: 'E',
        templateUrl: function(element, attr) {
          return attr.tpl ? attr.tpl : 'bower_components/2ViVe-local/views/profile/profile-password-panel.html';
        },
        controller: 'profileAccountPanelCtrl',
        scope: {
          profile: '=',
          initProfile: '='
        }
      };
    });
})();


