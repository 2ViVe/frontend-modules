'use strict';

angular.module('2ViVe')
  .directive('datePicker', function() {
    return {
      restrict: 'A',
      link: function(scope, element) {
        new Pikaday({
          field: angular.element(element)[0]
        });
      }
    };
  });
