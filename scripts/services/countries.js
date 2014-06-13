'use strict';

angular.module('2ViVe')
  .factory('Countries', ['$http', 'Dashlize', 'CamelCaseLize',
    function($http, dashlize, camelCaselize) {
      return {
        fetch: function() {
          return $http.get('/api/v2/countries', {
            transformResponse: camelCaselize
          }).then(function(response) {
            return response.data.response;
          });
        }
      };
    }]);
