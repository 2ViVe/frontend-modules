'use strict';

angular.module('2ViVe')
  .factory('BackOfficeAuthInterceptor', ['$q', 'UrlHandler',
    function($q, UrlHandler) {
      return {
        responseError: function(rejection) {
          if (rejection.status === 401) {
            UrlHandler.goToRetailSite('/signin');
          }
          return $q.reject(rejection);
        }
      };
    }]);
