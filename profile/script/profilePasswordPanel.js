'use strict';

(function() {
  angular.module('2ViVe')
    .directive('profilePasswordPanel', function() {
      return {
        restrict: 'A',
        replace: true,
        templateUrl: '/views/profile/profile-password-panel.html',
        controller: 'profileInfoPanelCtrl',
        scope: {},
        link: function() {
        }
      };
    });
})();


