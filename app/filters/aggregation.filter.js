'use strict';

(function() {
  // The default hash function may confuse two arrays of objects
  // of the same length as the same set of records.
  var hash_fn = function(records) {
    return JSON.stringify(records);
  };

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
        puid_data[record.puid].size += Number.parseFloat(record.size) || 0;
      }

      var out_data = [];
      for (var key in puid_data) {
        out_data.push({puid: key, data: puid_data[key]});
      }

      return _.sortBy(out_data, function(format) {
        return format.data.format;
      });
    };

    return _.memoize(puid_data_fn, hash_fn);
  })
  .filter('puid_graph', function() {
    var puid_graph_fn = function(records) {
      var data = {
        series: ['Format'],
        data: [],
      };
      angular.forEach(records, function(format_data, _) {
        data.data.push({
          x: format_data.puid,
          y: [format_data.data.count],
          tooltip: format_data.data.format + ' (' + format_data.puid + ')',
        });
      });
      return data;
    };

    return _.memoize(puid_graph_fn, hash_fn);
  }).
  filter('size_graph', function() {
    var size_graph_fn = function(records) {
      var data = {
        series: ['Format'],
        data: [],
      };
      angular.forEach(records, function(format_data, _) {
        data.data.push({
          x: format_data.puid,
          y: [format_data.data.size],
          tooltip: format_data.data.format + ' (' + format_data.puid + '), ' + format_data.data.size + "MB",
        });
      });
      return data;
    };

    return _.memoize(size_graph_fn, hash_fn);
  }).
  filter('find_transfers', function() {
    var transfer_fn = function(records) {
      return records.filter(function(el) {
        return el.type === 'transfer';
      });
    };

    return _.memoize(transfer_fn, hash_fn);
  }).
  filter('find_files', function() {
    var file_fn = function(records) {
      return records.filter(function(el) {
        return el.type === 'file';
      });
    };

    return _.memoize(file_fn, hash_fn);
  });
})();
