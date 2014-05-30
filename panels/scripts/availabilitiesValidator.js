'use strict';

angular.module('2ViVe')
  .directive('availabilitiesValidator', ['Registration',
    function(Registration) {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          key: '@availabilitiesValidator'
        },
        link: function(scope, element, attrs, ctrl) {
          angular.element(element).on('blur', function() {
            var value = ctrl.$modelValue;
            if (ctrl.$isEmpty(value)) {
              return;
            }
            Registration.validateAvailabilities(scope.key, value)
              .success(function(data) {
                ctrl.$setValidity('available', data.response.available);
              })
              .error(function() {
                ctrl.$setValidity('available', false);
              });
          });
        }
      };
    }]);