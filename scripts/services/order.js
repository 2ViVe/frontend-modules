'use strict';

angular.module('2ViVe')
  .factory('Order', ['$http', 'CamelCaseLize', 'Dashlize',
    function($http, CamelCaseLize, dashlize) {
      var Order = {
        data: {},
        updateBillingAddress: function(orderId, billingAddress) {
          return $http.post('/api/v2/orders/' + orderId + '/addresses/billing',
            billingAddress, {
              transformResponse: CamelCaseLize,
              transformRequest: function(data) {
                return angular.toJson(dashlize(data));
              }
            })
            .success(function(data) {
              Order.data.billingAddress = data.response.billingAddress;
            });
        },
        updateShippingAddress: function(orderId, shippingAddress, shippingMethodId) {
          return $http.post('/api/v2/orders/' + orderId + '/shipping', {
            'shipping-method-id': shippingMethodId,
            'shipping-address': shippingAddress
          }, {
            transformResponse: CamelCaseLize,
            transformRequest: function(data) {
              return angular.toJson(dashlize(data));
            }
          }).success(function(data) {
            Order.data.shippingMethod = data.response.shippingMethod;
            Order.data.shippingAddress = data.response.shippingAddress;
          });
        },
        detail: function(id) {
          return $http.get('/api/v2/orders/' + id, {
            transformResponse: CamelCaseLize,
            cache: true
          }).then(function(response) {
            return response.data.response;
          });
        },
        recent: function(offset, limit) {
          return $http.get('/api/v2/orders/recent', {
            transformResponse: CamelCaseLize,
            cache: true,
            params: {
              offset: offset,
              limit: limit
            }
          }).then(function(response) {
            return response.data.response;
          });
        },
        adjustmentsWithOrderId: function(orderId) {
          return $http.get('/api/v2/orders/' + orderId + '/adjustments', {
            transformResponse: CamelCaseLize
          })
            .success(function(data) {
              Order.data.adjustments = data.response;
            });
        },
        currentShippingMethod: function() {
          var currentShippingMethod = null;
          angular.forEach(Order.data.availableShippingMethods, function(shippingMethod) {
            if (shippingMethod.id === Order.data.shippingMethodId) {
              currentShippingMethod = shippingMethod;
              return null;
            }
          });
          return currentShippingMethod;
        },
        checkout: function(shopping, coupons) {
          return $http.post('/api/v2/orders/checkout', {
            'line-items': shopping.items,
            'optional-fields': shopping.optionalFields,
            'coupons': coupons
          }, {
            transformResponse: CamelCaseLize,
            transformRequest: function(data) {
              return angular.toJson(dashlize(data));
            }
          }).then(function(response) {
            Order.shopping = shopping;
            Order.data = response.data.response;
            Order.data.optionalFields = shopping.optionalFields;
            return Order;
          });
        },
        adjustments: function(shippingMethodId) {
          return $http.post('/api/v2/orders/adjustments', {
            'shipping-method-id': shippingMethodId,
            'line-items': Order.data.lineItems,
            'shipping-address': Order.data.shippingAddress,
            'billing-address': Order.data.billingAddress
          }, {
            transformResponse: CamelCaseLize,
            transformRequest: function(data) {
              return angular.toJson(dashlize(data));
            }
          }).success(function(data) {
            Order.data.adjustments = data.response;
          });
        },
        create: function(paymentMethodId, shippingMethodId, creditCard, orderId, giftcard, coupons) {
          if (orderId) {
            return $http.post('/api/v2/orders/' + orderId + '/payments', {
              'giftcard': giftcard,
              'payment-method-id': paymentMethodId,
              'creditcard': creditCard,
              'coupons': coupons
            }, {
              transformResponse: CamelCaseLize,
              transformRequest: function(data) {
                return angular.toJson(dashlize(data));
              }
            });
          }
          return $http.post('/api/v2/orders', {
            'giftcard': giftcard,
            'payment-method-id': paymentMethodId,
            'shipping-method-id': shippingMethodId,
            'creditcard': creditCard,
            'shipping-address': Order.data.shippingAddress,
            'billing-address': Order.data.billingAddress,
            'line-items': Order.data.lineItems,
            'optional-fields': Order.data.optionalFields
          }, {
            transformResponse: CamelCaseLize,
            transformRequest: function(data) {
              return angular.toJson(dashlize(data));
            }
          });
        }
      };
      return Order;
    }]);
