'use strict';

(function() {
  var facetController = angular.module('facetController', []);

  facetController.controller('FacetController', function($scope, Transfer, Facet) {
    Transfer.all().then(function(transfer_data) {
      $scope.formats = transfer_data.formats;
    });

    $scope.$watch('extension', function(selected) {
      Facet.remove('extension');
      if (!selected) {
        return;
      }

      Facet.add('extension', function(value) {
        return selected === value.split('.').slice(1).join('.').toLowerCase();
      });
    });

    $scope.$watch('date_start', function(start_date) {
      Facet.remove('date');

      var end_date = $scope.date_end;
      if (!start_date && !end_date) {
        return;
      }
      start_date = Date.parse(start_date || '0');
      end_date = Date.parse(end_date || '999999999');

      Facet.add('date', function(date) {
        // TODO: handle unparseable dates
        var date_as_int = Date.parse(date);
        return date_as_int > start_date && date_as_int < end_date;
      });
    });

    var facets = ['puid'];
    for (var i in facets) {
      var facet = facets[i];
      $scope.$watch(facet, function(selected) {
        Facet.remove(facet);
        if (!selected) {
          return;
        }

        Facet.add(facet, selected);
      });
    }
  });
})();
