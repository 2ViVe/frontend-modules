'use strict';

angular.module('2ViVe')
  .directive('viveConfirmation', ['$window', function($window) {
    return {
      restrict: 'E',
      scope: {
        'onConfirmed': '&',
        'confirmationMessage': '@'
      },
      link: function(scope, element) {
        angular.element(element).on('click', function() {
          if ($window.confirm(scope.confirmationMessage)) {
            scope.onConfirmed();
          }
        });
      }
    };
  }]);
