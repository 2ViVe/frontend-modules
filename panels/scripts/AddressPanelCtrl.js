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
            if (!$scope.address.country) {
              $scope.address.country = Countries.defaultCountry();
            }
            if (!$scope.address.state) {
              $scope.address.state = $scope.address.country.states[0];
            }
          }
        });
    }

    if ($scope.defaultUseHomeAddress) {
      $scope.isUseHomeAddress = true;
      if (!$scope.address.country) {
        $scope.address.extendDataFrom($scope.homeAddress);
      }
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

    $scope.validate = function() {
      $scope
        .address
        .validate()
        .then(null, function(failures) {
          var keys = Object.keys(failures);
          angular.forEach(keys, function(key) {
            if ($scope.addressForm[key]) {
              $scope.addressForm[key].$setValidity('remoteError', false);
            }
          });
        });
    };

  }]);