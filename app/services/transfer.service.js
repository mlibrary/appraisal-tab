'use strict';

(function() {
  angular.module('transferService', ['restangular']).

  factory('Transfer', ['Restangular', function(Restangular) {
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

    var Transfer = Restangular.all('transfers.json');
    return {
      data: [],
      formats: [],
      id_map: {},
      all: function() {
        return Transfer.customGET();
      },
      resolve: function() {
        var self = this;
        self.all().then(function(data) {
          self.data = data.transfers;
          self.formats = data.formats;
          self.id_map = create_flat_map(data.transfers);
        });
      },
    };
  }]);
})();
