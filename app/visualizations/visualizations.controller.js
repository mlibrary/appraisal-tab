import angular from 'angular';

angular.module('visualizationsController', [
  'angularCharts',
  'selectedFilesService',
]).

controller('VisualizationsController', ['$scope', 'SelectedFiles', function($scope, SelectedFiles) {
  // Displays aggregate information about file formats;
  // the selected record data is filtered/reformatted in the view.
  $scope.records = SelectedFiles;
  $scope.format_chart_type = 'pie';
  $scope.format_config = {
    // Formats (total)
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
    tooltips: true,
    labels: false,
    legend: {
      display: true,
      position: 'right',
    },
    colors: d3.scale.category20().range(),
  };
}]);
