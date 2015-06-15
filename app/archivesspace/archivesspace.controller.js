'use strict';

(function() {
  angular.module('archivesSpaceController', []).controller('ArchivesSpaceController', ['$scope', 'ArchivesSpace', function($scope, ArchivesSpace) {
      var format_item = function(item) {
        if (item.children && item.children.length > 0) {
          item.children = item.children.map(function(child) {
            return format_item(child);
          });
        }

        item.label = item.title;
        if (item.identifier) {
          item.label += '(' + item.identifier + ')';
        }

        return item;
      };

      $scope.options = {
        closedIcon: $('<span class="fa fa-folder-o"></span>'),
        openedIcon: $('<span class="fa fa-folder-open-o"></span>'),
      };

      ArchivesSpace.all().then(function(data) {
        $scope.data = data.map(function(child) {
          return format_item(child);
        });
      });
    }]);
})();
