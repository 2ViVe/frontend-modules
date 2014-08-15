'use strict';

(function() {

  angular.module('2ViVe')
    .directive('viveProfilePersonalPanel', function() {
      return {
        restrict: 'E',
        templateUrl: function(element, attr) {
          return attr.tpl ? attr.tpl : 'bower_components/2ViVe-local/views/profile/profile-personal-panel.html';
        },
        controller: 'profileAccountPanelCtrl',
        scope: {
          profile: '=',
          initProfile: '='
        }
      };
    });

})();

