'use strict';

(function() {
  angular.module('selectedFilesService', ['fileService']).service('SelectedFiles', function(File) {
    return {
      add: function(uuid) {
        // assign `this` to another variable to pass it into the `then` function
        var self = this;
        File.get(uuid).then(function(file) {
          // Remove any occurrences of this file if they already exist
          self.remove(uuid);
          self.selected.push(file);
        });
      },
      remove: function(uuid) {
        this.selected = this.selected.filter(function(el) {
          return el.id !== uuid;
        });
      },
      selected: [],
    };
  });
})();
