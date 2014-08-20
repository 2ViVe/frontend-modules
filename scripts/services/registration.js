'use strict';

angular.module('2ViVe')
  .factory('Registration', ['$http', '$q', '$rootScope', 'CamelCaseLize', 'Dashlize',
    function($http, $q, $rootScope, camelCaselize, dashlize) {
      var DEFAULT_REGISTRATION_ROLE_CODE = 'D';

      var countries = [];

      function parseLineItems(lineitems) {
        var _lineItems = [];
        angular.forEach(lineitems, function(lineItem) {
          _lineItems.push({
            'variant-id': lineItem['variant-id'],
            'quantity': lineItem.quantity
          });
        });
        return _lineItems;
      }

      function fetchCountries() {
        var promise;

        if (!countries.length) {
          promise = $http.get('/api/v2/registrations/countries', { cache: true })
            .then(function(ctx) {
              ctx = ctx.data;
              angular.forEach(ctx.response, function(country, idx) {
                countries[idx] = country;
              });
              return countries;
            });
        }
        else {
          var deferred = $q.defer();
          $rootScope.$evalAsync(function() {
            deferred.resolve(countries);
          });
          promise = deferred.promise;
        }

        return promise;
      }

      function getShippingMethods(countryId, stateId, variantIds) {
        return $http.get('/api/v2/registrations/orders/shipping-methods', {
          transformResponse: camelCaselize,
          params: {
            'country-id': countryId,
            'state-id': stateId,
            'variant-ids': variantIds
          }
        });
      }

      function orderSummaryWith(data) {
        data['role-code'] = data['role-code'] ? data['role-code'] : DEFAULT_REGISTRATION_ROLE_CODE;
        return $http.post('/api/v2/registrations/orders/summary', data, {
          transformResponse: camelCaselize,
          transformRequest: function(data) {
            return angular.toJson(dashlize(data));
          }
        }).then(function(response) {
          return response.data.response;
        });
      }

      function orderSummary(homeAddress, shippingAddress, billingAddress, lineItems, webAddress, autoShipLineItems, roleCode) {
        return $http.post('/api/v2/registrations/orders/summary', {
          'home-address': homeAddress,
          'shipping-address': shippingAddress,
          'billing-address': billingAddress,
          'website-address': webAddress,
          'line-items': lineItems,
          'autoship-line-items': autoShipLineItems,
          'role-code': roleCode ? roleCode : DEFAULT_REGISTRATION_ROLE_CODE
        }, {
          transformResponse: camelCaselize,
          transformRequest: function(data) {
            return angular.toJson(dashlize(data));
          }
        });
      }

      function getProducts(countryId, roleCode) {
        return $http.get('/api/v2/registrations/products', {
          transformResponse: camelCaselize,
          params: {
            'country-id': countryId,
            'role-code': roleCode ? roleCode : DEFAULT_REGISTRATION_ROLE_CODE
          }
        });
      }

      function create(paymentMethodId, userInfo, creditcard, homeAddress, shippingMethodId, shippingAddress, billingAddress, lineItems, webAddress, autoShipLineItems) {
        var _userInfo = angular.copy(userInfo);
        _userInfo['role-code'] = DEFAULT_REGISTRATION_ROLE_CODE;
        _userInfo['country-iso'] = userInfo.country.iso;
        delete _userInfo.country;

        return $http.post('/api/v2/registrations', {
          'payment-method-id': paymentMethodId,
          'user-info': _userInfo,
          'creditcard': creditcard,
          'home-address': homeAddress,
          'shipping-method-id': shippingMethodId,
          'shipping-address': shippingAddress,
          'billing-address': billingAddress,
          'website-address': webAddress,
          'line-items': lineItems,
          'autoship-line-items': autoShipLineItems
        }, {
          transformResponse: camelCaselize,
          transformRequest: function(data) {
            return angular.toJson(dashlize(data));
          }
        });
      }

      function createRetail(account, shippingAddress) {
        account.shippingAddress = shippingAddress;
        return $http.post('/api/v2/registrations/retail-customers', account, {
          transformResponse: camelCaselize,
          transformRequest: function(data) {
            return angular.toJson(dashlize(data));
          }
        });
      }

      function validateAvailabilities(key, value) {
        var params = {};
        params[key] = value;
        return $http.get('/api/v2/registrations/availabilities', {
          params: params
        });
      }

      function validateSponsor(sponsorId) {
        return $http.get('/api/v2/registrations/sponsors/' + sponsorId);
      }

      function getCountries() {
        return $http.get('/api/v2/registrations/countries');
      }

      function orderAdjustments(shippingMethodId, lineItems, homeAddress, shippingAddress, billingAddress) {
        return $http.post('/api/v2/registrations/orders/adjustments', {
          'shipping-method-id': shippingMethodId,
          'line-items': parseLineItems(lineItems),
          'home-address': homeAddress,
          'shipping-address': shippingAddress,
          'billing-address': billingAddress,
          'role-code': DEFAULT_REGISTRATION_ROLE_CODE
        });
      }

      return {
        orderAdjustments: orderAdjustments,
        getShippingMethods: getShippingMethods,
        orderSummary: orderSummary,
        orderSummaryWith: orderSummaryWith,
        getProducts: getProducts,
        countries: fetchCountries,
        validateAvailabilities: validateAvailabilities,
        create: create,
        createRetail: createRetail,
        validateSponsor: validateSponsor,
        getCountries: getCountries
      };
    }]);
