'use strict';

describe('SelectedFiles', function() {
  beforeEach(module('selectedFilesService'));

  var test_item_1 = {
    'id': '054a0f2c-79bb-4051-b82b-4b0f14564811',
    'text': 'lion.svg',
  };

  var test_item_2 = {
    'id': '939110fa-8c73-4531-8aa0-aa28e90ca108',
    'text': 'garnet.jpg',
  };

  var test_item_3 = {
    'id': '3400c608-4dbf-4eeb-af22-7fb4ca6a5de6',
    'text': 'amethyst.tif',
  };

  beforeEach(angular.mock.inject(function(SelectedFiles) {
    SelectedFiles.selected = [];
  }));

  it('should allow files to be specified by UUID', inject(function(SelectedFiles) {
    SelectedFiles.add(test_item_1);
    expect(SelectedFiles.selected.length).toEqual(1);
  }));

  it('should allow files to be removed by UUID', inject(function(SelectedFiles) {
    SelectedFiles.add(test_item_1);
    expect(SelectedFiles.selected.length).toEqual(1);
    SelectedFiles.remove('054a0f2c-79bb-4051-b82b-4b0f14564811');
    expect(SelectedFiles.selected.length).toEqual(0);
  }));

  it('should allow files to be removed selectively', inject(function(SelectedFiles) {
    SelectedFiles.add(test_item_1);
    SelectedFiles.add(test_item_2);
    SelectedFiles.remove('054a0f2c-79bb-4051-b82b-4b0f14564811');
    expect(SelectedFiles.selected.length).toEqual(1);
    expect(SelectedFiles.selected[0].text).toEqual('garnet.jpg');
  }));

  it('should be able to return a list of IDs', inject(function(SelectedFiles) {
      expect(SelectedFiles.list_ids().length).toEqual(0);
      SelectedFiles.add(test_item_3);
      expect(SelectedFiles.list_ids()).toEqual(['3400c608-4dbf-4eeb-af22-7fb4ca6a5de6']);
    }));

  it('should be able to retrieve a file by ID', inject(function(SelectedFiles) {
    SelectedFiles.add(test_item_1);
    SelectedFiles.add(test_item_2);
    expect(SelectedFiles.get('939110fa-8c73-4531-8aa0-aa28e90ca108').text).toEqual('garnet.jpg');
  }));

  it('should return undefined when retrieving a file via an ID that does not exist', inject(function(SelectedFiles) {
    expect(SelectedFiles.get('nosuchfile')).toBeUndefined();
  }));
});
