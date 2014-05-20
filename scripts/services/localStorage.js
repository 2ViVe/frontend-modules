'use strict';

angular.module('2ViVe')
  .factory('LocalStorage', ['$cookies', 'UUID',
    function($cookies, UUID) {
      return {
        createVisitorId: function() {
          $cookies.visitorId = UUID.generate();
          return $cookies.visitorId;
        },
        isVisitorIdSaved: function() {
          return $cookies.visitorId;
        },
        removeVisitorId: function() {
          delete $cookies.visitorId;
        },
        getVisitorId: function() {
          return $cookies.visitorId;
        },
        setPathAfterLogin: function(path) {
          $cookies.pathAfterLogin = path;
        },
        getPathAfterLogin: function() {
          return $cookies.pathAfterLogin ? $cookies.pathAfterLogin : '/';
        },
        removePathAfterLogin: function() {
          delete $cookies.pathAfterLogin;
        },
        setPathToContinueShopping: function(path) {
          $cookies.pathToContinueShopping = path;
        },
        getPathToContinueShopping: function() {
          return $cookies.pathToContinueShopping ? $cookies.pathToContinueShopping : '/';
        },
        removePathToContinueShopping: function() {
          delete $cookies.pathToContinueShopping;
        },
        getReplicateOwner: function() {
          var owner = $cookies['replicate-site-owner'];
          if (!owner) {
            return null;
          }
          owner = owner.slice(2);
          try {
            return angular.fromJson(owner);
          } catch(e) {
            return null;
          }
        }
      };
    }]);