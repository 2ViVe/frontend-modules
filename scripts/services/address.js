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
        result[failure.code] = {
          message : failure.message,
          field: failure.field
        };
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


    function Address(type) {
      this.type = type;
    }


    function mergeAddress(address) {
      address.countryId = address.country.id;
      address.stateId = address.state.id;

      delete address.country;
      delete address.state;
    }

    Address.prototype.toJSON = function() {
      var addr;
      if (type === 'web') {
        return angular.toJSON({
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          phone: this.phone
        });
      }
      else {
        addr = angular.copy(this);
        mergeAddress(addr);
        return angular.toJSON(addr);
      }
    };

    Address.prototype.validate = function() {
      var deferred = $q.defer();
      var type = this.type;

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
        .post(API_URL + '/' + type + '/validate', this, {
          transformRequest: function(data)  { return angular.toJson(dashlize(data)); },
          transformResponse: camelCaselize
        })
        .then(validateHandler);

      return deferred.promise;
    };

    Address.prototype.update = function() {
      var self = this;

      return self.validate()
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

    function AddressContainer() {
      this.types = [];
    }


    proto = AddressContainer.prototype;

    proto.addType = function(type) {
      this.types.push(type);
      this[type] = new Address(type);
      return this;
    };

    proto.extend = function(address) {
      var self = this;
      var addressTypes = ['home', 'billing', 'shipping', 'website'];
      angular.forEach(addressTypes, function(type) {

        if (!self[type] && address[type]) {
          self.addType(type);
        }

        if (!address[type]) {
          return;
        }

        angular.extend(self[type], address[type]);
      });

      return this;
    };

    proto.validate = function() {
      var self = this;
      return $q
                .all(this.types.map(function(type) {
                  return self[type].validate();
                }))
                .then(function(results) {
                  return results.every(function(result) {
                    return result;
                  });
                });
    };

    function failuresToObject(failures) {
      var result = {};
      angular.forEach(failures, function(failure) {
        result[failure.field] = failure.message;
      });

      return camelCaselize(result);
    }

    function fetchAddress() {
      return $http.get(API_URL, {
        transformResponse: camelCaselize,
        cache: needCache
      }).then(function(resp) {
        needCache = true;
        address = new AddressContainer(resp.data.response);
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
      Address: Address,
      AddressContainer: AddressContainer,
      fetch: fetchAddress,
      validateShippingAddressNew: validateAddressWithUrl(SHIPPING_ADDRESS_VALIDATE_URL),
      validateBillingAddressNew: validateAddressWithUrl(BILLING_ADDRESS_VALIDATE_URL),
      validateWebAddressNew: validateAddressWithUrl(WEB_ADDRESS_VALIDATE_URL),
      validateHomeAddressNew: validateAddressWithUrl(HOME_ADDRESS_VALIDATE_URL)
    };
  }]);

