'use strict';

angular.module('2ViVe')
  .directive('requireWith', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        requireWith: '='
      },
      link: function(scope, element, attrs, ctrl) {
        function atLeastOneFieldNotEmpty(value) {
          var isOneOfThemFilled = !ctrl.$isEmpty(scope.requireWith) || !ctrl.$isEmpty(value);
          ctrl.$setValidity('requireWith', isOneOfThemFilled);
          return value;
        }

        ctrl.$parsers.push(atLeastOneFieldNotEmpty);
        ctrl.$formatters.push(atLeastOneFieldNotEmpty);

        scope.$watch('requireWith', function() {
          atLeastOneFieldNotEmpty(ctrl.$modelValue);
        });
      }
    };
  });

