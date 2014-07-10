'use strict';

angular.module('2ViVe')
  .directive('calendar', ['$compile', function($compile) {
    return {
      restrict: 'A',
      templateUrl: 'views/party/calendar.html',
      replace: true,
      scope: {
        selectedDate: '=',
        remarks: '='
      },
      link: function(scope, element) {
        var picker = new Pikaday({
          field: angular.element(element).find('.calendar-field')[0],
          container: angular.element(element)[0],
          bound: false,
          isSelectable: false,
          onDraw: function() {
            var remarks = scope.remarks;
            var year = picker.calendars[0].year;
            var month = picker.calendars[0].month;
            if (remarks && remarks[year] && remarks[year][month]) {
              var dayRemarks = remarks[year][month];
              angular.forEach(dayRemarks, function(remark, day) {
                $compile(angular.element(picker.el).find('td[data-day="' + day + '"] button')
                  .addClass(remark.class)
                  .attr('tooltip-append-to-body', remark.appendToBody)
                  .attr('tooltip-trigger', remark.trigger)
                  .attr(remark.type, remark.content))(scope);
              });
            }
          }
        });
      }
    };
  }]);
