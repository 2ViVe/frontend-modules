'use strict';

angular.module('2ViVe')
  .directive('viveFileReader', function() {
    return {
      restrict: 'E',
      scope: {
        onUploaded: '=',
        upload: '='
      },
      link: function(scope, element) {
        var $element = angular.element(element),
          $fileInput = $element.find('input');

        $element.find('button').on('click', function() {
          $fileInput.click();
        });

        $fileInput.on('change', function(changeEvent) {
          var file = changeEvent.target.files;
          if (file.length === 0) {
            return;
          }
          scope.upload(file[0]).then(function(reslut) {
            scope.onUploaded(reslut.data.response['image-url']);
          });
        });
      }
    };
  });
