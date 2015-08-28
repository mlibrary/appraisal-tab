'use strict';

describe('SipArrange', function() {
  beforeEach(module('sipArrangeService'));
  beforeEach(angular.mock.inject(function(_$httpBackend_) {
    _$httpBackend_.when('POST', '/filesystem/create_directory_within_arrange', 'path=bmV3X3BhdGg%3D').respond({'success': true});
    _$httpBackend_.when('GET', '/filesystem/contents/arrange?path=').respond({
      'entries': [
        'VGVzdA==',
      ],
      'directories': [
        'VGVzdA==',
      ],
      'properties': [],
    });
    _$httpBackend_.when('GET', '/filesystem/contents/arrange?path=L2FycmFuZ2UvY2hpbGQv').respond({
      'entries': [],
      'directories': [],
      'properties': [],
    });
    _$httpBackend_.when('POST', '/filesystem/move_within_arrange', 'filepath=c291cmNl&destination=ZGVzdGluYXRpb24%3D').respond({
      'message': 'SIP files successfully moved.',
    });
    _$httpBackend_.when('POST', '/filesystem/delete/arrange', 'filepath=dGFyZ2V0').respond({
      'message': 'Delete successful.',
    });
    _$httpBackend_.when('POST', '/filesystem/copy_to_arrange', 'filepath=c291cmNl&destination=ZGVzdGluYXRpb24%3D').respond({
      'message': 'Files added to the SIP.',
    });
    _$httpBackend_.when('POST', '/filesystem/copy_from_arrange', 'filepath=dGFyZ2V0').respond({
      'message': 'SIP created.',
    });
  }));

  it('should be able to create SIP arrange directories', inject(function(_$httpBackend_, SipArrange) {
    SipArrange.create_directory('new_path').then(function(response) {
      expect(response.success).toBe(true);
    });
    _$httpBackend_.flush();
  }));

  it('should be able to list arrange contents', inject(function(_$httpBackend_, SipArrange) {
    SipArrange.list_contents().then(function(response) {
      expect(response.entries).toEqual(['Test']);
      expect(response.directories).toEqual(['Test']);
      expect(response.properties).toEqual([]);
    });
    _$httpBackend_.flush();
  }));

  it('should be able to list arrange contents within a given directory', inject(function(_$httpBackend_, SipArrange) {
    SipArrange.list_contents('/arrange/child/').then(function(response) {
      expect(response.entries).toEqual([]);
      expect(response.directories).toEqual([]);
      expect(response.properties).toEqual([]);
    });
    _$httpBackend_.flush();
  }));

  it('should be able to move contents within arrange', inject(function(_$httpBackend_, SipArrange) {
    SipArrange.move('source', 'destination').then(function(response) {
      expect(response.message).toEqual('SIP files successfully moved.');
    });
    _$httpBackend_.flush();
  }));

  it('should be able to delete contents within arrange', inject(function(_$httpBackend_, SipArrange) {
    SipArrange.remove('target').then(function(response) {
      expect(response.message).toEqual('Delete successful.');
    });
    _$httpBackend_.flush();
  }));

  it('should be able to add files to a SIP', inject(function(_$httpBackend_, SipArrange) {
    SipArrange.copy_to_arrange('source', 'destination').then(function(response) {
      expect(response.message).toEqual('Files added to the SIP.');
    });
    _$httpBackend_.flush();
  }));

  it('should be able to start a SIP', inject(function(_$httpBackend_, SipArrange) {
    SipArrange.start_sip('target').then(function(response) {
      expect(response.message).toEqual('SIP created.');
    });
    _$httpBackend_.flush();
  }));
});
