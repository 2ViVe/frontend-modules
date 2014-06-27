'use strict';

angular.module('2ViVe')
  .factory('BusinessSummary', ['$http', 'Dashlize', 'CamelCaseLize', 'COMPANY_CODE',
    function($http, dashlize, camelCaselize, COMPANY_CODE) {
      var BusinessSummary = function() {};

      BusinessSummary.prototype.fetch = function() {
        var businessSummary = this;
        return $http.get('/api/v2/dashboards/backoffices', {
          params: {
            'company-code': COMPANY_CODE
          },
          transformResponse: camelCaselize
        }).then(function(response) {
          var data = response.data.response;
          businessSummary.data = data;
          return data;
        });
      };

      return BusinessSummary;
    }]);