(function() {
  angular.module('tag', []).

  controller('TagController', ['$scope', function($scope) {
    $scope.tags = [];

    $scope.tag_watcher = function(val) {
      if (val.slice(-1) !== ' ') {
        return;
      }

      var tag = val.slice(0, -1);
      if ($scope.tags.indexOf(tag) === -1) {
        $scope.tags.push(tag);
      }
      $scope.tag_input = '';
    };
  }]);
})();
