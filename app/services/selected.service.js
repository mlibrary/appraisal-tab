'use strict';

(function() {
  angular.module('selectedFilesService', []).

  service('SelectedFiles', [function() {
    return {
      add: function(file) {
        // Remove any occurrences of this file if they already exist
        this.remove(file.id);
        this.selected.push(file);
      },
      remove: function(uuid) {
        this.selected = this.selected.filter(function(el) {
          return el.id !== uuid;
        });
      },
      list_ids: function() {
        return this.selected.map(function(record) {
          return record.id;
        });
      },
      // TODO: look at optimizing file lookup-by-id if this gets used a lot
      get: function(id) {
        for (var i = 0; i < this.selected.length; i++) {
          var item = this.selected[i];
          if (item.id === id) {
            return item;
          }
        }
      },
      selected: [],
    };
  }]);
})();
