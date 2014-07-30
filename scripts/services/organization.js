'use strict';

angular.module('2ViVe')
  .factory('Organization', ['$http', 'Dashlize', 'CamelCaseLize',
    function($http, dashlize, camelCaselize) {
      var Organization = function() {};

      Organization.prototype.fetch = function(date, isShowOrderList, distributorId, page, limit){
        if (distributorId) {
          return this.searchByDistributorId(date, isShowOrderList, distributorId, page, limit);
        }
        return $http.get('/api/v2/reports/organizations/unilevel', {
          transformResponse: camelCaselize,
          params : {
            'date' : date,
            'orders_only' : isShowOrderList ? 1 : undefined,
            'offset' : page || undefined,
            'limit' : limit || 25
          }
        }).then(function(response) {
            return response.data.response;
          });
      };

      Organization.prototype.searchByDistributorId = function(date, isShowOrderList, distributorId, page){
        return $http.get('/api/v2/reports/organizations/unilevel/' + distributorId, {
          transformResponse: camelCaselize,
          params : {
            'date' : date,
            'orders_only' : isShowOrderList ? 1 : undefined,
            'offset' : page || undefined,
            'limit' : limit || 25
          }
        }).then(function(response){
            var data = [];
            data.rows = [];
            data.rows.push(response.data.response);
            return data;
          });
      };

      Organization.prototype.getDate = function(){
        return $http.get('/api/v2/commissions/dates', {
          transformResponse: camelCaselize,
          params : {
            'periods' : 'monthly'
          }
        }).then(function(response){
            return response.data.response.monthly;
          });
      };
      return Organization;
    }]);
