'use strict';

(function() {

  angular.module('2ViVe')
    .controller('profileAccountPanelCtrl', ['$scope', '$location', 'Avatar',
      function($scope, $location, Avatar) {
        $scope.isEditing = false;
        $scope.submitted = false;

        $scope.passwords = {
          newPassword: '',
          oldPassword: ''
        };

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

        function respErrHandler(resp) {
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
          $scope.profile.save()
            .then(function() {
              $scope.isEditing = false;
              $scope.initProfile = angular.copy($scope.profile);
            })
            .catch(respErrHandler);
        };

        $scope.refreshImage = function(imageUrl) {
          $scope.profile.imageUrl = imageUrl;
        };

        $scope.upload = Avatar.upload;

      }])
    .directive('viveProfileAccountPanel', function() {
      return {
        restrict: 'E',
        templateUrl: function(element, attr) {
          return attr.tpl ? attr.tpl : 'bower_components/2ViVe-local/views/profile/profile-account-panel.html';
        },
        controller: 'profileAccountPanelCtrl',
        scope: {
          profile: '=',
          initProfile: '='
        }
      };
    });

})();

