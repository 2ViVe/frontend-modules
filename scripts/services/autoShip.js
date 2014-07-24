'use strict';

angular.module('2ViVe')
  .factory('AutoShip', ['$http', 'Dashlize', 'CamelCaseLize',
    function($http, dashlize, camelCaselize) {
      var AutoShip = function() {};

      AutoShip.prototype = {
        cancel: function() {
          return $http.delete('/api/v2/autoships/' + this.id);
        },

        create: function() {
          var autoShip = this;
          return $http.post('/api/v2/autoships', {
            'payment-method-id': autoShip.paymentMethod.id,
            'role-code': autoShip.roleCode === '' ? undefined : autoShip.roleCode,
            'autoship-day': autoShip.autoShipDay,
            'start-date': autoShip.startDate.year + '-' + autoShip.startDate.month + '-1',
            'creditcard': autoShip.creditcard,
            'shipping-method-id': autoShip.shippingMethod.id,
            'shipping-address': autoShip.address.shipping,
            'billing-address': autoShip.address.billing,
            'autoship-items': autoShip.autoShipItems
          }, {
            transformResponse: camelCaselize,
            transformRequest: function(data) {
              return angular.toJson(dashlize(data));
            }
          }).then(function(response) {
            autoShip.successInfo = response.data.response;
            console.log(autoShip.successInfo);
            return autoShip;
          });
        },

        fetchOrderSummary: function() {
          var autoShip = this;
          return $http.post('/api/v2/autoships/orders/summary', {
            'autoship-items': autoShip.autoShipItems,
            'shipping-address': autoShip.address.shipping,
            'shipping-method-id': autoShip.shippingMethod.id
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

        fetchPaymentMethods: function(countryId) {
          var autoShip = this;
          return $http.get('/api/v2/autoships/payment-methods', {
            transformResponse: camelCaselize,
            cache: true,
            params: {
              'country-id': countryId
            }
          }).then(function(response) {
            autoShip.paymentMethods = response.data.response;
            return autoShip;
          });
        },

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
