import angular from 'angular';

(function() {
  angular.module('fileListController', ['fileListService']).

  controller('FileListController', ['$scope', '$routeSegment', 'FileList', 'Transfer', function($scope, $routeSegment, FileList, Transfer) {
    var vm = this;

    vm.$routeSegment = $routeSegment;
    vm.file_list = FileList;
    vm.remove_tag = function(id, tag) {
      Transfer.remove_tag(id, tag);
    };

    $scope.$watch('file_list.files', function() {
      vm.selected = [];
      vm.all_selected = false;
    });

    vm.selected = [];
    vm.all_selected = false;

    vm.select_all = function() {
      if (!vm.all_selected) {
        vm.selected = FileList.files.map(function(file) {
          return file.id;
        });
        vm.all_selected = true;
      } else {
        vm.selected = [];
        vm.all_selected = false;
      }
    };

    vm.submit = function(uuids) {
      var tag = this.tag;
      if (!tag) {
        return;
      }

      Transfer.add_list_of_tags(uuids, tag);
      this.tag = '';
    };

    // Sorting related
    vm.sort_property = 'title';
    vm.sort_reverse = false;

    vm.set_sort_property = function(property) {
      if (vm.sort_property === property) {
        vm.sort_reverse = !vm.sort_reverse;
      } else {
        vm.sort_reverse = false;
        vm.sort_property = property;
      }
    };

    vm.date_regex = '\\d\\d\\d\\d([-\/]\\d\\d?)?([-\/]\\d\\d?)?';

    var format_date = function(start, end) {
      var s;
      if (!start) {
        s = ' -';
      } else {
        s = start + ' -';
      }
      if (end) {
        s += ' ' + end;
      }

      return s;
    };

    var date_is_valid = function(date) {
      if (date === undefined) {
        return false;
      } else {
        return date.length < 4 ? false : true;
      }
    }

    var default_filter = function() {
      return true;
    };
    vm.facet_filter = default_filter;

    vm.reset_dates = function() {
      vm.date_facet = '';
      vm.facet_filter = default_filter;
    }

    vm.set_date_filter = function(start_date, end_date) {
      // Remove the facet immediately, so that the facet is updated if a user
      // enters an invalid date
      vm.date_facet = '';
      vm.facet_filter = default_filter;
      if (!start_date && !end_date) {
        return;
      }

      var default_start_date = -62167219200000; // BC 1
      var default_end_date = 3093496473600000; // AD 99999
      var start = date_is_valid(start_date) ? Date.parse(start_date) : default_start_date;
      var end = date_is_valid(end_date) ? Date.parse(end_date) : default_end_date;

      // Can occur if either date is invalid, for example 2015/99/99
      if (isNaN(start) || isNaN(end)) {
        return;
      }

      vm.date_facet = format_date(start_date, end_date);
      vm.facet_filter = function(date) {
        if (date === undefined) {
          return true;
        }

        // TODO: handle unparseable dates
        var date_as_int = Date.parse(date);
        return date_as_int >= start && date_as_int <= end;
      };
    };
  }]);
})();
