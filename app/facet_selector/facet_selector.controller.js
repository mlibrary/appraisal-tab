'use strict';

(function() {
  angular.module('facetController', ['tagService']).

  controller('FacetController', ['$scope', 'Transfer', 'Facet', 'Tag', function($scope, Transfer, Facet, Tag) {
      $scope.remove_facet = function(name, id) {
        Facet.remove_by_id(name, id);
        Transfer.filter();
      };
      $scope.Facet = Facet;
      $scope.transfers = Transfer;
      $scope.tags = Tag;

      $scope.$watch('tag_facet', function(selected) {
        if (!selected) {
          return;
        }

        Facet.add('tags', selected, {name: 'Tag', text: selected});
        Transfer.filter();
        $scope.tag_facet = '';
      });
    }]);
})();
