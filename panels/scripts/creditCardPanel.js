'use strict';

angular.module('2ViVe')
  .directive('creditcardPanel', [function() {
    return {
      restrict: 'A',
      templateUrl: function(el, attr) {
        return attr.tpl || 'bower_components/2ViVe/panels/views/credit-card-panel.html';
      },
      replace: true,
      scope: {
        creditcard: '='
      }
    };
  }]);