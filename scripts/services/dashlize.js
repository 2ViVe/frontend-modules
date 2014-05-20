'use strict';

angular.module('2ViVe')
  .factory('Dashlize', ['keySwitcher', function(keySwitcher) {

    function dash(key) {
      return key.replace(/([A-Z])/g, function (g) {
        return '-' + g.toLowerCase();
      });
    }

    return keySwitcher(dash);
  }]);