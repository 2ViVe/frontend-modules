'use strict';

angular.module('2ViVe')
  .filter('imageSize', function() {
    return function(image, size) {
      if (image === undefined) {
        return '';
      }
      return image.replace('large', size);
    };
  });