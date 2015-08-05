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

      $scope.date_regex = '\\d\\d\\d\\d([-\/]\\d\\d?)?([-\/]\\d\\d?)?';

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

      var date_is_valid = function(date) {
        if (date === undefined) {
          return false;
        } else {
          return date.length < 4 ? false : true;
        }
      }

      $scope.set_date_filter = function(start_date, end_date) {
        var default_start_date = -62167219200000; // BC 1
        var default_end_date = 3093496473600000; // AD 99999
        start_date = date_is_valid(start_date) ? Date.parse(start_date) : default_start_date;
        end_date = date_is_valid(end_date) ? Date.parse(end_date) : default_end_date;

        var facet_fn = function(date) {
          // TODO: handle unparseable dates
          var date_as_int = Date.parse(date);
          return date_as_int >= start_date && date_as_int <= end_date;
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
