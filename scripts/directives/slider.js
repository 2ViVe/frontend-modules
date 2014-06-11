'use strict';

angular.module('2ViVe')
  .directive('slider',
  function() {
    return {
      restrict: 'C',
      link: function(scope, element, attrs) {
        var isAutoPlay = attrs.isAutoPlay === 'true' || attrs.isAutoPlay === undefined;
        var delay = attrs.delay === undefined ? 7000 : attrs.delay;
        var isDots = attrs.isDots === 'true' || attrs.isDots === undefined;
        angular.element(element).unslider({
          dots: isDots,
          autoplay: isAutoPlay,
          delay: delay
        });
      }
    };
  });