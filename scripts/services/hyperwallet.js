'use strict';

angular.module('2ViVe')
  .factory('hyperwallet', ['$http', 'CamelCaseLize', 'Dashlize', function($http, camelize, dashlize) {

    function handleResponse(resp) {
      return resp.data.response;
    }

    return {
      fetch: function() {
        return $http.get('/api/v2/hyperwallets/accounts', {
          transformResponse: camelize
        }).then(handleResponse);
      },
      create: function(hyperwallet) {
        return $http.post('/api/v2/hyperwallets/accounts', hyperwallet, {
          transformRequest: function(data) {
            return angular.toJson(dashlize(data));
          }
        }).then(handleResponse);
      }
    };
  }]);
