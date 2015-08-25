'use strict';

(function() {
  angular.module('facetController', ['tagService']).

  controller('FacetController', ['$scope', 'Transfer', 'Facet', function($scope, Transfer, Facet) {
      $scope.remove_facet = function(name, id) {
        Facet.remove_by_id(name, id);
        Transfer.filter();
      };
      $scope.Facet = Facet;
      $scope.transfers = Transfer;

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
