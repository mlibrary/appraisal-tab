'use strict';

describe('Facet', function() {
  beforeEach(module('facetService'));

  it('should allow new facets to be defined by name', inject(function(Facet) {
    expect(Facet.get('foo')).toBe(undefined);
    Facet.add('foo', 'bar');
    expect(Facet.get('foo')).toEqual(['bar']);
  }));

  it('should allow a specific facet to be removed', inject(function(Facet) {
    Facet.add('removeOne', '1');
    Facet.add('removeOne', '2');
    expect(Facet.get('removeOne').length).toBe(2);
    Facet.remove('removeOne', '1');
    expect(Facet.get('removeOne').length).toBe(1);
  }));

  it('should remove every facet if no facet is specified', inject(function(Facet) {
    Facet.add('removeAll', '1');
    Facet.add('removeAll', '2');
    expect(Facet.get('removeAll').length).toBe(2);
    Facet.remove('removeAll');
    expect(Facet.get('removeAll')).toBe(undefined);
  }));

  it('should allow all facets to be removed', inject(function(Facet) {
    Facet.add('clearOne', '1');
    Facet.add('clearTwo', '1');
    expect(Facet.get('clearOne').length).toBe(1);
    expect(Facet.get('clearTwo').length).toBe(1);
    Facet.clear();
    expect(Facet.get('clearOne')).toBe(undefined);
    expect(Facet.get('clearTwo')).toBe(undefined);
  }));

  it('should allow facets to be defined as strings to perform exact matches', inject(function(Facet) {
    Facet.add('puid', 'fmt/256');
    expect(Facet.filter([{'puid': 'fmt/256'}, {'puid': 'fmt/128'}, {'puid': 'fmt/2560'}])).toEqual([{'puid': 'fmt/256'}]);
  }));

  it('should allow facets to be defined as regular expressions to perform fuzzy matches', inject(function(Facet) {
    Facet.add('filename', /\.jpg$/);
    expect(Facet.filter([{'filename': '1.png'}, {'filename': '2.jpg'}])).toEqual([{'filename': '2.jpg'}]);
  }));

  it('should allow facets to be defined as functions to perform custom matches', inject(function(Facet) {
    Facet.add('date', function(value) {
      var start = value.split(':')[0];
      return Date.parse(start) > Date.parse('1970');
    });
    expect(Facet.filter([{'date': '1950:1999'}, {'date': '1975:1980'}])).toEqual([{'date': '1975:1980'}]);
  }));

  it('should return a unique ID for each newly-added value', inject(function(Facet) {
    var id1 = Facet.add('id', '1');
    var id2 = Facet.add('id', '2');
    expect(id1).toNotBe(undefined);
    expect(id1).toNotEqual(id2);
  }));

  it('should allow a facet to be fetched by ID', inject(function(Facet) {
    var id = Facet.add('get_id', '1');
    Facet.add('get_id', '2');
    expect(Facet.get_by_id('get_id', id)).toEqual('1');
  }));

  it('should allow a facet to be removed by ID', inject(function(Facet) {
    var id = Facet.add('remove_id', '1');
    Facet.add('remove_id', '2');
    expect(Facet.get('remove_id').length).toEqual(2);
    Facet.remove_by_id('remove_id', id);
    expect(Facet.get('remove_id').length).toEqual(1);
  }));
});
