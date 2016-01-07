import angular from 'angular';

angular.module('alertService', []).

service('Alert', function() {
  return {
    alerts: [],
  };
});
