'use strict';

angular.module('2ViVe')
  .factory('Address', ['$http', '$q', 'CamelCaseLize', 'Dashlize', function($http, $q, camelCaselize, dashlize) {

    var API_URL = '/api/v2/addresses';

    var addressContainer,
      needCache = false,
      proto;


    function Address(type) {
      this.type = function() {
        return type;
      };
    }


    function mergeAddress(address) {
      if (address.country) {
        address.countryId = address.country.id;
        delete address.country;
      }

      if (address.state) {
        address.stateId = address.state.id;
        delete address.state;
      }
    }

    Address.prototype.toJSON = function() {
      var addr = angular.copy(this, {});
      mergeAddress(addr);
      return addr;
    };

    Address.prototype.validate = function() {
      var deferred = $q.defer();
      var type = this.type();

      function validateHandler(response) {
        var failures = response.data.response.failures;
        if (failures && Object.keys(failures).length) {
          failures = failuresToObject(failures);
          addressContainer[type].errors = failures;
          deferred.reject(failures);
        }
        else {
          delete addressContainer[type].errors;
          deferred.resolve(failures);
        }
      }

      $http
        .post(API_URL + '/' + type + '/validate', this, {
          transformRequest: function(data) {
            return angular.toJson(dashlize(data));
          },
          transformResponse: camelCaselize
        })
        .then(validateHandler);

      return deferred.promise;
    };

    Address.prototype.update = function() {
      var self = this;
      var type = this.type();
      return self.validate()
        .then(function() {
          return $http
            .post(API_URL + '/' + type, self, {
              transformRequest: function(data) {
                return angular.toJson(dashlize(data));
              },
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
        addressContainer = new AddressContainer(resp.data.response);
        return addressContainer;
      });
    }


    return {
      create: function(type) {
        return new Address(type);
      },
      createContainer: function() {
        addressContainer = new AddressContainer();
        return addressContainer;
      },
      fetch: fetchAddress
    };
  }]);

