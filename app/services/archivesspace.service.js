'use strict';

(function() {
  angular.module('archivesSpaceService', ['restangular']).

  factory('ArchivesSpace', ['Restangular', function(Restangular) {
      var ArchivesSpace = Restangular.all('access').all('archivesspace');
      return {
        all: function() {
          return ArchivesSpace.getList();
        },
        get: function(id) {
          var url_fragment = id.replace(/\//g, '-');
          return ArchivesSpace.one(url_fragment).get();
        },
        get_levels_of_description: function() {
          return ArchivesSpace.one('levels').getList();
        },
        add_child: function(id, record) {
          var url_fragment = id.replace(/\//g, '-');
          return ArchivesSpace.one(url_fragment).one('children').customPUT(record);
        },
      };
  }]);
})();
