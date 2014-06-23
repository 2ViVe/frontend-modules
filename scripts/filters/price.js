'use strict';

angular.module('2ViVe')
  .filter('price', ['CURRENCY_SYMBOL', function(CURRENCY_SYMBOL) {
    return function(price, options) {
      if (isNaN(price)) {
        return '--';
      }
      var currencySymbol = CURRENCY_SYMBOL;
      if (options === 'with out currency') {
        currencySymbol = '';
      }
      return currencySymbol + parseFloat(Math.round(price * 100) / 100).toFixed(2);
    };
  }]);
