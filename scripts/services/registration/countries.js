'use strict';

angular.module('2ViVe')
  .factory('Registration.Countries', ['$http', 'DEFAULT_COUNTRY_ID',
    function($http, DEFAULT_COUNTRY_ID) {

      function Countries() {
        this.data = [];
      }

      Countries.prototype.fetch = function() {
        var countries = this;
        return $http.get('/api/v2/registrations/countries', { cache: true })
          .then(function(response) {
            countries.data = response.data.response;
            return countries;
          });
      };

      Countries.prototype.defaultCountry = function() {
        var result = null;
        angular.forEach(this.data, function(country) {
          if (country.id === DEFAULT_COUNTRY_ID) {
            result = country;
            return null;
          }
        });
        return result;
      };

      return Countries;
    }]);