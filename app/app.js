'use strict';

// Declare app level module which depends on views, and components
angular.module('appraisalTab', [
  'ngRoute',
  'route-segment',
  'view-segment',
  'angularCharts',
  'restangular',
  'treeControl',
  'ui.bootstrap',
  'appraisalTab.version',
  'checklistDirective',
  'treeDirectives',
  'uiDirectives',
  'alertService',
  'archivesSpaceService',
  'facetService',
  'selectedFilesService',
  'sipArrangeService',
  'transferService',
  'fileService',
  'tagService',
  'facetFilter',
  'aggregationFilters',
  'analysisController',
  'alertController',
  'archivesSpaceController',
  'arrangementController',
  'examineContentsController',
  'facetController',
  'fileListController',
  'previewController',
  'reportController',
  'searchController',
  'treeController',
  'visualizationsController',
]).

config(['RestangularProvider', function(RestangularProvider) {
  RestangularProvider.setRequestSuffix('/');
}]).

config(['$routeSegmentProvider', function($routeSegmentProvider) {
  $routeSegmentProvider.options.autoLoadTemplates = true;
  $routeSegmentProvider.options.strictMode = true;

  $routeSegmentProvider.
    when('/objects', 'objects').
    when('/objects/report', 'objects.report').
    when('/objects/visualizations', 'objects.visualizations').
    when('/objects/visualizations/files', 'objects.visualizations.files').
    when('/objects/visualizations/size', 'objects.visualizations.size').
    when('/tags', 'tags').
    when('/contents', 'examine_contents').
    when('/contents/:type', 'examine_contents').
    when('/contents/:id/:type', 'examine_contents.file_info').
    when('/preview', 'preview').
    when('/preview/:id', 'preview').

    segment('objects', {
      templateUrl: 'analysis/analysis.html',
      controller: 'AnalysisController',
    }).
    within().
      segment('report', {
        default: true,
        templateUrl: 'report/format.html',
        controller: 'ReportController',
      }).
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
    up().

    segment('tags', {
      templateUrl: 'report/tags.html',
      controller: 'ReportController',
    }).

    segment('examine_contents', {
      templateUrl: 'examine_contents/examine_contents.html',
      controller: 'ExamineContentsController',
      controllerAs: 'vm',
      dependencies: ['type'],
    }).
    within().
      segment('file_info', {
        templateUrl: 'examine_contents/file_info.html',
        controller: 'ExamineContentsFileController',
        controllerAs: 'vm',
        dependencies: ['id', 'type'],
      }).
    up().

    segment('preview', {
      templateUrl: 'preview/preview.html',
      controller: 'PreviewController',
      dependencies: ['id'],
    });
}]).

controller('MainController', ['$scope', '$routeSegment', function($scope, $routeSegment) {
  $scope.$routeSegment = $routeSegment;
}]);
