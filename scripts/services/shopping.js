'use strict';

angular.module('2ViVe')
  .factory('Shopping', ['$http', 'LocalStorage', 'User', '$location', 'Variant', '$q', 'DEFAULT_ROLE_CODE',
    function($http, LocalStorage, User, $location, Variant, $q, DEFAULT_ROLE_CODE) {
      var Shopping = {
        mergeItems: function() {
          return Shopping.addItems(Shopping.items);
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
          return Shopping.update();
        },
        update: function() {
          var url = User.isLogin ?
            '/api/v2/shopping-carts/users/line-items' :
            '/api/v2/shopping-carts/visitors/' + LocalStorage.getVisitorId() + '/line-items';
          return $http.put(url, Shopping.items);
        },
        addItems: function(items) {
          var url = User.isLogin ?
            '/api/v2/shopping-carts/users/line-items' :
            '/api/v2/shopping-carts/visitors/' + LocalStorage.getVisitorId() + '/line-items';
          return $http.post(url, items)
            .success(function(data) {
              Shopping.items = data.response;
            });
        },
        add: function(variant, quantity, catalogCode) {
          var url = User.isLogin ?
            '/api/v2/shopping-carts/users/line-items' :
            '/api/v2/shopping-carts/visitors/' + LocalStorage.getVisitorId() + '/line-items';

          return $http.post(url, [
            {
              'variant-id': variant.id,
              'quantity': quantity,
              'catalog-code': catalogCode,
              'role-code': User.isLogin ? null : DEFAULT_ROLE_CODE
            }
          ]).success(function(data) {
            Shopping.items = data.response;
          });
        },
        deleteAll: function() {
          var url = User.isLogin ?
            '/api/v2/shopping-carts/users' :
            '/api/v2/shopping-carts/visitors/' + LocalStorage.getVisitorId();
          return $http.delete(url)
            .success(function() {
              Shopping.items = [];
            });
        },
        empty: function() {
          var url = User.isLogin ?
            '/api/v2/shopping-carts/users/line-items' :
            '/api/v2/shopping-carts/visitors/' + LocalStorage.getVisitorId() + '/line-items';

          return $http.put(url, [])
            .success(function(data) {
              Shopping.items = data.response;
            });
        },
        fetch: function() {
          var updateItemsWithVariantsData = function() {
            angular.forEach(Shopping.items, function(item) {
              Variant.fetch(item['variant-id'], item['catalog-code'])
                .then(function(response) {
                  item.data = response.data.response;
                });
            });
          };

          var deferred = $q.defer();
          User.fetch().finally(function() {
            if (User.isLogin) {
              $http.get('/api/v2/shopping-carts/users')
                .then(function(response) {
                  Shopping.items = response.data.response['line-items'];
                  updateItemsWithVariantsData();
                  deferred.resolve(Shopping);
                });
            } else if (LocalStorage.isVisitorIdSaved()) {
              $http.get('/api/v2/shopping-carts/visitors/' + LocalStorage.getVisitorId(), {
                params: {
                  'role-code': DEFAULT_ROLE_CODE
                }
              }).then(function(response) {
                  Shopping.items = response.data.response['line-items'];
                  updateItemsWithVariantsData();
                  deferred.resolve(Shopping);
                });
            } else {
              $http.post('/api/v2/shopping-carts/visitors', {
                'id': LocalStorage.createVisitorId(),
                'role-code': DEFAULT_ROLE_CODE
              }).then(function(response) {
                Shopping.items = response.data.response['line-items'];
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