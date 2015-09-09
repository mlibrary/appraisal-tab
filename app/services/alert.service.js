'use strict';

(function() {
  angular.module('alertService', []).

  service('Alert', function() {
    return {
      alerts: [],
    };
  });
})();
