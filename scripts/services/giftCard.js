'use strict';

angular.module('2ViVe')
  .factory('GiftCards', ['$http', 'CamelCaseLize', function($http, camelcase) {

    function GiftCards() {}

    GiftCards.fetch = function() {
      return $http.get('/api/v2/giftcards', {
        transformResponse: camelcase
      }).then(function(resp) {
        return resp.data.response;
      });
    };

    return GiftCards;
  }])
  .factory('GiftCard', ['$http', 'ipCookie', '$location', 'DEFAULT_COUNTRY_ID', 'User', '$q', 'LocalStorage', 'DEFAULT_ROLE_CODE',
    function($http, ipCookie, $location, DEFAULT_COUNTRY_ID, User, $q, LocalStorage, DEFAULT_ROLE_CODE) {
      var domain = $location.host().split('.');
      domain = '.' + domain[domain.length - 2] + '.' + domain[domain.length - 1];

      var GiftCard = function() {
      };

      GiftCard.prototype.fetch = function() {
        var deferred = $q.defer();
        var giftCard = this;

        User.fetch().finally(function() {
          $http.get('/api/v2/products/18', {
            params: {
              'role-code': User.isLogin ? null : DEFAULT_ROLE_CODE,
              'country-id': User.isLogin ? null : DEFAULT_COUNTRY_ID,
              'catalog-code': 'GC'
            }
          }).success(function(data) {
            giftCard.data = data.response;
            deferred.resolve(giftCard);
          });
        });

        return deferred.promise;
      };

      GiftCard.prototype.purchase = function(selectedGiftCard, info) {
        ipCookie('selectedGiftCard', selectedGiftCard, {
          domain: domain
        });
        ipCookie('giftCardInfo', info, {
          domain: domain
        });
        if (User.isLogin) {
          $location.path('/gift/checkout');
        } else {
          LocalStorage.setPathAfterLogin('/gift/checkout');
          $location.path('/signin');
        }
      };

      GiftCard.prototype.clear = function() {
        ipCookie.remove('selectedGiftCard');
        ipCookie.remove('giftCardInfo');
      };

      GiftCard.prototype.populate = function() {
        this.info = ipCookie('giftCardInfo');
        this.selectedGiftCard = ipCookie('selectedGiftCard');
      };

      GiftCard.prototype.placeOrder = function(creditcard) {
        var giftCard = this;

        if (giftCard.orderId) {
          return $http.post('/api/v2/giftcard-orders/' + giftCard.orderId + '/payments', {
            'creditcard': creditcard
          });
        }

        return $http.post('/api/v2/giftcards', {
          'variant-id': this.selectedGiftCard.id,
          'creditcard': creditcard,
          'email-info': this.info
        }).success(function(data) {
          if (data.response['payment-state'] === 'failed') {
            giftCard.orderId = data.response['order-id'];
          }
        });
      };

      return GiftCard;
    }]);
