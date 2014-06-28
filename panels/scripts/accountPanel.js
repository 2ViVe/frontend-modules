'use strict';

angular
  .module('2ViVe')
  .directive('accountPanel', [function() {
    return {
      templateUrl: function(el, attr) {
        var tpl = 'bower_components/2ViVe/panels/views/account-panel.html';

        if (attr.tpl) {
          tpl = attr.tpl;
        }

        return tpl;
      },
      scope: {
        account: '=',
        submitted: '='
      }
    };
  }]);
