'use strict';

angular.module('2ViVe')
  .factory('Avatar', ['$http',
    function($http) {
      return {
        upload : function(file){
          var formData = new FormData();
          formData.append('avatar', file);
          return $http.put('/api/v2/profile/avatar', formData, {
            'headers' : {
              'Content-Type': undefined
            },
            'transformRequest': angular.identity
          }).then(function(response){
              return response;
            });
        }
      };
    }]);