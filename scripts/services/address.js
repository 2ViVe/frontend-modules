'use strict';

angular.module('2ViVe')
  .factory('Address', ['$http', '$q', 'CamelCaseLize', 'Dashlize', 'Registration.Countries', function($http, $q, camelCaselize, dashlize, Countries) {

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

    Address.prototype.fetch = function() {
      var type = this.type();
      return $http.get(API_URL, {
        params: {
          types: type
        },
        transformResponse: camelCaselize
      }).then(function(response) {
        return response.data.response[type];
      });
    };

    Address.prototype.cleanData = function() {
      this.firstName = '';
      this.m = '';
      this.lastName = '';
      this.phone = '';

      if (this.type() !== 'website') {
        this.street = '';
        this.streetCont = '';
        this.city = '';
        this.zip = '';
        this.phone = '';
      }
    };

    function extendData(from, to, type) {
      to.firstName = from.firstName;
      to.m = from.m;
      to.lastName = from.lastName;
      to.phone = from.phone;

      if (type !== 'website') {
        to.street = from.street;
        to.streetCont = from.streetCont;
        to.city = from.city;
        to.state = from.state;
        to.country = from.country;
        to.zip = from.zip;
        to.phone = from.phone;
      }
    }

    Address.prototype.extendDataTo = function(address) {
      extendData(this, address, this.type());
    };

    Address.prototype.extendDataFrom = function(address) {
      extendData(address, this, this.type());
    };

    Address.prototype.validate = function() {
      var deferred = $q.defer();
      var type = this.type();
      var address = this;

      function validateHandler(response) {
        var failures = response.data.response.failures;
        if (failures && Object.keys(failures).length) {
          failures = failuresToObject(failures);
          address.errors = failures;
          deferred.reject(failures);
        }
        else {
          delete address.errors;
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

    function AddressContainer(data) {
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

    proto.fullfill = function() {
      var self = this;
      var promises = this.types.map(function(type) {
        var addr = self[type];

        return Countries
                .findById(addr.countryId)
                .then(function(country) {
                  addr.country = country;
                  addr.state = country.getStateById(addr.stateId);
                  return addr
                });
      });

      return $q.all(promises).then(function() { return self });
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
        if (failure.field === '') {
          result[failure.code] = failure.message;
        } else {
          result[failure.field] = failure.message;
        }
      });

      return camelCaselize(result);
    }

    function fetchAddress() {
      return $http.get(API_URL, {
        transformResponse: camelCaselize,
        cache: needCache
      }).then(function(resp) {
        needCache = true;
        addressContainer = new AddressContainer();
        addressContainer.extend(resp.data.response);
        return addressContainer.fullfill();
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

