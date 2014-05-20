'use strict';

angular.module('2ViVe')
  .factory('Tools', ['$http', 'CamelCaseLize', function($http, camelcase) {

    var url = '/api/v2/documents/links/tools',
      viewUrlPrefix = '/documents/tools/',
      downloadUrlPrefix = '/downloads/documents/tools/';

    function Tools() {}

    Tools.fetch = function() {
      return $http.get(url, {
        transformResponse:  camelcase
      }).then(function(resp) {
        var filesArr = {},
          result = resp.data.response;
        angular.forEach(result, function (files, folderName) {
          filesArr[folderName] = [];
          angular.forEach(files,function (filename) {
            var item = {};
            item.type = /[^.]+$/.exec(filename)[0] || '';
            item.canView = false;
            if (item.type.toLocaleLowerCase() === 'pdf') {
              item.canView = true;
            }
            item.downloadUrl = downloadUrlPrefix + folderName + '/' + filename;
            item.viewUrl = viewUrlPrefix + folderName + '/' + filename;
            item.filename = filename;
            filesArr[folderName].push(item);
          });
        });
        return filesArr;
      });
    };

    return Tools;
  }]);