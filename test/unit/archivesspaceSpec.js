'use strict';

describe('ArchivesSpace', function() {
  beforeEach(module('archivesSpaceService'));
  beforeEach(angular.mock.inject(function(_$httpBackend_) {
    _$httpBackend_.when('GET', '/archivesspace.json').respond([
      {
        'dates': '2015-01-01',
        'title': 'Test fonds',
        'levelOfDescription': 'fonds',
        'children': [],
        'sortPosition': 2,
        'identifier': 'F1',
        'id': '/repositories/2/resources/1',
      },
    ]);
  }));

  it('should be able to return a list of all ArchivesSpace records', inject(function(_$httpBackend_, ArchivesSpace) {
    ArchivesSpace.all().then(function(objects) {
      expect(objects.length).toEqual(1);
      expect(objects[0].title).toEqual('Test fonds');
    });
    _$httpBackend_.flush();
  }));
});
