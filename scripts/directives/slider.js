'use strict';

angular.module('2ViVe')
  .directive('slider', ['$timeout',
    function($timeout) {
      return {
        restrict: 'C',
        link: function(scope, element, attrs) {
          var isAutoPlay = attrs.isAutoPlay === 'true' || attrs.isAutoPlay === undefined;
          var delay = attrs.delay === undefined && isAutoPlay ? 7000 : attrs.delay;
          var hasDots = attrs.hasDots === 'true' || attrs.hasDots === undefined;
          $timeout(function() {
            element.find('img').on('load', function() {
              angular.element(element).unslider({
                dots: hasDots,
                autoplay: isAutoPlay,
                delay: delay
              });
            });
          });
        }
      };
    }
  ]);
