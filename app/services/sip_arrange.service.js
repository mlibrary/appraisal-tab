import angular from 'angular';
import {decode_browse_response, format_entries} from 'archivematica-browse-helpers';
import $ from 'jquery';
import Base64 from 'base64-helpers';
// lodash is used by restangular
import 'lodash';
import 'restangular';

angular.module('sipArrangeService', ['restangular']).

factory('SipArrange', ['Restangular', function(Restangular) {
  var SipArrange = Restangular.one('filesystem');

  // public

  var create_directory = function(path, title, parent) {
    // Return a formatted directory object
    var on_success = success => {
      return {
        title: title,
        has_children: true,
        children: [],
        path: path.replace(/^\/arrange\//, ''),
        parent: parent,
        display: true,
        children_fetched: false,
        type: 'arrange_entry',
        directory: true,
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
    var format_root = data => {
      return data.directories.map(directory => {
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
          type: 'arrange_entry',
          directory: true,
        };
      });
    };

    let format_files = data => {
      let entries = format_entries(data, parent.path, parent);
      entries.forEach(entry => entry.type = 'arrange_entry');
      return entries;
    };

    path = path || '';
    var on_success = path === '' ? format_root : format_files;
    return SipArrange.one('contents').one('arrange').get({path: Base64.encode(path)}).then(decode_browse_response).then(on_success);
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

  return {
    create_directory: create_directory,
    copy_to_arrange: copy_to_arrange,
    list_contents: list_contents,
    remove: remove,
    start_sip: start_sip,
  };
}]);
