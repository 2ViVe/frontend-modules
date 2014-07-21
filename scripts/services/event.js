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

      Event.prototype.isStarted = function() {
        return moment(this.data.startTime).isBefore();
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

      Event.prototype.ordersItemTotal = function() {
        var total = 0;
        angular.forEach(this.orders, function(order) {
          if (order.state === 'complete' && order.paymentState === 'paid') {
            total += order.itemTotal;
          }
        });
        return total;
      };

      Event.prototype.totalOrdersNumber = function() {
        return this.orders ? this.orders.length : 0;
      };

      Event.prototype.totalInviteesNumber = function() {
        return this.data.yesCount + this.data.noCount + this.data.maybeCount + this.data.noReplyCount;
      };

      Event.prototype.remove = function(notification) {
        return $http
          .delete('/api/v2/events/' + this.data.id, notification, {
            transformRequest: function(data) {
              if (!data) {
                return;
              }
              return angular.toJson(dashlize(data));
            }
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

      Event.prototype.fetchOrders = function() {
        var event = this;
        return $http.get('/api/v2/events/' + event.data.id + '/orders', {
          transformResponse: camelCaselize
        }).then(function(response) {
          event.orders = response.data.response;
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
  .factory('newEvents', ['$http', 'Dashlize', 'CamelCaseLize',
    function($http, dashlize, camelCaselize) {
      var Events = function() {
      };

      Events.prototype = {

        getTemplateIndexById: function(id) {
          var result = null;
          angular.forEach(this.templates, function(template, index) {
            if (template.id === id) {
              result = index;
              return null;
            }
          });
          return result;
        },

        getTemplatesByTypeId: function(typeId) {
          return this.templates && this.templates.filter(function(template) {
            return template.typeId === typeId;
          });
        },

        fetchTemplates: function() {
          var events = this;
          return $http.get('/api/v2/events/templates', {
            transformResponse: camelCaselize
          }).then(function(response) {
            events.templates = response.data.response;
            return events;
          });
        },

        fetchTypes: function() {
          var events = this;
          return $http.get('/api/v2/events/types', {
            transformResponse: camelCaselize,
            cache: true
          }).then(function(response) {
            events.types = response.data.response;
            return events;
          });
        },

        getTypesWithActiveEvent: function() {
          var types = [];
          var events = this;
          angular.forEach(events.getByOptions({
            isActive: true
          }), function(activeEvent) {
            if (types.filter(function(type) {
              return type.id === activeEvent.typeId;
            }).length === 0) {
              types.push(activeEvent.type);
            }
          });
          return types;
        },

        fetchAll: function(options) {
          var events = this;
          var _options = angular.extend({}, options);

          return $http.get('/api/v2/events', {
            transformResponse: camelCaselize,
            params: {
              'user-id': _options.userId,
              'type-id': _options.typeId
            }
          }).then(function(response) {
            events.data = response.data.response;
            if (events.types && events.types.length > 0) {
              angular.forEach(events.data, function(event) {
                event.type = events.types.filter(function(type) {
                  return type.id === event.typeId;
                })[0];
              });
            }
            return events;
          });
        },

        getByOptions: function(options) {
          var events = this.data;
          var _options = angular.extend({}, options);

          if (_options.isActive) {
            events = events.filter(function(event) {
              var closeDate = moment(event.orderCloseTime);
              return closeDate.isAfter(moment());
            });
          }

          if (_options.typeId) {
            events = events.filter(function(event) {
              return event.typeId === _options.typeId;
            });
          }

          return events;
        }
      };

      return Events;
    }])
  .factory('Events', ['$http', 'Dashlize', 'CamelCaseLize',
    function($http, dashlize, camelCaselize) {
      function filterActive(events) {
        return events && events.filter(function(event) {
          var closeDate = moment(event.orderCloseTime);
          return closeDate.isAfter(moment());
        });
      }

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
            transformResponse: camelCaselize,
            cache: true
          }).then(function(response) {
            return response.data.response;
          });
        },

        fetchAll: function(options) {
          var _options = angular.extend({}, options);

          return $http.get('/api/v2/events', {
            transformResponse: camelCaselize,
            params: {
              'user-id': _options.userId,
              'type-id': _options.typeId
            }
          }).then(function(response) {
            var events = response.data.response;
            return _options.shouldActive ? filterActive(events) : events;
          });
        }
      };
    }]);
