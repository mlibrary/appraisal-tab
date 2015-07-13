(function() {
  angular.module('tag', []).

  controller('TagController', ['$scope', 'SelectedFiles', 'Tag', function($scope, SelectedFiles, Tag) {
    $scope.tags = [];
    $scope.files = SelectedFiles;

    $scope.submit = function() {
      var tag = $scope.tag;
      if (!tag) {
        return;
      }

      if ($scope.tags.indexOf(tag) === -1) {
        Tag.add_list(SelectedFiles.list_ids(), tag);
        $scope.tags.push(tag);
      }
      $scope.tag = '';
    };
  }]);
})();
