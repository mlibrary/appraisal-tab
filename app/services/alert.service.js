'use strict';

import angular from 'angular';

(function() {
  angular.module('alertService', []).

  service('Alert', function() {
    return {
      alerts: [],
    };
  });
})();
