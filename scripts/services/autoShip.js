'use strict';

angular.module('2ViVe')
  .factory('AutoShip', ['$http', 'Dashlize', 'CamelCaseLize',
    function($http, dashlize, camelCaselize) {
      var AutoShip = function() {};

      AutoShip.prototype = {
        orderSummary: function(autoShipItems, shippingAddress, shippingMethodId) {
          var autoShip = this;
          return $http.post('/api/v2/autoships/orders/summary', {
            'autoship-items': autoShipItems,
            'shipping-address': shippingAddress,
            'shipping-method-id': shippingMethodId
          }, {
            transformResponse: camelCaselize,
            transformRequest: function(data) {
              return angular.toJson(dashlize(data));
            }
          }).then(function(response) {
            autoShip.orderSummary = response.data.response;
            return autoShip;
          });
        }
      };

      return AutoShip;
    }
  ])
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
