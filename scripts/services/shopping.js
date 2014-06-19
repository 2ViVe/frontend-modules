'use strict';

angular.module('2ViVe')
  .factory('Shopping', ['$http', 'LocalStorage', 'User', '$location', 'Variant', '$q', 'DEFAULT_ROLE_CODE', 'CamelCaseLize', 'Dashlize',
    function($http, LocalStorage, User, $location, Variant, $q, DEFAULT_ROLE_CODE, CamelCaseLize, dashlize) {
      var Shopping = {
        optionalFields: undefined,
        addOptionalFields: function(options) {
          Shopping.optionalFields = angular.extend(Shopping.optionalFields ? Shopping.optionalFields : {}, options);
        },
        removeOptionalField: function(key) {
          if (Shopping.optionalFields[key]) {
            delete Shopping.optionalFields[key];
          }
        },
        mergeItems: function() {
          return Shopping.addItems(Shopping.processedItems());
        },
        checkout: function() {
          $location.path('/checkout');
        },
        continueShopping: function() {
          var path = LocalStorage.getPathToContinueShopping();
          LocalStorage.removePathToContinueShopping();
          $location.path(path);
        },
        removeItem: function(item) {
          var itemIndex;
          angular.forEach(Shopping.items, function(_item, index) {
            if (_item === item) {
              itemIndex = index;
            }
          });
          Shopping.items.splice(itemIndex, 1);
          return Shopping.updateItems();
        },
        processedItems: function() {
          var items = angular.copy(Shopping.items);
          angular.forEach(items, function(item) {
            delete item.data;
            delete item.retailPrice;
            delete item.newQuantity;
          });
          return items;
        },
        update: function() {
          return $http.post('/api/v2/shopping-carts/users', {
            'line-items': Shopping.processedItems(),
            'optional-fields': Shopping.optionalFields
          }, {
            transformResponse: CamelCaseLize,
            transformRequest: function(data) {
              return angular.toJson(dashlize(data));
            }
          });
        },
        updateItems: function() {
          var url = User.isLogin ?
            '/api/v2/shopping-carts/users/line-items' :
            '/api/v2/shopping-carts/visitors/' + LocalStorage.getVisitorId() + '/line-items';
          return $http.put(url, Shopping.processedItems(), {
            transformResponse: CamelCaseLize,
            transformRequest: function(data) {
              return angular.toJson(dashlize(data));
            }
          });
        },
        addItems: function(items) {
          var url = User.isLogin ?
            '/api/v2/shopping-carts/users/line-items' :
            '/api/v2/shopping-carts/visitors/' + LocalStorage.getVisitorId() + '/line-items';
          return $http.post(url, items, {
            transformResponse: CamelCaseLize,
            transformRequest: function(data) {
              return angular.toJson(dashlize(data));
            }
          }).success(function(data) {
            Shopping.items = data.response;
          });
        },
        add: function(variant, quantity, catalogCode, personalizedValues) {
          var url = User.isLogin ?
            '/api/v2/shopping-carts/users/line-items' :
            '/api/v2/shopping-carts/visitors/' + LocalStorage.getVisitorId() + '/line-items';

          return $http.post(url, [
            {
              'variant-id': variant.id,
              'quantity': quantity,
              'catalog-code': catalogCode,
              'personalized-values': personalizedValues
            }
          ], {
            transformResponse: CamelCaseLize,
            transformRequest: function(data) {
              return angular.toJson(dashlize(data));
            }
          }).success(function(data) {
            Shopping.items = data.response;
          });
        },
        deleteAll: function() {
          var url = User.isLogin ?
            '/api/v2/shopping-carts/users' :
            '/api/v2/shopping-carts/visitors/' + LocalStorage.getVisitorId();
          return $http.delete(url, {
            transformResponse: CamelCaseLize
          }).success(function() {
            Shopping.items = [];
          });
        },
        empty: function() {
          var url = User.isLogin ?
            '/api/v2/shopping-carts/users/line-items' :
            '/api/v2/shopping-carts/visitors/' + LocalStorage.getVisitorId() + '/line-items';

          return $http.put(url, [], {
            transformResponse: CamelCaseLize,
            transformRequest: function(data) {
              return angular.toJson(dashlize(data));
            }
          })
            .success(function(data) {
              Shopping.items = data.response;
            });
        },
        fetch: function() {
          var updateItemsWithVariantsData = function() {
            angular.forEach(Shopping.items, function(item) {
              Variant.fetch(item.variantId, item.catalogCode)
                .then(function(response) {
                  item.data = response.data.response;
                  angular.forEach(response.data.response.prices, function(price) {
                    if (price.roleCode === 'R') {
                      item.retailPrice = price.price;
                      return null;
                    }
                  });
                });
            });
          };

          var deferred = $q.defer();
          User.fetch().finally(function() {
            if (User.isLogin) {
              $http.get('/api/v2/shopping-carts/users', {
                transformResponse: CamelCaseLize
              }).then(function(response) {
                Shopping.items = response.data.response.lineItems;
                Shopping.optionalFields = response.data.response.optionalFields;
                updateItemsWithVariantsData();
                deferred.resolve(Shopping);
              });
            } else if (LocalStorage.isVisitorIdSaved()) {
              $http.get('/api/v2/shopping-carts/visitors/' + LocalStorage.getVisitorId())
                .then(function(response) {
                  Shopping.items = response.data.response.lineItems;
                  Shopping.optionalFields = response.data.response.optionalFields;
                  updateItemsWithVariantsData();
                  deferred.resolve(Shopping);
                });
            } else {
              $http.post('/api/v2/shopping-carts/visitors', {
                'id': LocalStorage.createVisitorId()
              }, {
                transformResponse: CamelCaseLize,
                transformRequest: function(data) {
                  return angular.toJson(dashlize(data));
                }
              }).then(function(response) {
                Shopping.items = response.data.response.lineItems;
                Shopping.optionalFields = response.data.response.optionalFields;
                updateItemsWithVariantsData();
                deferred.resolve(Shopping);
              });
            }
          });
          return deferred.promise;
        }
      };
      return Shopping;
    }]);
