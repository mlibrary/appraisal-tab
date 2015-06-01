'use strict';

// Declare app level module which depends on views, and components
angular.module('appraisalTab', [
  'restangular',
  'appraisalTab.version',
  'facetService',
  'selectedFilesService',
  'transferService',
  'fileService',
  'facetFilter',
  'aggregationFilters',
  'treeView',
  'facetController',
  'reportController',
  'treeController',
]).config(function(RestangularProvider) {
    RestangularProvider.setBaseUrl('/app/fixtures');
});
