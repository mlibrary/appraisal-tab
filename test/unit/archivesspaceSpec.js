'use strict';

import '../../app/services/archivesspace.service.js';

describe('ArchivesSpace', function() {
  beforeEach(angular.mock.module('archivesSpaceService'));
  beforeEach(angular.mock.inject(function(_$httpBackend_) {
    _$httpBackend_.when('GET', '/access/archivesspace').respond([
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
    _$httpBackend_.when('GET', '/access/archivesspace/-repositories-2-archival_objects-4').respond({
        'dates': '',
        'title': 'Test file',
        'levelOfDescription': 'file',
        'children': false,
        'sortPosition': 5,
        'identifier': 'F1-1-1-1',
        'id': '/repositories/2/archival_objects/4',
    });
    _$httpBackend_.when('GET', '/access/archivesspace/accession/AS-1').respond([
      {
        'dates': '2015-01-01',
        'title': 'Series created from accession AS-1',
        'levelOfDescription': 'series',
        'children': false,
        'sortPosition': 5,
        'identifier': 'AS-1',
        'id': '/repositories/2/resources/2',
      },
      {
        'dates': '2015-01-01',
        'title': 'Collection created from accession AS-1',
        'levelOfDescription': 'collection',
        'children': false,
        'sortPosition': 6,
        'identifier': 'AS-1',
        'id': '/repositories/2/resources/3',
      },
      ]);
    _$httpBackend_.when('GET', '/access/archivesspace/levels').respond(function() {
      return [
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
      ];
    });
    _$httpBackend_.when('POST', '/access/archivesspace/-repositories-2-archival_objects-4/children').respond({
      'success': true,
      'id': '/repositories/2/archival_objects/5',
      'message': 'New record successfully created',
    });
    _$httpBackend_.when('PUT', '/access/archivesspace/-repositories-2-archival_objects-4').respond({
      'success': true,
      'message': 'Record successfully edited',
    });
    _$httpBackend_.when('GET', '/access/archivesspace/-repositories-2-archival_objects-7/digital_object_components').respond([{
      'id': 1,
    }]);
    _$httpBackend_.when('POST', '/access/archivesspace/-repositories-2-archival_objects-7/digital_object_components').respond({
      'id': 2,
    });
    _$httpBackend_.when('PUT', '/access/archivesspace/-repositories-2-archival_objects-7/digital_object_components').respond('');
    _$httpBackend_.when('GET', '/access/archivesspace/-repositories-2-archival_objects-7/digital_object_components/2/files').respond({
      'entries': [
        'VGVzdA==',
      ],
      'directories': [
        'VGVzdA==',
      ],
      'properties': [],
    });
    _$httpBackend_.when('POST', '/access/archivesspace/-repositories-2-archival_objects-6/copy_from_arrange').respond({
      'message': 'SIP created.',
    });
    _$httpBackend_.when('DELETE', '/access/archivesspace/-repositories-2-archival_objects-6').respond({
      'status': 'Deleted',
      'id': 26,
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

  it('should be able to fetch records by accession number', inject(function(_$httpBackend_, ArchivesSpace) {
    ArchivesSpace.get_by_accession('AS-1').then(function(results) {
      expect(results.length).toBe(2);
      expect(results[0].title).toEqual('Series created from accession AS-1');
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

  it('should be able to edit existing records', inject(function(_$httpBackend_, ArchivesSpace) {
    ArchivesSpace.edit('/repositories/2/archival_objects/4', {
      'title': 'Changed title',
      'level': 'subsubseries',
    }).then(function(response) {
      expect(response.success).toBe(true);
    });
    _$httpBackend_.flush();
  }));

  it('should be able to list digital object components for a record', inject(function(_$httpBackend_, ArchivesSpace) {
    ArchivesSpace.digital_object_components('/repositories/2/archival_objects/7').then(function(result) {
      expect(result.length).toBe(1);
      expect(result[0].id).toEqual(1);
    });
    _$httpBackend_.flush();
  }));

  it('should be able to create a new digital object component', inject(function(_$httpBackend_, ArchivesSpace) {
    ArchivesSpace.create_digital_object_component('/repositories/2/archival_objects/7').then(function(result) {
      expect(result.id).toEqual(2);
    });
    _$httpBackend_.flush();
  }));

  it('should be able to edit an existing digital object component', inject(function(_$httpBackend_, ArchivesSpace) {
    var updated_record = {
      'id': 2,
      'label': 'Updated label',
      'title': 'Updated title',
    };
    ArchivesSpace.edit_digital_object_component('/repositories/2/archival_objects/7', updated_record);
    _$httpBackend_.flush();
  }));

  it('should be able to list files within a digital object component', inject(function(_$httpBackend_, ArchivesSpace) {
    ArchivesSpace.list_digital_object_component_contents('/repositories/2/archival_objects/7', '2').then(function(records) {
      expect(records.length).toEqual(1);
      expect(records[0].title).toEqual('Test');
      expect(records[0].has_children).toBe(true);
    });
    _$httpBackend_.flush();
  }));

  it('should be able to delete a record', inject(function(_$httpBackend_, ArchivesSpace) {
    ArchivesSpace.remove('/repositories/2/archival_objects/6').then(function(result) {
      expect(result.status).toEqual('Deleted');
    });
    _$httpBackend_.flush();
  }));

  it('should be able to start a SIP given a record ID', inject(function(_$httpBackend_, ArchivesSpace) {
    ArchivesSpace.start_sip('/repositories/2/archival_objects/6').then(function(response) {
      expect(response.message).toEqual('SIP created.');
    });
    _$httpBackend_.flush();
  }));
});
