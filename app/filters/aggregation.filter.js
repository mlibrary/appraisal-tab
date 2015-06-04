'use strict';

(function() {
  angular.module('aggregationFilters', []).filter('puid_data', function() {
    var puid_data_fn = function(records) {
      var puid_data = {};
      for (var i in records) {
        var record = records[i];
        if (!record.puid) {
          continue;
        }

        if (!puid_data[record.puid]) {
          puid_data[record.puid] = {count: 0, size: 0};
        }

        puid_data[record.puid].count++;
        puid_data[record.puid].format = record.format;
        puid_data[record.puid].size += Number.parseFloat(record.size);
      }

      var out_data = [];
      for (var key in puid_data) {
        out_data.push({puid: key, data: puid_data[key]});
      }

      return out_data;
    };

    // The default hash function may confuse two arrays of objects
    // of the same length as the same set of records.
    var hash_fn = function(records) {
      return JSON.stringify(records);
    };

    return _.memoize(puid_data_fn, hash_fn);
  });
})();
