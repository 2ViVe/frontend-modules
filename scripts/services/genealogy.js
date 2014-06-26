'use strict';

angular.module('2ViVe')
  .factory('Genealogy', ['$http', 'CamelCaseLize',
    function($http, camelCaseLize) {
      var Genealogy = function() {
      };

      Genealogy.prototype.fetchPath = function(distributorId) {
        var genealogy = this;
        return $http.get('/api/v2/genealogy/unilevel/path', {
          transformResponse: camelCaseLize,
          cache: true,
          params: {
            'from': distributorId
          }
        }).then(function(response) {
          var path = response.data.response.path.toString();
          genealogy.path = path.split('-').reverse();
          return genealogy;
        });
      };

      Genealogy.prototype.fetchUniLevels = function(distributorId) {
        var genealogy = this;
        if (genealogy.rootId && genealogy.rootId.toString() === distributorId.toString()) {
          distributorId = undefined;
        }
        return $http.get('/api/v2/genealogy/unilevel', {
          transformResponse: camelCaseLize,
          cache: true,
          params: {
            'distributor-id': distributorId
          }
        }).then(function(response) {
          var data = response.data.response;
          if (!distributorId) {
            genealogy.rootId = data.id;
          }
          genealogy.data = data;
          return genealogy;
        });
      };

      return Genealogy;
    }
  ]);
