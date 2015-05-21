'use strict';

describe('AggregationFilters', function() {
  var puid_data;

  var fmt_91_records = [{
    'id': '054a0f2c-79bb-4051-b82b-4b0f14564811',
    'text': 'lion.svg',
    'puid': 'fmt/91',
    'size': '5',
  }, {
    'id': '7f70d25c-be05-4950-a384-dac159926960',
    'text': 'rose_quartz.svg',
    'puid': 'fmt/91',
    'size': '2',
  }];
  var fmt_11_records = [{
    'id': '4e941898-3914-4add-b1f6-476580862069',
    'text': 'pearl.png',
    'puid': 'fmt/11',
    'size': '13',
  }];

  beforeEach(function() {
    module('aggregationFilters');

    inject(function($injector) {
      puid_data = $injector.get('$filter')('puid_data');
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
});
