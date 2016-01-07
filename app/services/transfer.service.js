import angular from 'angular';
import '../services/alert.service';
import '../services/facet.service';
import '../services/tag.service';

angular.module('transferService', ['alertService', 'facetService', 'tagService']).

factory('Transfer', ['Alert', 'Facet', 'Restangular', 'Tag', function(Alert, Facet, Restangular, Tag) {
  var get_record = function(id) {
    var record = this.id_map[id];
    if (!record) {
      throw 'Unable to find a record of name ' + String(id) + ' in Transfer\'s ID map';
    } else {
      return record;
    }
  };

  var create_flat_map = (records, map) => {
    if (map === undefined) {
      map = {};
    }

    angular.forEach(records, record => {
      map[record.id] = record;
      create_flat_map(record.children, map);
    });

    return map;
  };

  var populate_tag_list = (records, list) => {
    angular.forEach(records, (record, id) => {
      if (!record.tags) {
        return;
      }
      for (var i = 0; i < record.tags.length; i++) {
        var tag = record.tags[i];
        if (list.indexOf(tag) === -1) {
          list.push(tag);
        }
      }
    });
  };

  var clean_record_titles = records => {
    angular.forEach(records, record => {
      record.title = Base64.decode(record.title);
      record.relative_path = Base64.decode(record.relative_path);
    });
  };

  var remove_tag_if_necessary = (self, tag) => {
    if (self.list_tags(tag).length === 0) {
      self.tags = self.tags.filter(element => element !== tag);
    }
  };

  var remove_all = function(id) {
    var record = this.id_map[id];
    if (record) {
      record.tags = [];
    }
  };

  return {
    data: [],
    formats: [],
    id_map: {},
    tags: [],
    resolve: function(data) {
      this.data = data.transfers;
      this.formats = data.formats;
      this.id_map = create_flat_map(data.transfers);
      populate_tag_list(this.id_map, this.tags);
      clean_record_titles(this.id_map);
      this.filter();
    },
    filter: function() {
      angular.forEach(this.id_map, file => {
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
      angular.forEach(ids, id => {
        this.add_tag(id, tag, skip_submit);
      });
    },
    remove_tag: function(id, tag, skip_submit) {
      var record = get_record.apply(this, [id]);

      if (!tag) {
        var record = get_record.apply(this, [id]);
        var tags_for_id = record.tags;

        remove_all.apply(this, [id]);
        angular.forEach(tags_for_id, tag => {
          remove_tag_if_necessary(this, tag);
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
      remove_tag_if_necessary(this, tag);

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
      angular.forEach(this.id_map, (record, id) => {
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
