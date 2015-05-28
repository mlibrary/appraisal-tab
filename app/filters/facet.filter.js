'use strict';

(function() {
  var facetFilter = angular.module('facetFilter', []);

  facetFilter.filter('facet', function() {
    var facet_filter_fn = function(Facet) {
      return Facet.filter(records);
    };

    // The default hash function may confuse two arrays of objects
    // of the same length as the same set of records.
    var hash_fn = function(records) {
      return JSON.stringify(records);
    };

    return _.memoize(facet_filter_fn, hash_fn);
  });
})();
