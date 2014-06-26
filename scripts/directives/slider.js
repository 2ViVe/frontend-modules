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
          var initUnSlider = function() {
            return angular.element(element).unslider({
              dots: hasDots,
              autoplay: isAutoPlay,
              delay: delay
            }).data('unslider');
          };

          scope.nextSlide = function() {
            slider.next();
          };

          scope.previousSlide = function() {
            slider.prev();
          };

          $timeout(function() {
            var images = element.find('img'), cachedImageLength = 0;
            images.hide();
            angular.forEach(images, function(image) {
              if (image.complete) {
                cachedImageLength++;
              }
            });
            if (cachedImageLength === images.length) {
              images.show();
              slider = initUnSlider();
              return;
            }
            images.on('load', function() {

              images.show();

              if (slider === undefined) {
                slider = initUnSlider();
              }

            });
          }, 0);
        }
      };
    }
  ])
  .directive('viveSlider', ['$timeout', function($timeout) {
    return {
      restrict: 'E',
      scope: {
        nextSlide: '=',
        previousSlide: '=',
        goToSlide: '=',
        refresh: '=',
        slideWidth: '@',
        minSlides: '@',
        maxSlides: '@',
        pager: '@',
        controls: '@',
        infiniteLoop: '@'
      },
      link: function(scope, element) {
        function initSlider() {
          $timeout(function() {
            if (slider) {
              slider.reloadSlider();
            }
            else {
              slider = angular.element(element).find('ul').bxSlider(options);
            }
          });
        }

        var slider;
        var optionKeys = ['slideWidth', 'minSlides', 'maxSlides', 'pager', 'controls', 'infiniteLoop'];
        var options = {};
        angular.forEach(optionKeys, function(key) {
          var optionValue = scope[key];
          if (optionValue === 'true') {
            options[key] = true;
          } else if (optionValue === 'false') {
            options[key] = false;
          } else {
            options[key] = optionValue;
          }
        });
        scope.nextSlide = function() {
          slider.goToNextSlide();
        };
        scope.previousSlide = function() {
          slider.goToPrevSlide();
        };
        scope.goToSlide = function(slideNumber) {
          slider.goToSlide(slideNumber - 1);
        };
        scope.refresh = function() {
          initSlider();
        };

        initSlider();

      }
    };
  }]);
