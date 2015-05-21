'use strict';

(function() {
  var transferService = angular.module('transferService', ['restangular']);

  transferService.factory('Transfer', function(Restangular) {
    return Restangular.all('transfers.json');
  });
})();
