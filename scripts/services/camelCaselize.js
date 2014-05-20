'use strict';

angular.module('2ViVe')
  .factory('CamelCaseLize', ['keySwitcher', function( keySwitcher) {

    function camelcase(key) {
      return key.replace(/[-_]([a-z])/g, function (g) {
        return g[1].toUpperCase();
      });
    }

    return keySwitcher(camelcase);
  }]);