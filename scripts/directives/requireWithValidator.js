angular.module('2ViVe')
  .directive('requireWith', ['$http',
    function ($http) {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          requireWith: '='
        },
        link: function (scope, element, attrs, ctrl) {
          ctrl.$parsers.push(atLeastOneFieldNotEmpty);
          ctrl.$formatters.push(atLeastOneFieldNotEmpty);

          scope.$watch('requireWith', function() {
            atLeastOneFieldNotEmpty(ctrl.$modelValue);
          });

          function atLeastOneFieldNotEmpty(value) {
            var isOneOfThemFilled = !ctrl.$isEmpty(scope.requireWith) || !ctrl.$isEmpty(value);
            ctrl.$setValidity('requireWith', isOneOfThemFilled);
            return value;
          }
        }
      };
    }]);

