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
          var slider;

          scope.nextSlide = function() {
            slider.next();
          };

          scope.previousSlide = function() {
            slider.prev();
          };

          $timeout(function() {
            var images = element.find('img');
            images.hide();
            images.on('load', function() {

              images.show();

              if (slider === undefined) {
                slider = angular.element(element).unslider({
                  dots: hasDots,
                  autoplay: isAutoPlay,
                  delay: delay
                }).data('unslider');
              }

            });
          });
        }
      };
    }
  ]);
