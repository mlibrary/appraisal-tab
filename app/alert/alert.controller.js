'use strict';

import angular from 'angular';

(function() {
  angular.module('alertController', ['alertService']).

  controller('AlertDisplayController', ['Alert', function(Alert) {
    var vm = this;

    vm.alert = Alert;
    vm.remove = function(index) {
      Alert.alerts.splice(index, 1);
    };
  }]);
})();
