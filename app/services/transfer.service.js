'use strict';

(function() {
  var transferService = angular.module('transferService', ['restangular']);

  transferService.factory('Transfer', function(Restangular) {
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
      id_map: {},
      all: function() {
        return Transfer.customGET();
      },
      resolve: function() {
        var self = this;
        self.all().then(function(data) {
          self.data = data.transfers;
          self.id_map = create_flat_map(data.transfers);
        });
      },
    };
  });
})();
