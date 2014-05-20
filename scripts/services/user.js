'use strict';

angular.module('2ViVe')
  .factory('User', ['$http', '$q', 'LocalStorage', 'CamelCaseLize', 'Dashlize',
    function($http, $q, LocalStorage, camelCaseLize, dashlize) {

      var useCache = false;
      var user = null;

      function UserModel(data) {
        angular.extend(this, data);
      }

      var proto = UserModel.prototype;

      proto.save = function() {
        var self = this;
        return $http.post('/api/v2/profile', this, {
          transformRequest: function(data) {
            return angular.toJson(dashlize(data));
          },
          transformResponse: camelCaseLize
        }).then(function() {
          useCache = false;
          return self;
        });
      };

      proto.updatePassword = function(passwords) {
        return $http.post('/api/v2/profile/password', passwords, {
          transformRequest: function(data) {
            return angular.toJson(dashlize(data));
          },
          transformResponse: camelCaseLize
        }).then(function(resp) {
          useCache = false;
          return resp.data.response;
        });
      };

      var User = {
        isLogin: false,
        login: function(username, password, isRemember) {
          return $http.post('/api/login', {
            user: username,
            password: password,
            'remember-me': isRemember
          }).success(function() {
            LocalStorage.removeVisitorId();
            User.isLogin = true;
            useCache = false;
          });
        },
        logout: function() {
          return $http.post('/api/logout')
            .success(function() {
              User.isLogin = false;
            });
        },
        fetch: function() {
          var deferred = $q.defer();

          if (useCache && !User.isLogin) {
            deferred.reject(user);
          } else {
            $http.get('/api/v2/profile', {
              transformResponse: camelCaseLize,
              cache: useCache
            }).then(function(resp) {
              if (!user) {
                user = new UserModel(resp.data.response);
              }
              else {
                angular.extend(user, resp.data.response);
              }

              User.data = user;
              User.isLogin = true;
              deferred.resolve(user);
            }).catch(function() {
              User.isLogin = false;
              deferred.reject(user);
            }).finally(function() {
              useCache = true;
            });
          }

          return deferred.promise;
        }
      };
      return User;
    }]);