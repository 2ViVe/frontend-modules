'use strict';

(function() {

  angular.module('2ViVe')
    .directive('profilePersonalPanel', function() {
      return {
        restrict: 'A',
        replace: true,
        templateUrl: '/views/profile/profile-personal-panel.html',
        controller: 'profileInfoPanelCtrl',
        scope: {},
        link: function() {
        }
      };
    });

})();

