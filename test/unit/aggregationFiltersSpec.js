'use strict';

describe('AggregationFilters', function() {
  var puid_data;
  var find_files;
  var find_transfers;

  var fmt_91_records = [{
    'id': '054a0f2c-79bb-4051-b82b-4b0f14564811',
    'label': 'lion.svg',
    'type': 'file',
    'puid': 'fmt/91',
    'size': '5',
    'bulk_extractor': 'logs.zip',
  }, {
    'id': '7f70d25c-be05-4950-a384-dac159926960',
    'label': 'rose_quartz.svg',
    'type': 'file',
    'puid': 'fmt/91',
    'size': '2',
    'bulk_extractor': 'logs.zip',
  }];
  var fmt_11_records = [{
    'id': '4e941898-3914-4add-b1f6-476580862069',
    'label': 'pearl.png',
    'type': 'file',
    'puid': 'fmt/11',
    'size': '13',
    'bulk_extractor': 'logs.zip',
  }];
  var transfers = [{
    'id': 'fb91bf38-3836-4312-a928-699c564865da',
    'label': 'garnet',
    'type': 'transfer',
    'original_order': '/fixtures/transferdata/fb91bf38-3836-4312-a928-699c564865da/directory_tree.txt',
  }];

  beforeEach(function() {
    module('aggregationFilters');

    inject(function($injector) {
      puid_data = $injector.get('$filter')('puid_data');
      find_files = $injector.get('$filter')('find_files');
      find_transfers = $injector.get('$filter')('find_transfers');
    });
  });

  it('should aggregate data about multiple files with the same format', function() {
    var aggregate_data = puid_data(fmt_91_records);
    expect(aggregate_data.length).toEqual(1);
    expect(aggregate_data[0].puid).toEqual('fmt/91');
    expect(aggregate_data[0].data.size).toEqual(7);
    expect(aggregate_data[0].data.count).toEqual(2);
  });

  it('should produce one entry for each PUID in the source records', function() {
    var records = fmt_91_records.concat(fmt_11_records);
    var aggregate_data = puid_data(records);
    expect(aggregate_data.length).toEqual(2);
    expect(aggregate_data[0].puid).toEqual('fmt/91');
    expect(aggregate_data[0].data.count).toEqual(2);
    expect(aggregate_data[1].puid).toEqual('fmt/11');
    expect(aggregate_data[1].data.count).toEqual(1);
  });

  it('should filter lists of files to contain only files', function() {
    var records = fmt_91_records.concat(fmt_11_records, transfers);
    var filtered_records = find_files(records);
    expect(filtered_records.length).toEqual(3);
    expect(filtered_records[0].label).toEqual('lion.svg');
  });

  it('should filter lists of files to contain only transfers', function() {
    var records = fmt_91_records.concat(fmt_11_records, transfers);
    var filtered_records = find_transfers(records);
    expect(filtered_records.length).toEqual(1);
    expect(filtered_records[0].label).toEqual('garnet');
  });
});
