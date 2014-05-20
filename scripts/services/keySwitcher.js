'use strict';

angular.module('2ViVe')
  .factory('keySwitcher', function() {

    return function (keyHandlerFn) {

      return function switchKey(data) {
        data = angular.fromJson(data);
        var keys = Object.keys(data);
        var result = angular.isArray(data) ? [] : {};

        angular.forEach(keys, function (key) {
          var camelCasedKey = keyHandlerFn(key);
          if (!data.hasOwnProperty(key)) {
            return;
          }
          if (data[key] && typeof data[key] === 'object') {
            result[camelCasedKey] = switchKey(data[key]);
          }
          else {
            result[camelCasedKey] = data[key];
          }
        });

        return result;
      };
    };
  });