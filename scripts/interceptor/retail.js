'use strict';

angular.module('2ViVe')
  .factory('RetailInterceptor', ['$q', '$cookies', function($q, $cookies) {
    return {
      request: function(config) {
        delete $cookies.sid;
        return config || $q.when(config);
      }
    };
  }]);
