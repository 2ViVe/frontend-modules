'use strict';

angular.module('2ViVe')
  .factory('Taxons', ['$http', 'CamelCaseLize',
    function($http, CamelCaseLize) {
      var _data = [];

      function hardCodeTaxonImages(taxons) {
        angular.forEach(taxons, function(taxon) {
          taxon.image = 'images/taxon/banner-' + taxon.id + '.png';
          angular.forEach(taxon.subTaxons, function(subTaxon) {
            subTaxon.image = 'images/taxon/banner-' + taxon.id + '-' + subTaxon.id + '.png';
          });
        });
      }

      var Taxons = {
        fetch: function() {
          return $http.get('/api/v2/taxons', {
            transformResponse: CamelCaseLize,
            cache: true
          }).then(function(response) {
            _data = response.data.response;
            hardCodeTaxonImages(_data);
            return Taxons;
          });
        },
        getByPositionBetween: function(startPosition, endPostion) {
          var results = [];
          angular.forEach(_data, function(taxon) {
            if (taxon.position > startPosition && taxon.position < endPostion) {
              results.push(taxon);
              return null;
            }
          });
          return results;
        },
        getSubTaxonById: function(subTaxonId) {
          var result = null;
          angular.forEach(_data, function(taxon) {
            var subTaxon = Taxons.getSubTaxonByIdAndTaxon(subTaxonId, taxon);
            if (subTaxon !== null) {
              result = subTaxon;
              return null;
            }
          });
          return result;
        },
        getSubTaxonByPermalinkAndTaxon: function(permalink, taxon) {
          var result = null;
          if (taxon === null) {
            return result;
          }
          angular.forEach(taxon.subTaxons, function(subTaxon) {
            if (subTaxon.permalink === permalink) {
              result = subTaxon;
              return null;
            }
          });
          return result;
        },
        getSubTaxonByIdAndTaxon: function(subTaxonId, taxon) {
          var result = null;
          if (taxon === null) {
            return result;
          }
          angular.forEach(taxon.subTaxons, function(subTaxon) {
            if (subTaxon.id === subTaxonId) {
              result = subTaxon;
              return null;
            }
          });
          return result;
        },
        getByPermalink: function(permalink) {
          var result = null;
          angular.forEach(_data, function(taxon) {
            if (taxon.permalink === permalink) {
              result = taxon;
              return null;
            }
          });
          return result;
        },
        getById: function(id) {
          var result = null;
          angular.forEach(_data, function(taxon) {
            if (taxon.id === id) {
              result = taxon;
              return null;
            }
          });
          return result;
        }
      };
      return Taxons;
    }]);