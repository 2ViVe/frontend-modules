'use strict';

angular.module('2ViVe')
  .filter('price', ['CURRENCY_SYMBOL', function(CURRENCY_SYMBOL) {
    return function(price) {
      if (isNaN(price)) {
        return '--';
      }
      return CURRENCY_SYMBOL + parseFloat(Math.round(price * 100) / 100).toFixed(2);
    };
  }]);
