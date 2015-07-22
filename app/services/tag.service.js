'use strict';

(function() {
  angular.module('tagService', ['transferService']).

  factory('Tag', ['$log', 'Transfer', function($log, Transfer) {
    var tags = {};

    // public

    var add = function(id, tag) {
      tags[id] = tags[id] || [];

      if (tags[id].indexOf(tag) !== -1) {
        return;
      }

      tags[id].push(tag);

      // Add this tag to the flat list of current tags if not already present
      if (this.tags.indexOf(tag) === -1) {
        this.tags.push(tag);
      }

      var record = Transfer.id_map[id];
      if (!record) {
        $log.warn('Tried to add tag for file with ID ' + String(id) + ' which was not found in Transfer map');
        return;
      }
      record.tags = record.tags || [];
      record.tags.push(tag);
    };

    var add_list = function(ids, tag) {
      var self = this;
      angular.forEach(ids, function(id) {
        self.add(id, tag);
      });
    };

    var remove = function(id, tag) {
      var self = this;
      if (tag === undefined) {
        var tags_for_id = tags[id];

        remove_all(id);
        angular.forEach(tags_for_id, function(tag) {
          remove_tag_if_necessary(self, tag);
        });

        return;
      }

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

      // If this is the last occurrence of this tag, delete it from the tag list
      remove_tag_if_necessary(self, tag);
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

    var clear = function() {
      tags = {};
      this.tags = [];
    };

    // private

    var remove_tag_if_necessary = function(self, tag) {
      if (self.list(tag).length === 0) {
        self.tags = self.tags.filter(function(element) {
          return element !== tag;
        });
      }
    };

    var remove_all = function(id) {
      tags[id] = [];
      var record = Transfer.id_map[id];
      if (record) {
        record.tags = [];
      }
    };

    return {
      add: add,
      add_list: add_list,
      get: get,
      remove: remove,
      clear: clear,
      list: list,
      tags: [],
    };
  }]);
})();
