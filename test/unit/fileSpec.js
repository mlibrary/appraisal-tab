'use strict';

describe('File', function() {
  beforeEach(module('fileService'));
  beforeEach(angular.mock.inject(function(_$httpBackend_) {
    _$httpBackend_.when('GET', '/file/054a0f2c-79bb-4051-b82b-4b0f14564811').respond({'id': '054a0f2c-79bb-4051-b82b-4b0f14564811', 'parent': '0e3bd878-069d-49e2-b270-46b0b40cba5b', 'text': 'lion.svg', 'icon': 'file', 'puid': 'fmt/91', 'size': '5'});
    _$httpBackend_.when('GET', '/transfer_data/cf02698a-3185-45b6-bdaa-af484d5ede5b').respond({
      'ppi': [
        {
          'offset': '0x0100',
          'content': 'something',
          'context': 'This record contains something',
        },
      ],
    });
  }));

  it('should be able to fetch a file given its UUID', inject(function(_$httpBackend_, File) {
    File.get('054a0f2c-79bb-4051-b82b-4b0f14564811').then(function(file) {
        expect(file.id).toEqual('054a0f2c-79bb-4051-b82b-4b0f14564811');
    });
    _$httpBackend_.flush();
  }));

  it('should be able to fetch Bulk Extractor logs given a file UUID', inject(function(_$httpBackend_, File) {
    File.bulk_extractor_info('cf02698a-3185-45b6-bdaa-af484d5ede5b').then(function(file) {
      expect(file.ppi.length).toEqual(1);
      expect(file.ppi[0].offset).toEqual('0x0100');
    });
  }));
});
