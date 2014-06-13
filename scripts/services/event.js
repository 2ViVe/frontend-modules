'use strict';

angular.module('2ViVe')
  .factory('Event', ['$http', 'Dashlize', 'CamelCaseLize', 'User',
    function($http, dashlize, camelCaselize, User) {
      var Event = function(id) {
        this.data = {
          id: id
        };
      };

      Event.prototype.extend = function(data) {
        this.data = angular.extend(this.data, data);
      };

      Event.prototype.response = function(inviteeId, response, message) {
        return $http.post('/api/v2/events/' + this.data.id + '/invitees/' + inviteeId + '/response', {
          'response': response,
          'message': message
        }, {
          transformResponse: camelCaselize,
          transformRequest: function(data) {
            return angular.toJson(dashlize(data));
          }
        });
      };

      Event.prototype.totalInviteesNumber = function() {
        return this.data.yesCount + this.data.noCount + this.data.maybeCount + this.data.noReplyCount;
      };

      Event.prototype.fetch = function() {
        var event = this;
        return $http.get('/api/v2/events/' + event.data.id, {
          transformResponse: camelCaselize
        }).then(function(response) {
          event.data = response.data.response;
          return event;
        });
      };

      Event.prototype.create = function(eventData) {
        var event = this;
        eventData.userId = User.data.userId;
        return $http.post('/api/v2/events', eventData, {
          transformResponse: camelCaselize,
          transformRequest: function(data) {
            return angular.toJson(dashlize(data));
          }
        }).then(function(response) {
          event.data = response.data.response;
          return event;
        });
      };

      Event.prototype.fetchInvitees = function() {
        var event = this;
        return $http.get('/api/v2/events/' + event.data.id + '/invitees', {
          transformResponse: camelCaselize
        }).then(function(response) {
          event.invitees = response.data.response;
          return event;
        });
      };

      Event.prototype.addInvitees = function(invitees, subject, message) {
        return $http.post('/api/v2/events/' + this.data.id + '/invitees', {
          invitees: invitees,
          subject: subject,
          message: message
        }, {
          transformResponse: camelCaselize,
          transformRequest: function(data) {
            return angular.toJson(dashlize(data));
          }
        }).then(function(response) {
          return response.data.response;
        });
      };

      return Event;
    }])
  .factory('Events', ['$http', 'Dashlize', 'CamelCaseLize',
    function($http, dashlize, camelCaselize) {
      return {

        fetchTemplates: function() {
          return $http.get('/api/v2/events/templates', {
            transformResponse: camelCaselize
          }).then(function(response) {
            return response.data.response;
          });
        },

        fetchTypes: function() {
          return $http.get('/api/v2/events/types', {
            transformResponse: camelCaselize
          }).then(function(response) {
            return response.data.response;
          });
        },

        fetchAll: function() {
          return $http.get('/api/v2/events', {
            transformResponse: camelCaselize
          }).then(function(response){
              return response.data.response;
            });
        }
      };
    }]);
