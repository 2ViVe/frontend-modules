'use strict';

(function() {

  angular.module('2ViVe')
    .controller('profileInfoPanelCtrl', ['$scope', 'User', '$http', '$q', 'LocalStorage', '$location',
      function($scope, User, $http, $q, LocalStorage, $location) {
        $scope.isEditing = false;
        $scope.isLoading = true;
        $scope.submitted = false;

        $scope.passwords = {
          newPassword: '',
          oldPassword: ''
        };

        User.fetch().then(function(result) {
          $scope.profile = result;
          $scope.isLoading = false;
          $scope.initProfile = angular.copy($scope.profile);
        }).catch(function() {
          LocalStorage.setPathAfterLogin($location.path());
          $location.path('/signin');
        });

        $scope.toggle = function() {
          $scope.isEditing = !$scope.isEditing;
        };

        $scope.restore = function() {
          angular.extend($scope.profile, $scope.initProfile);
        };

        $scope.changePassword = function(isValid) {
          $scope.submitted = true;
          if (!isValid) {
            return;
          }
          $scope
            .profile
            .updatePassword($scope.passwords).then(function() {
              $scope.isEditing = false;
              $scope.submitted = false;
              $scope.$errors = {};
            })
            .catch(respErrHandler);
        };


        // TODO: remove this when backend api fixed
        function checkEmailAvalibility(needCheck) {
          var deferred = $q.defer();

          if (needCheck) {
            $http.get('/api/v2/registrations/availabilities', {
              params: { email: $scope.profile.email }
            }).success(function(data) {
              (data.response.available ? deferred.resolve : deferred.reject)({
                data: {
                  meta: {
                    error: {
                      errorCode: 'InvalidEmail',
                      message: 'Email is not available.'
                    }
                  }
                }
              });
            });
          }
          else {
            $scope.$evalAsync(function() {
              deferred.resolve(true);
            });
          }

          return deferred.promise;
        }

        function respErrHandler(resp) {
          $scope.isLoading = false;
          $scope.isEditing = true;
          if (!resp.data.meta || !resp.data.meta.error) {
            return;
          }
          var error = resp.data.meta.error;
          $scope.$errors = {};
          $scope.$errors[error.errorCode] = error.message;
        }

        $scope.save = function() {
          $scope.submitted = true;
          $scope.isLoading = true;
          checkEmailAvalibility($scope.profile.email !== $scope.initProfile.email)
            .then(function() {
              $scope.initProfile.email = $scope.profile.email;
              return $scope.profile.save();
            })
            .then(function() {
              $scope.isLoading = false;
              $scope.isEditing = false;
              $scope.initProfile = angular.copy($scope.profile);
            })
            .catch(respErrHandler);
        };

        $scope.refreshImage = function(imageUrl) {
          $scope.profile.imageUrl = imageUrl;
        };

      }])
    .directive('profileInfoPanel', function() {
      return {
        restrict: 'A',
        replace: true,
        templateUrl: '/views/profile/profile-info-panel.html',
        controller: 'profileInfoPanelCtrl',
        scope: {},
        link: function() {

        }
      };
    });

})();

