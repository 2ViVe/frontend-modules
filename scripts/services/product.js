'use strict';

angular.module('2ViVe')
  .factory('Products', ['$http', 'User', 'CamelCaseLize', '$q', 'DEFAULT_COUNTRY_ID', 'UrlHandler', 'DEFAULT_ROLE_CODE',
    function($http, User, CamelCaseLize, $q, DEFAULT_COUNTRY_ID, UrlHandler, DEFAULT_ROLE_CODE) {
      return {
        getByTaxon: function(taxonId, catalogCode) {
          var deferred = $q.defer();

          User.fetch().finally(function() {
            $http.get('/api/v2/products/taxons/' + taxonId, {
              transformResponse: CamelCaseLize,
              cache: true,
              params: {
                'role-code': User.isLogin ? null : DEFAULT_ROLE_CODE,
                'country-id': User.isLogin ? null : DEFAULT_COUNTRY_ID,
                'catalog-code': catalogCode
              }
            }).then(function(response) {
              deferred.resolve(response.data.response);
            }).catch(function(error) {
              if (error.status === 400) {
                UrlHandler.goToRetailSite('/signin');
              }
            });
          });

          return deferred.promise;
        }
      };
    }])
  .factory('Variant', ['$http', 'User', 'CamelCaseLize', 'DEFAULT_ROLE_CODE',
    function($http, User, CamelCaseLize, DEFAULT_ROLE_CODE) {
      return {
        fetch: function(id, catalogCode) {
          return $http.get('/api/v2/variants/' + id, {
            transformResponse: CamelCaseLize,
            cache: true,
            params: {
              'role-code': User.isLogin ? null : DEFAULT_ROLE_CODE,
              'catalog-code': catalogCode
            }
          });
        }
      };
    }])
  .factory('Product', ['$http', 'User', 'CamelCaseLize', '$q', 'DEFAULT_ROLE_CODE', '$sce',
    function($http, User, CamelCaseLize, $q, DEFAULT_ROLE_CODE, $sce) {
      var Product = function(id, catalogCode) {
        var product = this;
        product.id = id;
        product.catalogCode = catalogCode ? catalogCode : null;
      };

      Product.prototype.fetch = function() {
        var deferred = $q.defer();
        var product = this;

        User.fetch().finally(function() {
          $http.get('/api/v2/products/' + product.id, {
            transformResponse: CamelCaseLize,
            params: {
              'role-code': User.isLogin ? null : DEFAULT_ROLE_CODE,
              'catalog-code': product.catalogCode
            }
          }).then(function(response) {
            product.data = response.data.response;

            if (product.data.price === 0 || isNaN(product.data.price)) {
              deferred.reject(product);
              return;
            }

            product.data.description = $sce.trustAsHtml(product.data.description);
            angular.forEach(product.data.variants, function(variant) {
              angular.forEach(variant.options, function(option) {
                if (product[option.type] === undefined) {
                  product[option.type] = [];
                }

                var currentOptions = product[option.type];

                var notAdded = true;
                angular.forEach(currentOptions, function(currentOption) {
                  if (currentOption.name === option.name) {
                    notAdded = false;
                    return;
                  }
                });
                if (notAdded) {
                  currentOptions.push(option);
                }
              });
            });

            deferred.resolve(product);
          }).catch(function(data) {
            deferred.reject(data);
          });
        });

        return deferred.promise;
      };

      Product.prototype.getVariantByOptions = function(options) {
        var result = null;
        var product = this;
        angular.forEach(product.data.variants, function(variant) {
          var isThisVariant = true;
          angular.forEach(variant.options, function(option) {
            if (options[option.type].name !== option.name) {
              isThisVariant = false;
            }
          });
          if (isThisVariant) {
            result = variant;
            return null;
          }
        });
        return result;
      };
      return Product;
    }]);