'use strict';

// Declare app level module which depends on views, and components
angular.module('appraisalTab', [
  'restangular',
  'appraisalTab.version',
  'facetService',
  'transferService',
  'fileService',
  'facetFilter',
]).config(function(RestangularProvider) {
    RestangularProvider.setBaseUrl('/fixtures');
});
