'use strict';

angular.module('2ViVe')
  .factory('Address', ['$http', '$q', 'CamelCaseLize', 'Dashlize', function ($http, $q, camelCaselize, dashlize) {

    var SHIPPING_ADDRESS_VALIDATE_URL = '/api/v2/addresses/shipping/validate',
        BILLING_ADDRESS_VALIDATE_URL = '/api/v2/addresses/billing/validate',
        WEB_ADDRESS_VALIDATE_URL = '/api/v2/addresses/website/validate',
        HOME_ADDRESS_VALIDATE_URL = '/api/v2/addresses/home/validate';

    function processFailures(failures) {
      var result = {};
      angular.forEach(failures, function (failure) {
        result[failure.code] = failure.message;
      });
      return result;
    }

    function validateAddressWithUrl(url) {
      function validateAddress(address) {

        var deferred = $q.defer(),
            promise = deferred.promise;
        $http
          .post(url, address)
          .success(function (data) {
            (data.response.failures.length ? deferred.reject : deferred.resolve)(
              processFailures(data.response.failures)
            );
          })
          .error(function (data) {
            deferred.reject(data);
          });

        return promise;
      }

      return validateAddress;
    }


    var API_URL = '/api/v2/addresses';

    var address,
        needCache = false,
        proto;

    function Address(data) {

      this.home = {};
      this.billing = {};
      this.website = {};
      this.shipping = {};

      this.extend(data);
    }

    proto = Address.prototype;

    proto.extend = function(address) {
      var self = this;
      angular.forEach(['home', 'billing', 'shipping', 'website'], function(type) {

        self[type].update = function() {
          return self.update(type, self[type]);
        };

        if (!address[type]) {
          return;
        }
        angular.extend(self[type], address[type]);
      });

      return this;
    };

    proto.validate = function(type, data) {
      var deferred = $q.defer();

      function validateHandler(response) {
        var failures = response.data.response.failures;
        if (failures && Object.keys(failures).length) {
          failures = failuresToObject(failures);
          address[type].errors = failures;
          deferred.reject(failures);
        }
        else {
          delete address[type].errors;
          deferred.resolve(failures);
        }
      }

      $http
        .post(API_URL + '/' + type + '/validate', data, {
          transformRequest: function(data)  { return angular.toJson(dashlize(data)); },
          transformResponse: camelCaselize
        })
        .then(validateHandler);

      return deferred.promise;
    };

    function failuresToObject(failures) {
      var result = {};
      angular.forEach(failures, function(failure) {
        result[failure.field] = failure.message;
      });

      return camelCaselize(result);
    }

    proto.update = function(type, data) {
      var self = this;

      return self.validate(type, data)
        .then(function() {
          return $http
            .post(API_URL + '/' + type, data, {
              transformRequest: function(data)  { return angular.toJson(dashlize(data)); },
              transformResponse: camelCaselize
            });
        })
        .then(function(resp) {
          var data = resp.data.response;
          angular.extend(self[type], data);
          return data;
        });
    };

    function fetchAddress() {
      return $http.get(API_URL, {
        transformResponse: camelCaselize,
        cache: needCache
      }).then(function(resp) {
        needCache = true;
        address = address ? address.extend(resp.data.response) : new Address(resp.data.response);
        return address;
      });
    }


    return {
      // will be deprecated - zekai
      validateHomeAddress: function (homeAddress) {
        return $http.post('/api/v2/addresses/home/validate', homeAddress);
      },
      validateWebAddress: function (webAddress) {
        return $http.post('/api/v2/addresses/website/validate', webAddress);
      },
      validateShippingAddress: function (shippingAddress) {
        return $http.post('/api/v2/addresses/shipping/validate', shippingAddress);
      },
      validateBillingAddress: function (billingAddress) {
        return $http.post('/api/v2/addresses/billing/validate', billingAddress);
      },
      fetch: fetchAddress,
      validateShippingAddressNew: validateAddressWithUrl(SHIPPING_ADDRESS_VALIDATE_URL),
      validateBillingAddressNew: validateAddressWithUrl(BILLING_ADDRESS_VALIDATE_URL),
      validateWebAddressNew: validateAddressWithUrl(WEB_ADDRESS_VALIDATE_URL),
      validateHomeAddressNew: validateAddressWithUrl(HOME_ADDRESS_VALIDATE_URL)
    };
  }]);

