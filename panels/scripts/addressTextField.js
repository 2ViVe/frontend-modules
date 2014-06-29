'use strict';

angular
  .module('2ViVe')
  .directive('addressField', function() {
    return {
      require: '^form',
      replace: true,
      templateUrl: function(el, attr) {
        return attr.tpl || 'bower_components/2ViVe/panels/views/address-text-field.html';
      },
      transclude: true,
      scope: {
        addressType: '&',
        name: '@',
        label: '@',
        required: '@'
      },
      link: function() {
      }
    };
  });
