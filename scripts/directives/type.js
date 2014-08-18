'use strict';

angular.module('2ViVe')
  .directive('viveType', ['$timeout', function($timeout) {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        viveType: '@',
        onChanged: '&'
      },
      link: function(scope, element, attrs, ngModel) {

        if (scope.viveType === 'quantity') {
          var min = parseInt(attrs.min);
          if (isNaN(min)) {
            min = 0;
          }

          ngModel.$parsers.push(function(newQuantity) {
            if (isNaN(newQuantity) || newQuantity < min) {
              newQuantity = ngModel.$modelValue;
            } else if (newQuantity !== '') {
              newQuantity = parseInt(newQuantity);
              $timeout(function() {
                if (attrs.onChanged && newQuantity === ngModel.$modelValue) {
                  scope.onChanged();
                }
              }, 800);
            }

            ngModel.$viewValue = newQuantity;
            ngModel.$render();
            return newQuantity;
          });
        }

      }
    };
  }]);
