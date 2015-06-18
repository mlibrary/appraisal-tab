'use strict';

(function() {
  angular.module('visualizationsController', ['angularCharts', 'selectedFilesService']).controller('VisualizationsController', ['$scope', 'Facet', 'SelectedFiles', function($scope, Facet, SelectedFiles) {
    // Displays aggregate information about file formats;
    // the selected record data is filtered/reformatted in the view.
    $scope.records = SelectedFiles;
    $scope.puid_chart_type = 'pie';
    $scope.puid_config = {
      click: function(d) {
        Facet.remove('puid');
        Facet.add('puid', d.data.x);
      },
      title: 'Formats (total)',
      tooltips: true,
      labels: false,
      legend: {
        display: true,
        position: 'right',
      },
    };

    $scope.size_chart_type = 'pie';
    $scope.size_config = {
      click: function(d) {
        Facet.remove('puid');
        Facet.add('puid', d.data.x);
      },
      title: 'Formats (by size)',
      tooltips: true,
      labels: false,
      legend: {
        display: true,
        position: 'right',
      },
    };
  }]);
})();
