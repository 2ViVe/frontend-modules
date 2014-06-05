'use strict';

angular
  .module('2ViVe')
  .controller('AddressPanelCtrl', ['$scope', 'Registration.Countries', function($scope, Countries) {

    if ($scope.addressType !== 'website') {
      Countries
        .fetch()
        .then(function(countries) {
          $scope.countries = countries.data;

          if (!$scope.defaultUseHomeAddress) {
            $scope.address.country = Countries.defaultCountry();
            $scope.address.state = $scope.address.country.states[0];
          }
        });
    }

    if ($scope.defaultUseHomeAddress) {
      $scope.isUseHomeAddress = true;
      $scope.address.extendDataFrom($scope.homeAddress);
    } else {
      $scope.isUseHomeAddress = false;
    }

    $scope.isUseHomeAddressChange = function(isUseHomeAddress) {
      if (isUseHomeAddress) {
        $scope.address.extendDataFrom($scope.homeAddress);
      } else {
        $scope.address.cleanData();
      }
    };
  }]);
