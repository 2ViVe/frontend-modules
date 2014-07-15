'use strict';

angular.module('2ViVe')
  .factory('Handlers', ['$http', 'Dashlize', 'CamelCaseLize',
    function($http, dashlize, camelCaselize) {
      return {
        fetch: function(microchipId, firstName, lastName, zipCode, stateId) {
          return $http.get('/api/v2/distributors', {
            transformResponse: camelCaselize,
            params : {
              'first-name' : firstName || '',
              'last-name' : lastName || '' ,
              'customer-id' : microchipId || '',
              'zip-code' : zipCode,
              'state-id' : stateId
            }
          }).then(function(response) {
              return response.data.response;
            });
        }
      };
    }]);
