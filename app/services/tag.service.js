'use strict';

(function() {
  angular.module('tagService', ['restangular']).

  factory('Tag', ['$log', 'Restangular', function($log, Restangular) {
    var Tag = Restangular.all('file');

    // public

    var get = function(id, tags) {
      return Tag.one(id).one('tags').getList();
    };

    var submit = function(id, tags) {
      Tag.one(id).one('tags').customPUT(tags).then(null, function(response) {
        // TODO display error handling
        $log.error('Submitting tags for file ' + String(id) + ' failed with response: ', response.status);
      });
    };

    var remove = function(id) {
      Tag.one(id).one('tags').remove().then(null, function(response) {
        $log.error('Deleting tags for file ' + String(id) + ' failed with response: ' + response.status);
      });
    };

    return {
      get: get,
      submit: submit,
      remove: remove,
    };
  }]);
})();
