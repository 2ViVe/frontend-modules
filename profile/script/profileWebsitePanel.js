'use strict';

(function() {

  angular.module('2ViVe')
    .directive('profileWebsitePanel', function() {
      return {
        restrict: 'A',
        replace: true,
        templateUrl: '/views/profile/profile-website-panel.html',
        controller: 'profileAddressPanelCtrl',
        scope: {
          addressType: '@',
          addressTitle: '@'
        },
        link: function() {
        }
      };
    });

})();



