'use strict';

(function() {
  angular.module('examineContentsController', []).

  controller('ExamineContentsController', ['$routeSegment', 'FileList', 'SelectedFiles', 'Tag', function($routeSegment, FileList, SelectedFiles, Tag) {
    var vm = this;

    vm.$routeSegment = $routeSegment;
    vm.type = $routeSegment.$routeParams.type;
    vm.SelectedFiles = SelectedFiles;

    vm.selected = [];
    vm.all_selected = false;

    vm.select_all = function(files) {
      if (!vm.all_selected) {
        vm.selected = files.map(function(file) {
          return file.id;
        });
        vm.all_selected = true;
      } else {
        vm.selected = [];
        vm.all_selected = false;
      }
    };

    vm.submit = function(ids) {
      var tag = this.tag;
      if (!tag) {
        return;
      }

      Tag.add_list(ids, tag);
      this.tag = '';
    };

    vm.add_to_file_list = function(ids) {
      FileList.files = SelectedFiles.selected.filter(function(file) {
        return ids.indexOf(file.id) > -1;
      });
    };
  }]).

  controller('ExamineContentsFileController', ['$routeSegment', 'File', function($routeSegment, File) {
    var vm = this;

    vm.id = $routeSegment.$routeParams.id;
    vm.type = $routeSegment.$routeParams.type;
    File.bulk_extractor_info(vm.id).then(function(data) {
      vm.file = data;
    });
  }]);
})();
