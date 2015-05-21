'use strict';

(function() {
  angular.module('aggregationFilters', []).filter('puid_data', function() {
    return _.memoize(function(records) {
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
          puid_data[record.puid].size += Number.parseFloat(record.size);
        }

        var out_data = [];
        for (var key in puid_data) {
          out_data.push({puid: key, data: puid_data[key]});
        }

        return out_data;
      });
  });
})();
