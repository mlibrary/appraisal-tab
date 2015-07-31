'use strict';

(function() {
  // The default hash function may confuse two arrays of objects
  // of the same length as the same set of records.
  var hash_fn = function(records) {
    return JSON.stringify(records);
  };

  angular.module('aggregationFilters', []).

  filter('format_data', ['Transfer', function(Transfer) {
    var format_data_fn = function(records) {
      var format_data = {};
      for (var i in records) {
        var record = records[i];
        if (!record.format) {
          continue;
        }

        if (!format_data[record.format]) {
          format_data[record.format] = {count: 0, size: 0};
        }
        var format_info = Transfer.formats.filter(function (f) { return f.title === record.format; });

        format_data[record.format].count++;
        format_data[record.format].puid = record.puid || '';
        format_data[record.format].group = format_info[0].group || 'Unknown';
        format_data[record.format].size += Number.parseFloat(record.size) || 0;
      }

      var out_data = [];
      for (var key in format_data) {
        out_data.push({format: key, data: format_data[key]});
      }

      return _.sortBy(out_data, function(format) {
        return format.format;
      });
    };

    return _.memoize(format_data_fn, hash_fn);
  }]).

  filter('format_graph', function() {
    var format_graph_fn = function(records) {
      var data = {
        series: ['Format'],
        data: [],
      };
      angular.forEach(records, function(format_data, _) {
        var readable_name = format_data.format;
        if (format_data.data.puid) {
         readable_name += ' (' + format_data.data.puid + ')';
        }
        data.data.push({
          puid: format_data.data.puid,
          x: readable_name,
          y: [format_data.data.count],
          tooltip: readable_name,
        });
      });
      return data;
    };

    return _.memoize(format_graph_fn, hash_fn);
  }).

  filter('size_graph', function($filter) {
    var size_graph_fn = function(records) {
      var data = {
        series: ['Format'],
        data: [],
      };
      angular.forEach(records, function(format_data, _) {
        var readable_name = format_data.format;
        if (format_data.data.puid) {
         readable_name += ' (' + format_data.data.puid + ')';
        }
        data.data.push({
          puid: format_data.data.puid,
          x: readable_name,
          y: [format_data.data.size],
          tooltip: readable_name + ', ' + $filter('number')(format_data.data.size) + ' MB',
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
        return el.type === 'file' && el.bulk_extractor_reports;
      });
    };

    return _.memoize(file_fn, hash_fn);
  }).

  filter('tag_count', function() {
    var tag_fn = function(records) {
      var out = {};
      for (var i in records) {
        var record = records[i];
        for (var tag_index in record.tags) {
          var tag = record.tags[tag_index];
          out[tag] ? out[tag]++ : out[tag] = 1;
        }
      }

      // Return as array so it is sortable
      return _.map(out, function(count, tag) { return [tag, count]; });
    };

    return _.memoize(tag_fn, hash_fn);
  });
})();
