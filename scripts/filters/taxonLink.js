'use strict';

angular.module('2ViVe')
  .filter('taxonLink', function() {
    return function(taxon) {
      if (taxon === null || taxon === undefined) {
        return;
      }
      var link = '#/products/' + taxon.permalink;
      var subTaxons = taxon.subTaxons;
      if (subTaxons.length > 0) {
        link += '/' + subTaxons[0].permalink;
      }
      return link;
    };
  });
