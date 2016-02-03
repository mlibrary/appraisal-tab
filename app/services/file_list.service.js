import angular from 'angular';

angular.module('fileListService', []).

// Tracks a list of files, independent of the currently selected files,
// and provides a few functions to manipulate that list.
service('FileList', function() {
  return {
    files: [],
    // Attempts to locate a file with the given `id` within the file list.
    // Returns `undefined` if no matching file is present.
    get: function(id) {
      // How slow will this get? Do we need to look at storing a list
      // optimized for quick lookup?
      for (var i = 0; i < this.files.length; i++) {
        var file = this.files[i];
        if (file.id === id) {
          return file;
        }
      }
    },
    // Attempts to remove the file with the given `id` from the file list.
    // Does nothing if no matching file is present.
    remove: function(id) {
      this.files = this.files.filter(file => file.id !== id);
    },
    // Empties the file list.
    clear: function() {
      this.files = [];
    },
  };
});
