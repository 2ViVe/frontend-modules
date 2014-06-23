'use strict';

angular.module('2ViVe')
  .filter('price', ['CURRENCY_SYMBOL', function(CURRENCY_SYMBOL) {
    return function(price, options) {
      if (isNaN(price)) {
        return '--';
      }
      if (options === 'with out currency') {
        CURRENCY_SYMBOL = '';
      }
      return CURRENCY_SYMBOL + parseFloat(Math.round(price * 100) / 100).toFixed(2);
    };
  }]);
