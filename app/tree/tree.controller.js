'use strict';

(function() {
  var treeController = angular.module('treeController', []).

  controller('TreeController', ['$scope', 'SelectedFiles', 'Tag', 'Transfer', function($scope, SelectedFiles, Tag, Transfer) {
    $scope.helper = function() {
      var uuid = $(this).attr('uuid');
      var file = Transfer.id_map[uuid];
      // TODO: style this element
      return $('<div>' + file.title + '</div>');
    }

    $scope.options = {
      dirSelectable: true,
      multiSelection: true,
      equality: function(a, b) {
        if (a === undefined || b === undefined) {
          return false;
        }
        return a.id === b.id;
      },
      injectClasses: {
        li: 'file',
      },
    };
    $scope.selected = [];

    $scope.remove_tag = function(id, tag) {
      Tag.remove(id, tag);
    };

    var add_file = function(node) {
      SelectedFiles.add(node);
      $scope.selected.push(node);
      if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
          var child = node.children[i];
          add_file(child);
        }
      }
    };

    var remove_file = function(node) {
      SelectedFiles.remove(node.id);
      $scope.selected.pop(node);
      if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
          var child = node.children[i];
          remove_file(child);
        }
      }
    };

    // TODO: * this does select all files, but it doesn't select them in the UI
    $scope.track_selected = function(node, selected) {
      if (selected) {
        add_file(node);
      } else {
        remove_file(node);
      }
    };
    $scope.transfers = Transfer;
    Transfer.resolve();
  }]);
})();
