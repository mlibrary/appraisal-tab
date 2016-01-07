import angular from 'angular';

angular.module('examineContentsController', []).

controller('ExamineContentsController', ['$routeSegment', 'FileList', 'SelectedFiles', 'Transfer', function($routeSegment, FileList, SelectedFiles, Transfer) {
  var vm = this;

  vm.$routeSegment = $routeSegment;
  vm.type = $routeSegment.$routeParams.type;
  vm.SelectedFiles = SelectedFiles;

  vm.selected = [];
  vm.all_selected = false;

  vm.select_all = files => {
    if (!vm.all_selected) {
      vm.selected = files.map(file => file.id);
      vm.all_selected = true;
    } else {
      vm.selected = [];
      vm.all_selected = false;
    }
  };

  vm.submit = ids => {
    var tag = this.tag;
    if (!tag) {
      return;
    }

    Transfer.add_list_of_tags(ids, tag);
    this.tag = '';
  };

  vm.add_to_file_list = ids => {
    FileList.files = SelectedFiles.selected.filter(file => ids.indexOf(file.id) > -1);
  };
}]).

controller('ExamineContentsFileController', ['$routeSegment', 'File', function($routeSegment, File) {
  var vm = this;

  vm.id = $routeSegment.$routeParams.id;
  vm.type = $routeSegment.$routeParams.type;
  File.bulk_extractor_info(vm.id, [vm.type]).then(data => {
    vm.file = data;
  });
}]);
