'use strict';

describe('SelectedFiles', function() {
  beforeEach(module('selectedFilesService'));
  beforeEach(angular.mock.inject(function(_$httpBackend_) {
    _$httpBackend_.when('GET', '/file/054a0f2c-79bb-4051-b82b-4b0f14564811').respond({
      'id': '054a0f2c-79bb-4051-b82b-4b0f14564811',
      'text': 'lion.svg',
    });
    _$httpBackend_.when('GET', '/file/939110fa-8c73-4531-8aa0-aa28e90ca108').respond({
      'id': '939110fa-8c73-4531-8aa0-aa28e90ca108',
      'text': 'garnet.jpg',
    });
    _$httpBackend_.when('GET', '/file/3400c608-4dbf-4eeb-af22-7fb4ca6a5de6').respond({
      'id': '3400c608-4dbf-4eeb-af22-7fb4ca6a5de6',
      'text': 'amethyst.tif',
    });
  }));
  beforeEach(angular.mock.inject(function(SelectedFiles) {
    SelectedFiles.selected = [];
  }));

  it('should allow files to be specified by UUID', inject(function(_$httpBackend_, SelectedFiles) {
    SelectedFiles.add('054a0f2c-79bb-4051-b82b-4b0f14564811');
    _$httpBackend_.flush();
    expect(SelectedFiles.selected.length).toEqual(1);
  }));

  it('should allow files to be removed by UUID', inject(function(_$httpBackend_, SelectedFiles) {
    SelectedFiles.add('054a0f2c-79bb-4051-b82b-4b0f14564811');
    _$httpBackend_.flush();
    expect(SelectedFiles.selected.length).toEqual(1);
    SelectedFiles.remove('054a0f2c-79bb-4051-b82b-4b0f14564811');
    expect(SelectedFiles.selected.length).toEqual(0);
  }));

  it('should allow files to be removed selectively', inject(function(_$httpBackend_, SelectedFiles) {
    SelectedFiles.add('054a0f2c-79bb-4051-b82b-4b0f14564811');
    _$httpBackend_.flush();
    SelectedFiles.add('939110fa-8c73-4531-8aa0-aa28e90ca108');
    _$httpBackend_.flush();
    SelectedFiles.remove('054a0f2c-79bb-4051-b82b-4b0f14564811');
    expect(SelectedFiles.selected.length).toEqual(1);
    expect(SelectedFiles.selected[0].text).toEqual('garnet.jpg');
  }));

  it('should be able to return a list of IDs', inject(function(_$httpBackend_, SelectedFiles) {
      expect(SelectedFiles.list_ids().length).toEqual(0);
      SelectedFiles.add('3400c608-4dbf-4eeb-af22-7fb4ca6a5de6');
      _$httpBackend_.flush();
      expect(SelectedFiles.list_ids()).toEqual(['3400c608-4dbf-4eeb-af22-7fb4ca6a5de6']);
    }));
});
