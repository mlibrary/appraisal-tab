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
    _$httpBackend_.when('GET', '/archivesspace/-repositories-2-archival_objects-4').respond({
        'dates': '',
        'title': 'Test file',
        'levelOfDescription': 'file',
        'children': false,
        'sortPosition': 5,
        'identifier': 'F1-1-1-1',
        'id': '/repositories/2/archival_objects/4',
    });
    _$httpBackend_.when('GET', '/archivesspace/levels').respond([
      'class',
      'collection',
      'file',
      'fonds',
      'item',
      'otherlevel',
      'recordgrp',
      'series',
      'subfonds',
      'subgrp',
      'subseries',
    ]);
    _$httpBackend_.when('PUT', '/archivesspace/-repositories-2-archival_objects-4/children').respond({
      'success': true,
      'id': '/repositories/2/archival_objects/5',
      'message': 'New record successfully created',
    });
  }));

  it('should be able to return a list of all ArchivesSpace records', inject(function(_$httpBackend_, ArchivesSpace) {
    ArchivesSpace.all().then(function(objects) {
      expect(objects.length).toEqual(1);
      expect(objects[0].title).toEqual('Test fonds');
    });
    _$httpBackend_.flush();
  }));

  it('should be able to fetch a specific ArchivesSpace record', inject(function(_$httpBackend_, ArchivesSpace) {
    ArchivesSpace.get('/repositories/2/archival_objects/4').then(function(object) {
      expect(object.children).toBe(false);
      expect(object.title).toEqual('Test file');
    });
    _$httpBackend_.flush();
  }));

  it('should be able to fetch the levels of description', inject(function(_$httpBackend_, ArchivesSpace) {
    ArchivesSpace.get_levels_of_description().then(function(levels) {
      expect(levels.length).toEqual(11);
      expect(levels[0]).toEqual('class');
    });
    _$httpBackend_.flush();
  }));

  it('should be able to add child records', inject(function(_$httpBackend_, ArchivesSpace) {
    ArchivesSpace.add_child('/repositories/2/archival_objects/4', {
      'title': 'New record',
      'level': 'series',
    }).then(function(response) {
      expect(response.success).toBe(true);
      expect(response.id).toEqual('/repositories/2/archival_objects/5');
    });
    _$httpBackend_.flush();
  }));
});
