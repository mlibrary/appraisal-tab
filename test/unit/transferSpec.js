'use strict';

describe('Transfer', function() {
  beforeEach(module('transferService'));
  beforeEach(angular.mock.inject(function(_$httpBackend_) {
    _$httpBackend_.when('GET', '/ingest/appraisal_list?field=&query=&type=term').respond({
      'formats': [
        {
          'label': 'Powerpoint 97-2002',
          'puid': 'fmt/126',
        },
      ],
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

  it('should be able to track a copy of fetched transfers on itself', inject(function(_$httpBackend_, Transfer) {
    Transfer.resolve();
    _$httpBackend_.flush();
    expect(Transfer.data.length).toEqual(1);
    expect(Transfer.data[0].id).toEqual('d5700e44-68f1-4eec-a7e4-c5a5c7da2373');
  }));

  it('should provide a flat map of all stored transfers using IDs as keys', inject(function(_$httpBackend_, Transfer) {
    Transfer.resolve();
    _$httpBackend_.flush();
    expect(Transfer.id_map['d5700e44-68f1-4eec-a7e4-c5a5c7da2373'].name).toEqual('Images-49c47319-1387-48c4-aab7-381923f07f7c');
  }));

  it('should be able to track a copy of the fetched transfers\' formats on itself', inject(function(_$httpBackend_, Transfer) {
    Transfer.resolve();
    _$httpBackend_.flush();
    expect(Transfer.formats.length).toEqual(1);
    expect(Transfer.formats[0].puid).toEqual('fmt/126');
  }));
});
