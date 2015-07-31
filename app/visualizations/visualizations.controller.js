'use strict';

(function() {
  angular.module('visualizationsController', [
    'angularCharts',
    'fileListService',
    'selectedFilesService',
  ]).

  controller('VisualizationsController', ['$scope', 'FileList', 'SelectedFiles', function($scope, FileList, SelectedFiles) {
    // Displays aggregate information about file formats;
    // the selected record data is filtered/reformatted in the view.
    $scope.records = SelectedFiles;
    $scope.format_chart_type = 'pie';
    $scope.format_config = {
      // Formats (total)
      click: function(d) {
        FileList.files = SelectedFiles.selected.filter(function (file) {
          return file.puid === d.data.puid;
        });
      },
      tooltips: true,
      labels: false,
      legend: {
        display: true,
        position: 'right',
      },
      colors: d3.scale.category20().range(),
    };

    $scope.size_chart_type = 'pie';
    $scope.size_config = {
      // Formats (by size)
      click: function(d) {
        FileList.files = SelectedFiles.selected.filter(function (file) {
          return file.puid === d.data.puid;
        });
      },
      tooltips: true,
      labels: false,
      legend: {
        display: true,
        position: 'right',
      },
      colors: d3.scale.category20().range(),
    };
  }]);
})();
