'use strict';

(function() {
  var facetService = angular.module('facetService', []);

  facetService.factory('Facet', function() {
    var add = function(name, value) {
      if (undefined === this.facets[name]) {
        this.facets[name] = [];
      }
      // Don't add the same filter more than once
      if (this.facets[name].indexOf(value) !== -1) {
        return;
      }
      var facet_id = generate_id();
      this.facets[name].push({id: facet_id, value: value});
      this.facet_list.push({id: facet_id, facet: name, value: value});

      return facet_id;
    };

    var get = function(name, value) {
      // If the facet doesn't exist, just return nothing
      if (undefined === this.facets[name]) {
        return;
      }
      // If no value is requested, return all facets for this field
      if (undefined === value) {
        return this.facets[name].map(function(element) {
          return element.value;
        });
      }
      // Return undefined if the requested facet isn't present
      var facets = this.facets[name].filter(function(element) {
        return element.value === value;
      });
      if (facets.length === 0) {
        return;
      } else {
        return facets[0].value;
      }
    };

    var get_by_id = function(name, id) {
      var facets = this.facets[name].filter(function(element) {
        return element.id === id;
      });
      return facets[0].value;
    };

    var remove = function(name, value) {
      // If no value is provided, delete all values
      if (undefined === value) {
        delete this.facets[name];
        this.facet_list = this.facet_list.filter(function(element) {
          return element.facet !== name;
        });
      } else if (undefined !== this.facets[name]) {
        // TODO: filtering over two arrays is unnecessarily expensive;
        //       see about ways to optimize this later
        this.facets[name] = this.facets[name].filter(function(element) {
          return element.value !== value;
        });
        this.facet_list = this.facet_list.filter(function(element) {
          return element.facet !== name || element.value !== value;
        });
      }
    };

    var remove_by_id = function(name, id) {
      var filter_fn = function(element) {
        return element.id !== id;
      };
      this.facets[name] = this.facets[name].filter(filter_fn);
      this.facet_list = this.facet_list.filter(filter_fn);
    };

    var clear = function() {
      this.facets = {};
      this.facet_list = [];
    };

    var filter = function(values) {
      var self = this; // needs to be defined outside the filter function
      return values.filter(function(element, index, array) {
        var result;
        for (var key in element) {
          var value = element[key];
          result = filter_value.apply(self, [key, value]);
          if (result === false) {
            return false;
          }
        }

        return true;
      });
    };

    // private

    var filter_value = function(key, value) {
      if (undefined === this.facets[key]) {
        // no facet for this key
        return true;
      }
      for (var i in this.facets[key]) {
        var result;
        var filter = this.facets[key][i].value;
        // filter is a function
        if (filter.call) {
          result = filter(value);
          // return immediately if any filter returns false,
          // otherwise keep going
        } else if (typeof filter === 'string') {
          result = value === filter;
        } else {
          result = !!value.match(filter);
        }
        if (result === false) {
          return false;
        }
      }

      return true;
    };

    var generate_id = function() {
      var s = '';
      for (var i = 0; i < 16; i++) {
        s += String.fromCharCode(Math.random() * 255);
      }

      return s;
    };

    return {
      facets: {},
      facet_list: [],
      add: add,
      get: get,
      get_by_id: get_by_id,
      remove: remove,
      remove_by_id: remove_by_id,
      clear: clear,
      filter: filter,
    };
  });
})();
