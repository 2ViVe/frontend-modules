'use strict';

angular.module('2ViVe')
  .factory('Customers', ['$http', 'Dashlize', 'CamelCaseLize',
    function($http, dashlize, camelCaselize) {
      var Customers = function() {};

      Customers.prototype = {

        fetchOrders: function(offset, limit, distributorId) {
          var customers = this;
          return $http.get('/api/v2/customers/orders', {
            params: {
              offset: offset,
              limit: limit,
              'distributor-id': distributorId
            },
            transformResponse: camelCaselize
          }).then(function(response) {
            customers.orders = response.data.response.data;
            customers.orders.pagination = response.data.response.meta;
            return customers;
          });
        },

        fetch: function(offset, limit) {
          var customers = this;
          return $http.get('/api/v2/customers', {
            params: {
              offset: offset,
              limit: limit
            },
            transformResponse: camelCaselize
          }).then(function(response) {
            customers.data = response.data.response.data;
            customers.data.pagination = response.data.response.meta;
            return customers;
          });
        }

      };

      return Customers;
    }]);
