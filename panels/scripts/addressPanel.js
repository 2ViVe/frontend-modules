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
        return 'bower_components/2ViVe/panels/views/' + filename;
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
      compile: function() {
        console.log(arguments)
      },
      link: function(scope, el, attr, ctrl) {
        var requiredInputs = el.find('input[required]');

        requiredInputs.on('change', function() {
          if (isAllFilled()) {
            ctrl.validate();
          }
        });

        function isAllFilled() {
          var values = [];
          requiredInputs.each(function(idx, input) {
            if ($(input).val().trim().length > 0) {
              values.push(input);
            }
          });

          return values.length === requiredInputs.length;
        }
      }
    };
  }]);
