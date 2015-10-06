'use strict';

(function() {
  angular.module('sipArrangeService', ['restangular']).

  factory('SipArrange', ['Restangular', function(Restangular) {
    var SipArrange = Restangular.one('filesystem');

    // public

    var create_directory = function(path, title, parent) {
      // Return a formatted directory object
      var on_success = function(success) {
        return {
          title: title,
          has_children: true,
          children: [],
          path: path.replace(/^\/arrange\//, ''),
          parent: parent,
          display: true,
          children_fetched: false,
        };
      };

      return post_form(SipArrange, 'create_directory_within_arrange', {path: Base64.encode(path)}).then(on_success);
    };

    var copy_to_arrange = function(source, destination) {
      var params = {
        'filepath': Base64.encode(source),
        'destination': Base64.encode(destination),
      };
      return post_form(SipArrange, 'copy_to_arrange', params);
    };

    var list_contents = function(path, parent) {
      var format_root = function(data) {
        return data.directories.map(function(directory) {
          return {
            title: directory,
            has_children: true,
            children: [],
            // "path" tracks the full path to the directory, including
            // all of its parents.
            // Since these are top-level directories, their paths are the
            // same as their names.
            path: directory,
            display: true,
            properties: data.properties[directory],
            children_fetched: false,
          };
        });
      };

      var format_entries = function(data) {
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

      path = path || '';
      var on_success = path === '' ? format_root : format_entries;
      return SipArrange.one('contents').one('arrange').get({path: Base64.encode(path)}).then(decode_entry_response).then(on_success);
    };

    var move = function(source, destination) {
      var params = {
        'filepath': Base64.encode(source),
        'destination': Base64.encode(destination),
      };
      return post_form(SipArrange, 'move_within_arrange', params);
    };

    var remove = function(target) {
      return post_form(SipArrange.one('delete'), 'arrange', {filepath: Base64.encode(target)});
    };

    var start_sip = function(target) {
      return post_form(SipArrange, 'copy_from_arrange', {filepath: Base64.encode(target)});
    };

    // private

    // Helper function to POST content with a form-encoded body
    // instead of a JSON-encoded body.
    var post_form = function(model, path, body) {
      return model.customPOST(
        // form-encode body
        $.param(body),
        path,
        {}, // URL parameters - always empty
        {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
      )
    };

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

    return {
      create_directory: create_directory,
      copy_to_arrange: copy_to_arrange,
      list_contents: list_contents,
      move: move,
      remove: remove,
      start_sip: start_sip,
    };
  }]);
})();
