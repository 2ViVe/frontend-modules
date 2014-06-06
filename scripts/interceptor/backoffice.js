'use strict';

angular.module('2ViVe')
  .factory('BackOfficeInterceptor', ['$q', '$cookies', 'UrlHandler',
    function($q, $cookies, UrlHandler) {
    return {
      request: function(config) {
        delete $cookies.sid;
        return config || $q.when(config);
      },
      responseError: function(rejection) {
        if (rejection.status === 401) {
          UrlHandler.goToRetailSite('/signin');
        }
        return $q.reject(rejection);
      }
    };
  }]);
