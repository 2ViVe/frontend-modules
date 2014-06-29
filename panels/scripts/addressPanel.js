'use strict';

angular
  .module('2ViVe')
  .directive('addressPanel', [function() {
    return {
      replace: true,
      templateUrl: function(elm, attr) {
        var type = attr.addressType;
        var filename = 'address-panel.html';

        if (type === 'website') {
          filename = 'web-' + filename;
        }


        return 'bower_components/2ViVe/panels/views/' + filename || attr.tpl;
      },
      controller: 'AddressPanelCtrl',
      controllerAs: 'panel',
      scope: {
        title: '@',
        address: '=',
        addressType: '@',
        homeAddress: '=',
        submitted: '=',
        defaultUseHomeAddress: '@'
      },
      link: function(scope, el) {

        el.on('change', 'input[required]', function() {
          if (isAllFilled()) {
            scope.validate();
          }
        });

        function isAllFilled() {
          var values = [];
          var requiredInputs = el.find('input[required]');
          requiredInputs.each(function(idx, input) {
            if (angular.element(input).val().trim().length > 0) {
              values.push(input);
            }
          });

          return values.length === requiredInputs.length;
        }
      }
    };
  }]);
