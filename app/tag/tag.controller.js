(function() {
  angular.module('tag', []).

  controller('TagController', ['$scope', 'SelectedFiles', 'Tag', function($scope, SelectedFiles, Tag) {
    $scope.tags = [];
    $scope.files = SelectedFiles;

    $scope.tag_watcher = function(val) {
      if (val.slice(-1) !== ' ') {
        return;
      }

      var tag = val.slice(0, -1);
      if ($scope.tags.indexOf(tag) === -1) {
        Tag.add_list(SelectedFiles.list_ids(), tag);
      }
      $scope.tag_input = '';
    };
  }]);
})();
