'use strict';

(function () {
  var facetService = angular.module("facetService", []);

  facetService.factory("Facet", function() {
    var add = function(name, value) {
      if (undefined === this.facets[name]) {
        this.facets[name] = [];
      }
      // Don't add the same filter more than once
      if (-1 !== this.facets[name].indexOf(value)) {
        return;
      }
      this.facets[name].push(value);
      return this; // return self so that calls can be chained
    };

    var get = function(name, value) {
      // If no value is requested, return all facets for this field
      if (undefined === value) {
        return this.facets[name];
      }
      // Return undefined if the requested facet isn't present
      if (-1 === this.facets[name].indexOf(value)) {
        return;
      } else {
        return value;
      }
    };

    var remove = function(name, value) {
      // If no value is provided, delete all values
      if (undefined === value) {
        delete this.facets[name];
      } else if (undefined !== this.facets[name]) {
        this.facets[name] = this.facets[name].filter(function(element) { return element !== value; });
      }
    };

    var clear = function() {
      this.facets = {};
    };

    var filter = function(values) {
      var self = this; // needs to be defined outside the filter function
      return values.filter(function(element, index, array) {
        var result;
        for (var key in element) {
          var value = element[key];
          result = filter_value.apply(self, [key, value]);
          if (false === result) { return false; }
        }

        return true;
      });
    };

    // private

    var filter_value = function (key, value) {
      if (undefined === this.facets[key]) {
        // no facet for this key
        return true;
      }
      for (var i in this.facets[key]) {
        var result;
        var filter = this.facets[key][i];
        // filter is a function
        if (filter.call) {
          result = filter(value);
          // return immediately if any filter returns false,
          // otherwise keep going
        } else if (typeof(filter) == 'string') {
          result = value === filter;
        } else {
          result = !!value.match(filter);
        }
        if (false === result) { return false; }
      }

      return true;
    };

    return {
      facets: {},
      add: add,
      get: get,
      remove: remove,
      clear: clear,
      filter: filter,
    }
  });
})();
