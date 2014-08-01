'use strict';

angular.module('2ViVe')
  .factory('Commission', ['$http', 'Dashlize', 'CamelCaseLize',
    function($http, dashlize, camelCaselize) {
      var Commission = function() {};

      Commission.prototype.fetchType = function(){
        var commission = this;
        return $http.get('/api/v2/commissions/monthly/types', {
          transformResponse: camelCaselize
        }).then(function(response) {
          commission.type = response.data.response;
          return commission;
        });
      };

      Commission.prototype.getDate = function(){
        return $http.get('/api/v2/commissions/dates', {
          transformResponse: camelCaselize,
          params : {
            'periods' : 'monthly'
          }
        }).then(function(response){
          return response.data.response.monthly;
        });
      };

      Commission.prototype.fetch = function(date, typeCode, offset, limit){
        return $http.get('/api/v2/commissions/monthly', {
          transformResponse: camelCaselize,
          params : {
            'date' : date,
            'type-code' : typeCode,
            'offset' : offset || undefined,
            'limit' : limit || undefined
          }
        }).then(function(response) {
          return response.data.response;
        });
      };

      Commission.prototype.fetchRank = function(date){
        return $http.get('/api/v2/commissions/ranks', {
          transformResponse: camelCaselize,
          params : {
            'date' : date
          }
        }).then(function(response) {
          return response.data.response;
        });
      };

      return Commission;
    }]);