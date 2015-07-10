'use strict';

(function() {
  angular.module('selectedFilesService', ['fileService']).

  service('SelectedFiles', ['File', function(File) {
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
      selected: [],
    };
  }]);
})();
