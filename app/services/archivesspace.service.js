'use strict';

(function() {
  angular.module('archivesSpaceService', ['restangular']).

  factory('ArchivesSpace', ['Restangular', function(Restangular) {
      var id_to_urlsafe = function(id) {
        return id.replace(/\//g, '-');
      };

      var ArchivesSpace = Restangular.all('access').all('archivesspace');
      return {
        all: function() {
          return ArchivesSpace.getList();
        },
        get: function(id) {
          var url_fragment = id_to_urlsafe(id);
          return ArchivesSpace.one(url_fragment).get();
        },
        get_by_accession: function(accession) {
          return ArchivesSpace.one('accession').one(accession).getList();
        },
        get_children: function(id) {
          var url_fragment = id_to_urlsafe(id);
          return ArchivesSpace.one(url_fragment).one('children').getList();
        },
        get_levels_of_description: function() {
          return ArchivesSpace.one('levels').getList();
        },
        edit: function(id, record) {
          var url_fragment = id_to_urlsafe(id);
          return ArchivesSpace.one(url_fragment).customPUT(record);
        },
        add_child: function(id, record) {
          var url_fragment = id_to_urlsafe(id);
          return ArchivesSpace.one(url_fragment).one('children').customPOST(record);
        },
        create_directory: function(id) {
          var url_fragment = id_to_urlsafe(id);
          return ArchivesSpace.one(url_fragment).one('create_directory_within_arrange').customPOST();
        },
        copy_to_arrange: function(id, filepath) {
          var url_fragment = id_to_urlsafe(id);
          return ArchivesSpace.one(url_fragment).customPOST(
            $.param({filepath: Base64.encode(filepath)}),
            'copy_to_arrange',
            {},
            {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
          );
        },
        list_arrange_contents: function(id, parent) {
          // TODO don't clone these from SIPArrange
          var decode_entry_response = function(response) {
            var new_response = _.extend({}, response);

            angular.forEach(['entries', 'directories'], function(key) {
              new_response[key] = response[key].map(Base64.decode);
            });
            angular.forEach(response.properties, function(value, key) {
              new_response.properties[Base64.decode(key)] = value;
            });

            return new_response;
          };

          // TODO don't dupe this from SipArrange
          var format_results = function(data) {
            return data.entries.map(function(element) {
              var child = {
                title: element,
                path: parent ? parent.path + '/' + element : element,
                parent: parent,
                display: true,
                properties: data.properties[element],
              };

              if (data.directories.indexOf(element) > -1) {
                // directory
                child.has_children = true;
                child.children = [];
                child.children_fetched = false;
              } else {
                // file
                child.has_children = false;
              }

              return child;
            });
          };

          var url_fragment = id_to_urlsafe(id);
          return ArchivesSpace.one(url_fragment).one('contents').one('arrange').get(url_fragment).then(decode_entry_response).then(format_results);
        },
        start_sip: function(id) {
          var url_fragment = id_to_urlsafe(id);
          return ArchivesSpace.one(url_fragment).one('copy_from_arrange').post();
        },
      };
  }]);
})();
