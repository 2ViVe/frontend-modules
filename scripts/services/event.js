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

      Event.prototype.edit = function(data, time) {
        processTime(data, time);
        return $http.put('/api/v2/events/' + this.data.id, data, {
          transformResponse: camelCaselize,
          transformRequest: function(data) {
            return angular.toJson(dashlize(data));
          }
        }).then(function(response) {
          event.data = response.data.response;
          return event;
        });
      };

      Event.prototype.response = function(inviteeId, response, comment) {
        return $http.post('/api/v2/events/' + this.data.id + '/invitees/' + inviteeId + '/response', {
          'response': response,
          'comment': comment
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

      Event.prototype.remove = function() {
        return $http
          .delete('/api/v2/events/' + this.data.id)
          .then(function(resp) {
            return response.data.response;
          });
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

      function processTime(event, time) {
        var start = moment(time.startDate + ' ' + time.startTime);
        var end = moment(time.endDate + ' ' + time.endTime);
        if (start.isValid()) {
          event.startTime = start.utc().format();
        }
        if (end.isValid()) {
          event.endTime = end.utc().format();
        }
        return event;
      }

      Event.prototype.getTime = function() {
        var time = {};
        var startTime = moment(this.data.startTime).local();
        if (startTime.isValid()) {
          time.startDate = startTime.format('YYYY-MM-DD');
          time.startTime = startTime.format('HH:mm');
        }
        var endTime = moment(this.data.endTime).local();
        if (endTime.isValid()) {
          time.endDate = endTime.format('YYYY-MM-DD');
          time.endTime = endTime.format('HH:mm');
        }
        return time;
      };

      Event.prototype.create = function(data, time) {
        var event = this;
        processTime(data, time);
        data.userId = User.data.userId;
        return $http.post('/api/v2/events', data, {
          transformResponse: camelCaselize,
          transformRequest: function(data) {
            return angular.toJson(dashlize(data));
          }
        }).then(function(response) {
          event.data = response.data.response;
          return event;
        });
      };

      Event.prototype.getInviteeById = function(inviteeId) {
        var event = this;
        var result = null;
        angular.forEach(event.invitees, function(invitee) {
          if (invitee.id === inviteeId) {
            result = invitee;
            return null;
          }
        });
        return result;
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

      Event.prototype.getTemplateImageUrlFrom = function(templates) {
        var templateImageUrl = null;
        var event = this;
        angular.forEach(templates, function(template) {
          if (template.id === event.data.templateId) {
            templateImageUrl = template.imageUrl;
            return null;
          }
        });
        return templateImageUrl;
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
