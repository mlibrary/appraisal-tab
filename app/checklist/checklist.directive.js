import angular from 'angular';

angular.module('checklistDirective', []).

directive('checklist', ['$compile', '$parse', function($compile, $parse) {
  return {
    restrict: 'A',
    link: function($scope, element, attrs) {
      var get_record = $parse(attrs.ngElement);
      var get_selected = $parse(attrs.selectedList);
      var set_all_selected = $parse(attrs.allSelected).assign;
      var get_record_count = $parse(attrs.recordCount);

      element.bind('click', () => {
        var selected = get_selected($scope);
        var record = get_record($scope);

        var index = selected.indexOf(record.id);
        $scope.$apply(() => {
          // remove from selection
          if (index > -1) {
            selected.splice(index, 1);
          } else {
            selected.push(record.id);
          }

          set_all_selected($scope, !(selected.length < get_record_count($scope)));
        });
      });
    },
  };
}]);
