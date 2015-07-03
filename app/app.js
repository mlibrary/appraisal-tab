'use strict';

// Declare app level module which depends on views, and components
angular.module('appraisalTab', [
  'ngRoute',
  'route-segment',
  'view-segment',
  'angularCharts',
  'restangular',
  'treeControl',
  'appraisalTab.version',
  'archivesSpaceService',
  'facetService',
  'selectedFilesService',
  'transferService',
  'fileService',
  'facetFilter',
  'aggregationFilters',
  'archivesSpaceController',
  'examineContentsController',
  'facetController',
  'reportController',
  'treeController',
  'visualizationsController',
]).config(function(RestangularProvider) {
    RestangularProvider.setBaseUrl('/app/fixtures');
    RestangularProvider.setDefaultHttpFields({cache: true});
}).config(function($routeSegmentProvider) {
  $routeSegmentProvider.options.autoLoadTemplates = true;
  $routeSegmentProvider.options.strictMode = true;

  $routeSegmentProvider.
    when('/report', 'report').
    when('/contents', 'examine_contents').
    when('/contents/:id/:type', 'examine_contents.file_info').
    when('/visualizations', 'visualizations').
    when('/visualizations/files', 'visualizations.files').
    when('/visualizations/size', 'visualizations.size').
    when('/archivesspace', 'archivesspace').

    segment('report', {
      templateUrl: 'report/report.html',
      controller: 'ReportController',
    }).

    segment('examine_contents', {
      templateUrl: 'examine_contents/examine_contents.html',
      controller: 'ExamineContentsController',
    }).
    within().
      segment('file_info', {
        templateUrl: 'examine_contents/file_info.html',
        controller: 'ExamineContentsFileController',
        dependencies: ['id', 'type'],
      }).
    up().

    segment('visualizations', {
      templateUrl: 'visualizations/visualizations.html',
      controller: 'VisualizationsController',
    }).
    within().
      segment('files', {
        default: 'true',
        templateUrl: 'visualizations/formats_by_files.html',
      }).
      segment('size', {
        templateUrl: 'visualizations/formats_by_size.html',
      }).
    up().

    segment('archivesspace', {
      templateUrl: 'archivesspace/archivesspace.html',
      controller: 'ArchivesSpaceController',
    });
}).controller('MainController', ['$scope', '$routeSegment', function($scope, $routeSegment) {
  $scope.$routeSegment = $routeSegment;
}]);
