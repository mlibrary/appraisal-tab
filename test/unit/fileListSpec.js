'use strict';

describe('FileList', function() {
  beforeEach(module('fileListService'));
  beforeEach(inject(function(FileList) {
    FileList.files = [];
  }));

  var test_item_1 = {
    'id': 'edf3a698-31f8-422b-870c-669ab5c5a74f',
    'text': 'sardonyx.rb',
  };

  var test_item_2 = {
    'id': '91e90942-adde-4fd8-b4c4-d696bfd0a944',
    'text': 'sugilite.py',
  };

  it('should be able to fetch files from the list by ID', inject(function(FileList) {
    FileList.files.push(test_item_1);
    FileList.files.push(test_item_2);
    expect(FileList.get('edf3a698-31f8-422b-870c-669ab5c5a74f')).toEqual(test_item_1);
    expect(FileList.get('91e90942-adde-4fd8-b4c4-d696bfd0a944')).toEqual(test_item_2);
  }));

  it('should be able to remove files from the list by ID', inject(function(FileList) {
    FileList.files.push(test_item_1);
    FileList.files.push(test_item_2);
    expect(FileList.files.length).toEqual(2);
    FileList.remove('edf3a698-31f8-422b-870c-669ab5c5a74f');
    expect(FileList.files.length).toEqual(1);
  }));

  it('should be able to remove all files from the list', inject(function(FileList) {
    FileList.files.push(test_item_1);
    FileList.files.push(test_item_2);
    expect(FileList.files.length).toEqual(2);
    FileList.clear();
    expect(FileList.files.length).toEqual(0);
  }));
});
