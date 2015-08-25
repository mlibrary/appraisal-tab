'use strict';

(function() {
  angular.module('transferService', ['alertService', 'facetService', 'tagService', 'restangular']).

  factory('Transfer', ['Alert', 'Facet', 'Restangular', 'Tag', function(Alert, Facet, Restangular, Tag) {
    var get_record = function(id) {
      var record = this.id_map[id];
      if (!record) {
        throw 'Unable to find a record of name ' + String(id) + ' in Transfer\'s ID map';
      } else {
        return record;
      }
    };

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

    var clean_record_titles = function(records) {
      angular.forEach(records, function(record) {
        record.title = Base64.decode(record.title);
        record.relative_path = Base64.decode(record.relative_path);
      });
    };

    var remove_tag_if_necessary = function(self, tag) {
      if (self.list_tags(tag).length === 0) {
        self.tags = self.tags.filter(function(element) {
          return element !== tag;
        });
      }
    };

    var remove_all = function(id) {
      var record = this.id_map[id];
      if (record) {
        record.tags = [];
      }
    };

    var Transfer = Restangular.all('ingest').all('appraisal_list');

    return {
      data: [],
      formats: [],
      id_map: {},
      tags: [],
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
          clean_record_titles(self.id_map);
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

      add_tag: function(id, tag, skip_submit) {
        var record = get_record.apply(this, [id]);
        record.tags = record.tags || [];

        if (record.tags.indexOf(tag) !== -1) {
          return;
        }
        record.tags.push(tag);

        // Add this tag to the flat list of current tags if not already present
        if (this.tags.indexOf(tag) === -1) {
          this.tags.push(tag);
        }

        if (!skip_submit) {
          Tag.submit(id, record.tags);
        }
      },
      add_list_of_tags: function(ids, tag, skip_submit) {
        var self = this;
        angular.forEach(ids, function(id) {
          self.add_tag(id, tag, skip_submit);
        });
      },
      remove_tag: function(id, tag, skip_submit) {
        var self = this;
        var record = get_record.apply(this, [id]);

        if (!tag) {
          var record = get_record.apply(this, [id]);
          var tags_for_id = record.tags;

          remove_all.apply(self, [id]);
          angular.forEach(tags_for_id, function(tag) {
            remove_tag_if_necessary(self, tag);
          });

          if (!skip_submit) {
            Tag.remove(id);
          }

          return;
        }

        if (record.tags === undefined) {
          $log.warn('Tried to remove tag for file with ID ' + String(id) + ' but no tags are specified for that file');
          return;
        }
        record.tags.pop(tag);

        // If this is the last occurrence of this tag, delete it from the tag list
        remove_tag_if_necessary(self, tag);

        if (!skip_submit) {
          Tag.submit(id, record.tags);
        }
      },
      get_tag: function(id) {
        var record = get_record.apply(this, [id]);
        return record.tags || [];
      },
      list_tags: function(tag) {
        var results = [];
        angular.forEach(this.id_map, function(record, id) {
          var tags = record.tags || [];
          if (tags.indexOf(tag) !== -1) {
            results.push(id);
          }
        });

        return results;
      },
      clear_tags: function() {
        this.tags = [];
      },
    };
  }]);
})();
