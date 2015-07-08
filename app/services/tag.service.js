'use strict';

(function() {
  angular.module('tagService', ['transferService']).

  factory('Tag', ['$log', 'Transfer', function($log, Transfer) {
    var tags = {};

    var add = function(id, tag) {
      tags[id] = tags[id] || [];

      if (tags[id].indexOf(tag) !== -1) {
        return;
      }

      tags[id].push(tag);
      var record = Transfer.id_map[id];
      if (!record) {
        $log.warn('Tried to add tag for file with ID ' + String(id) + ' which was not found in Transfer map');
        return;
      }
      record.tags = record.tags || [];
      record.tags.push(tag);
    };

    var add_list = function(ids, tag) {
      angular.forEach(ids, function(id) {
        add(id, tag);
      });
    };

    var remove = function(id, tag) {
      if (tags[id] === undefined) {
        $log.warn('Tried to remove tag for file with ID ' + String(id) + ' but no tags are specified for that file');
        return;
      }

      tags[id].pop(tag);
      var record = Transfer.id_map[id];
      if (!record) {
        $log.warn('Tried to remove tag for file with ID ' + String(id) + ' which was not found in Transfer map');
        return;
      }
      if (record.tags) {
        record.tags.pop(tag);
      }
    };

    var clear = function(id) {
      tags[id] = [];
      var record = Transfer.id_map[id];
      if (record) {
        record.tags = [];
      }
    };

    var get = function(id) {
      return tags[id] || [];
    };

    var list = function(tag) {
      var results = [];
      angular.forEach(tags, function(taglist, id) {
        if (taglist.indexOf(tag) !== -1) {
          results.push(id);
        }
      });

      return results;
    };

    return {
      add: add,
      add_list: add_list,
      get: get,
      remove: remove,
      clear: clear,
      list: list,
    };
  }]);
})();
