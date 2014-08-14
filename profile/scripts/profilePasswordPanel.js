'use strict';

(function() {
  angular.module('2ViVe')
    .directive('viveProfilePasswordPanel', function() {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: function(element, attr) {
          var templateUrl = attr.templateUrl;
          return templateUrl ? templateUrl : 'bower_components/2ViVe-local/views/profile/profile-password-panel.html';
        },
        controller: 'profileAccountPanelCtrl',
        scope: {},
        link: function() {
        }
      };
    });
})();


