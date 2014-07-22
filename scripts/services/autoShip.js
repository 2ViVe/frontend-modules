'use strict';

angular.module('2ViVe')
  .factory('AutoShips', ['$http', 'Dashlize', 'CamelCaseLize',
    function($http, dashlize, camelCaselize) {
      var AutoShips = function() {};

      AutoShips.prototype = {
        fetch: function() {
          var autoShips = this;
          return $http.get('/api/v2/autoships', {
            transformResponse: camelCaselize
          }).then(function(response) {
            autoShips.data = response.data.response;
            return autoShips;
          });
        },

        fetchShippingMethods: function(countryId, stateId) {
          var autoShips = this;
          return $http.get('/api/v2/autoships/shipping-methods', {
            transformResponse: camelCaselize,
            params: {
              'country-id': countryId,
              'state-id': stateId
            }
          }).then(function(response) {
            autoShips.shippingMethods = response.data.response;
            return autoShips;
          });
        },

        fetchProducts: function() {
          var autoShips = this;
          return $http.get('/api/v2/autoships/products', {
            transformResponse: camelCaselize
          }).then(function(response) {
            autoShips.products = response.data.response.products;
            return autoShips;
          });
        }
      };

      return AutoShips;
    }]);
