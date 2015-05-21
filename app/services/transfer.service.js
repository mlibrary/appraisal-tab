'use strict';

(function() {
  var transferService = angular.module('transferService', ['restangular']);

  transferService.factory('Transfer', function(Restangular) {
    var Transfer = Restangular.all('transfers.json');
    return {
      all: function() {
        return Transfer.getList();
      },
    };
  });
})();
