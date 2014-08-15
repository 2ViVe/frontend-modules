'use strict';

(function() {

  angular.module('2ViVe')
    .controller('profileAddressPanelCtrl', ['$scope',
      function($scope) {

        $scope.isEditing = false;
        $scope.initAddress = angular.copy($scope.address);

        $scope.restore = function() {
          angular.extend($scope.address, $scope.initAddress);
          $scope.address.country = $scope.countries.data.filter(function(country) {
            return country.id === $scope.initAddress.country.id;
          })[0];
          $scope.address.state = $scope.address.country.getStateById($scope.initAddress.state.id);
        };

        $scope.toggle = function() {
          $scope.isEditing = !$scope.isEditing;
        };

        $scope.save = function(isValid) {
          if (!isValid) {
            return;
          }
          $scope.address.update()
            .then(function() {
              $scope.isEditing = false;
              $scope.initAddress = angular.copy($scope.address);
            })
            .catch(function() {
              $scope.isEditing = true;
            });
        };

      }])
    .directive('viveProfileAddressPanel', function() {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: function(element, attr) {
          var templateUrl = attr.templateUrl;
          return templateUrl ? templateUrl : 'bower_components/2ViVe-local/views/profile/profile-address-panel.html';
        },
        controller: 'profileAddressPanelCtrl',
        scope: {
          addressType: '@',
          addressTitle: '@',
          countries: '=',
          address: '='
        }
      };
    });

})();
