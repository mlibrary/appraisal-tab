'use strict';

(function() {
  angular.module('transferService', ['alertService', 'facetService', 'restangular']).

  factory('Transfer', ['Alert', 'Facet', 'Restangular', function(Alert, Facet, Restangular) {
    var create_flat_map = function(records, map) {
      if (map === undefined) {
        map = {};
      }

      angular.forEach(records, function(record) {
        map[record.id] = record;
        create_flat_map(record.children, map);
      });

      return map;
    };

    var Transfer = Restangular.all('ingest').all('appraisal_list');
    return {
      data: [],
      formats: [],
      id_map: {},
      all: function() {
        // TODO don't hardcode this
        return Transfer.customGET('', {query: '', field: '', type: 'term'});
      },
      resolve: function() {
        var self = this;

        var on_failure = function(error) {
          Alert.alerts.push({
            type: 'danger',
            message: 'Unable to retrieve transfer data from Archivematica.',
          });
        };

        self.all().then(function(data) {
          self.data = data.transfers;
          self.formats = data.formats;
          self.id_map = create_flat_map(data.transfers);
          self.filter();
        }, on_failure);
      },
      filter: function() {
        angular.forEach(this.id_map, function(file) {
          if (file.type === 'file') {
            file.display = Facet.passes_filters(file);
          } else {
            file.display = true;
          }
        });
      },
    };
  }]);
})();
