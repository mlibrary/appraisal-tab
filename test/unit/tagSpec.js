'use strict';

describe('Tag', function() {
  beforeEach(module('tagService'));
  beforeEach(angular.mock.inject(function(Tag) {
    Tag.clear();
  }));

  it('should be able to track tags for a given file', inject(function(Tag) {
    Tag.add('2d3fbf28-0102-4de7-9bd0-77af2808d5f0', 'testtag');
    expect(Tag.get('2d3fbf28-0102-4de7-9bd0-77af2808d5f0')).toEqual(['testtag']);
  }));

  it('should be able to track tags for multiple files', inject(function(Tag) {
    Tag.add_list(['2bd03175-b9a2-4047-a34d-7328000ade9a', '2562f838-67cb-49d0-9b45-4bb4860a2d74'], 'testtag');
    expect(Tag.get('2bd03175-b9a2-4047-a34d-7328000ade9a')).toEqual(['testtag']);
    expect(Tag.get('2562f838-67cb-49d0-9b45-4bb4860a2d74')).toEqual(['testtag']);
  }));

  it('should be able to remove tags for a given file', inject(function(Tag) {
    Tag.add('f2c52912-0297-4f7a-90a7-f7a9323eeb5d', 'testtag');
    expect(Tag.get('f2c52912-0297-4f7a-90a7-f7a9323eeb5d')).toEqual(['testtag']);
    Tag.remove('f2c52912-0297-4f7a-90a7-f7a9323eeb5d', 'testtag');
    expect(Tag.get('f2c52912-0297-4f7a-90a7-f7a9323eeb5d')).toEqual([]);
  }));

  it('should be able to remove all tags for a given file if no tag is specified', inject(function(Tag) {
    Tag.add('f9416832-13df-411a-b0ad-ad994689b760', 'testtag1');
    Tag.add('f9416832-13df-411a-b0ad-ad994689b760', 'testtag2');
    expect(Tag.get('f9416832-13df-411a-b0ad-ad994689b760')).toEqual(['testtag1', 'testtag2']);
    Tag.remove('f9416832-13df-411a-b0ad-ad994689b760');
    expect(Tag.get('f9416832-13df-411a-b0ad-ad994689b760')).toEqual([]);
  }));

  it('should be able to list all files for a given tag', inject(function(Tag) {
    expect(Tag.list('testtag')).toEqual([]);
    Tag.add('87c16fac-01a5-444c-b88a-e1de8cb9500d', 'testtag');
    Tag.add('3661b2ba-4341-45a6-bb74-b41e95eaeb7a', 'testtag');
    expect(Tag.list('testtag')).toEqual(['87c16fac-01a5-444c-b88a-e1de8cb9500d', '3661b2ba-4341-45a6-bb74-b41e95eaeb7a']);
  }));

  it('should publish a flat list of every specified tag', inject(function(Tag) {
    expect(Tag.tags).toEqual([]);
    Tag.add('79009039-e221-42d0-b093-c61357a272ba', 'testtag1');
    Tag.add('bdec60f5-deb5-4d04-a488-96cd5702225e', 'testtag2');
    expect(Tag.tags).toEqual(['testtag1', 'testtag2']);
    Tag.remove('79009039-e221-42d0-b093-c61357a272ba');
    expect(Tag.tags).toEqual(['testtag2']);
  }));
});
