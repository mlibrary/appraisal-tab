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

      var format_date = function(start, end) {
        var s;
        if (!start) {
          s = ' -';
        } else {
          s = start + ' -';
        }
        if (end) {
          s += ' ' + end;
        }

        return s;
      };

      $scope.set_date_filter = function(start_date, end_date) {
        if (!start_date && !end_date) {
          return;
        }
        start_date = Date.parse(start_date || '0');
        end_date = Date.parse(end_date || '999999999');

        var facet_fn = function(data) {
          // TODO: handle unparseable dates
          var date_as_int = Date.parse(date);
          return date_as_int > start_date && date_as_int < end_date;
        };
        Facet.remove('date');
        Facet.add('date', facet_fn, {name: 'Date', text: format_date($scope.date_start, $scope.date_end)});
        Transfer.filter();
      };

      $scope.$watch('tag_facet', function(selected) {
        if (!selected) {
          return;
        }

        Facet.add('tags', selected, {name: 'Tag', text: selected});
        Transfer.filter();
      });
    }]);
})();
