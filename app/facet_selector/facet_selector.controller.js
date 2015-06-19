'use strict';

(function() {
  var facetController = angular.module('facetController', []);

  facetController.controller('FacetController', function($scope, Transfer, Facet) {
    $scope.remove_facet = function(name, id) {
      Facet.remove_by_id(name, id);
    };
    $scope.Facet = Facet;

    Transfer.all().then(function(transfer_data) {
      $scope.formats = transfer_data.formats;
    });

    $scope.$watch('extension', function(selected) {
      Facet.remove('text');
      if (!selected) {
        return;
      }

      var facet_fn = function(value) {
        return selected === value.substr(value.lastIndexOf('.')).toLowerCase();
      };
      Facet.add('text', facet_fn, {name: 'Extension', text: selected});
    });

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

    $scope.$watch('date_start', function(start_date) {
      Facet.remove('date');

      var end_date = $scope.date_end;
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
      Facet.add('date', facet_fn, {name: 'Date', text: format_date($scope.date_start, $scope.date_end)});
    });

    $scope.$watch('puid', function(selected) {
      Facet.remove('puid');
      if (!selected) {
        return;
      }

      Facet.add('puid', selected, {name: 'Format', text: selected});
    });
  });
})();
