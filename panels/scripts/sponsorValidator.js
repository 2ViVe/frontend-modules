'use strict';

angular
  .module('2ViVe')
  .directive('sponsorValidator', ['Registration', 'LocalStorage', '$timeout',
    function (Registration, LocalStorage, $timeout) {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          sponsorName: '=',
          sponsorValidatorErrorMsg: '='
        },
        link: function (scope, element, attrs, ctrl) {

          var isInputting = false;

          var replicateInfo = LocalStorage.getReplicateOwner();

          if (replicateInfo && replicateInfo['role-code'] === 'D') {
            $timeout(function() {
              element.val(replicateInfo['distributor-id']);
              ctrl.$setViewValue(replicateInfo['distributor-id'], 'change');
            });
          }

          element.on('focus', function () {
            isInputting = true;
          });

          element.on('blur', function () {
            isInputting = false;
            ctrl.$setViewValue(element.val());
          });

          function validate(value) {
            if (ctrl.$isEmpty(value)) {
              ctrl.$setValidity('sponsorError', true);
              return;
            }

            if (!isInputting) {
              Registration.validateSponsor(value)
                .success(function (data) {
                  if (data.response.name === undefined) {
                    scope.sponsorValidatorErrorMsg = 'Invalid sponsor ID, please enter another one.';
                    ctrl.$setValidity('sponsorError', false);
                    return;
                  }
                  scope.sponsorName = data.response.name;
                  ctrl.$setValidity('sponsorError', true);
                })
                .error(function (data) {
                  scope.sponsorValidatorErrorMsg = data.meta.error.message;
                  ctrl.$setValidity('sponsorError', false);
                });
            }
            return value;
          }

          ctrl.$parsers.push(validate);
          ctrl.$formatters.push(validate);
        }
      };
    }]);
