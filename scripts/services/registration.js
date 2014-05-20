'use strict';

angular.module('2ViVe')
  .factory('Registration', ['$http', '$q', '$rootScope',
    function($http, $q, $rootScope) {
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

      function getShippingMethods(countryId, stateId) {
        return $http.get('/api/v2/registrations/orders/shipping-methods', {
          params: {
            'country-id': countryId,
            'state-id': stateId
          }
        });
      }

      function orderSummary(homeAddress, shippingAddress, billingAddress, lineItems, webAddress, roleCode) {
        return $http.post('/api/v2/registrations/orders/summary', {
          'home-address': homeAddress,
          'shipping-address': shippingAddress,
          'billing-address': billingAddress,
          'web-address': webAddress,
          'line-items': parseLineItems(lineItems),
          'role-code': roleCode ? roleCode : DEFAULT_REGISTRATION_ROLE_CODE
        });
      }

      function getProducts(countryId, roleCode) {
        return $http.get('/api/v2/registrations/products', {
          params: {
            'country-id': countryId,
            'role-code': roleCode ? roleCode : DEFAULT_REGISTRATION_ROLE_CODE
          }
        });
      }

      function create(paymentMethodId, userInfo, creditcard, homeAddress, shippingMethodId, shippingAddress, billingAddress, lineItems, webAddress) {
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
          'web-address': webAddress,
          'line-items': parseLineItems(lineItems)
        });
      }

      function createRetail(sponsor, login, password, email, shippingAddress) {
        return $http.post('/api/v2/registrations/retail-customers', {
          sponsor: sponsor,
          login: login,
          password: password,
          email: email,
          'shipping-address': shippingAddress
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
        getProducts: getProducts,
        countries: fetchCountries,
        validateAvailabilities: validateAvailabilities,
        create: create,
        createRetail: createRetail,
        validateSponsor: validateSponsor,
        getCountries: getCountries
      };
    }]);