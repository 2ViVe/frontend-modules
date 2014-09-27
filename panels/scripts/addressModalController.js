'use strict';

angular
  .module('2ViVe')
  .controller('AddressModalController', ['$scope', '$modalInstance', 'Address', 'address', 'type', 'title',
    function($scope, $modalInstance, Address, address, type, title) {
      $scope.type = type;
      $scope.title = title;
      $scope.address = Address.create($scope.type);
      $scope.address.fullFill(address);

      $scope.submit = function() {
        if ($scope.submitted || this.form.$valid) {

          if ($scope.address.country.name === "Russian Federation") {
            $scope.address.state = null;
            $scope.address.stateId = null;
          };

          $scope.address.validate()
            .then(function() {
              $modalInstance.close($scope.address);
            });
        }
        $scope.submitted = true;
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };
    }]);
