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
      }
    };
  }]);
