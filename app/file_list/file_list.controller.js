'use strict';

(function() {
  angular.module('fileListController', ['fileListService']).

  controller('FileListController', ['$scope', '$routeSegment', 'FileList', 'Tag', function($scope, $routeSegment, FileList, Tag) {
    $scope.$routeSegment = $routeSegment;
    $scope.file_list = FileList;
    $scope.remove_tag = function(id, tag) {
      Tag.remove(id, tag);
    };

    $scope.$watch('file_list.files', function() {
      $scope.selected = [];
      $scope.all_selected = false;
    });

    $scope.selected = [];
    $scope.all_selected = false;

    $scope.select_all = function() {
      if (!$scope.all_selected) {
        $scope.selected = FileList.files.map(function(file) {
          return file.id;
        });
        $scope.all_selected = true;
      } else {
        $scope.selected = [];
        $scope.all_selected = false;
      }
    };

    $scope.submit = function(uuids) {
      var tag = this.tag;
      if (!tag) {
        return;
      }

      Tag.add_list(uuids, tag);
      this.tag = '';
    };

    // Sorting related
    $scope.sort_property = 'title';
    $scope.sort_reverse = false;

    $scope.set_sort_property = function(property) {
      if ($scope.sort_property === property) {
        $scope.sort_reverse = !$scope.sort_reverse;
      } else {
        $scope.sort_reverse = false;
        $scope.sort_property = property;
      }
    };

    $scope.date_regex = '\\d\\d\\d\\d([-\/]\\d\\d?)?([-\/]\\d\\d?)?';

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
    $scope.facet_filter = default_filter;

    $scope.reset_dates = function() {
      $scope.date_facet = '';
      $scope.facet_filter = default_filter;
    }

    $scope.set_date_filter = function(start_date, end_date) {
      // Remove the facet immediately, so that the facet is updated if a user
      // enters an invalid date
      $scope.date_facet = '';
      $scope.facet_filter = default_filter;
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

      $scope.date_facet = format_date(start_date, end_date);
      $scope.facet_filter = function(date) {
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
