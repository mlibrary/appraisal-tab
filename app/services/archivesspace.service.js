'use strict';

(function() {
  angular.module('archivesSpaceService', ['restangular']).

  factory('ArchivesSpace', ['Restangular', function(Restangular) {
      var ArchivesSpace = Restangular.all('archivesspace.json');
      return {
        all: function() {
          return ArchivesSpace.customGET();
        },
        get: function(id) {
          var url_fragment = id.replace(/\//g, '-');
          // TODO make this use the ArchivesSpace object above, once these
          // are both fetching from real services and not fixtures
          return Restangular.all('archivesspace').one(url_fragment).get();
        },
        get_levels_of_description: function() {
          return Restangular.all('archivesspace').one('levels').getList();
        },
        add_child: function(id, record) {
          var url_fragment = id.replace(/\//g, '-');
          return Restangular.all('archivesspace').one(url_fragment).one('children').customPUT(record);
        },
      };
  }]);
})();
