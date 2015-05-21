'use strict';

(function() {
  var facetFilter = angular.module('facetFilter', []);

  facetFilter.filter('facet', function(Facet) {
    return _.memoize(function(records) {
      return Facet.filter(records);
    });
  });
})();
