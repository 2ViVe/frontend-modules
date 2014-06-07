'use strict';

angular.module('2ViVe')
  .factory('Registration.Countries', ['$http', 'DEFAULT_COUNTRY_ID', '$q',
    function($http, DEFAULT_COUNTRY_ID, $q) {

      var Countries = {
        data: [],
        fetch: function() {
          var deferred = $q.defer(),
              promise = deferred.promise;

          if (Countries.data.length > 0) {
            deferred.resolve(Countries);
          } else {
            $http.get('/api/v2/registrations/countries', { cache: true })
              .then(function(response) {
                Countries.data = response.data.response;

                Countries.data.forEach(function(country) {
                   country.getStateById = function(id) {
                     return this.states.filter(function(state) {
                       return state.id === id;
                     })[0];
                   };
                });

                deferred.resolve(Countries);
              });
          }
          return promise;
        },

        defaultCountry: function() {
          var result = null;
          angular.forEach(Countries.data, function(country) {
            if (country.id === DEFAULT_COUNTRY_ID) {
              result = country;
              return null;
            }
          });
          return result;
        },

        findByName: function(name) {
          return Countries
                  .fetch()
                  .then(function() {
                    var countries = Countries.data;
                    return countries.filter(function(country) {
                      return country.name === name;
                    })[0];
                  });
        },

        findById: function(id) {
          return Countries
            .fetch()
            .then(function() {
              var countries = Countries.data;
              return countries.filter(function(country) {
                return country.id === id;
              })[0];
            })
        }
      };

      return Countries;
    }]);