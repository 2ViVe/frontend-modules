'use strict';

(function() {

  angular.module('2ViVe')
    .directive('viveProfileWebAddressPanel', function() {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: function(element, attr) {
          var templateUrl = attr.templateUrl;
          return templateUrl ? templateUrl : 'bower_components/2ViVe-local/views/profile/profile-web-address-panel.html';
        },
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



