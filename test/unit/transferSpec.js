'use strict';

describe('Transfer', function() {
  beforeEach(module('transferService'));
  beforeEach(angular.mock.inject(function(_$httpBackend_) {
    _$httpBackend_.when('GET', '/transfers.json').respond({
      'formats': [],
      'transfers': [
        {
          'id': 'd5700e44-68f1-4eec-a7e4-c5a5c7da2373',
          'name': 'Images-49c47319-1387-48c4-aab7-381923f07f7c',
          'children': [],
        },
      ],
    });
  }));

  it('should return a JSON array of objects when fetching transfer backlog records', inject(function(_$httpBackend_, Transfer) {
    Transfer.all().then(function(objects) {
        expect(objects.transfers.length).toEqual(1);
        expect(objects.transfers[0].id).toEqual('d5700e44-68f1-4eec-a7e4-c5a5c7da2373');
    });
    _$httpBackend_.flush();
  }));
});
