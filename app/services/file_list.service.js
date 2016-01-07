import angular from 'angular';

(function() {
  angular.module('fileListService', []).

  service('FileList', function() {
    return {
      files: [],
      // How slow will this get? Do we need to look at storing a list
      // optimized for quick lookup?
      get: function(id) {
        for (var i = 0; i < this.files.length; i++) {
          var file = this.files[i];
          if (file.id === id) {
            return file;
          }
        }
      },
      remove: function(id) {
        this.files = this.files.filter(function(file) {
          return file.id !== id;
        });
      },
      clear: function() {
        this.files = [];
      },
    };
  });
})();
