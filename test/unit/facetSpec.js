'use strict';

describe("Facet", function() {
  beforeEach(module("appraisalTab"));

  it("should allow new facets to be defined by name", inject(function(Facet) {
    expect(Facet.get("foo")).toBe(undefined);
    Facet.add("foo", "bar");
    expect(Facet.get("foo")).toBe(["bar"]);
  }));

  it("should allow a specific facet to be removed", inject(function(Facet) {
    Facet.add("removeOne", "1");
    Facet.add("removeOne", "2");
    expect(Facet.get("removeOne").length).toBe(2);
    Facet.remove("removeOne", "1");
    expect(Facet.get("removeOne").length).toBe(1);
  }));

  it("should remove every facet if no facet is specified", inject(function(Facet) {
    Facet.add("removeAll", "1");
    Facet.add("removeAll", "2");
    expect(Facet.get("removeAll").length).toBe(2);
    Facet.remove("removeAll");
    expect(Facet.get("removeAll").length).toBe(0);
  }));

  it("should allow all facets to be removed", inject(function(Facet) {
    Facet.add("clearOne", "1");
    Facet.add("clearTwo", "1");
    expect(Facet.get("clearOne").length).toBe(1);
    expect(Facet.get("clearTwo").length).toBe(1);
    Facet.clear();
    expect(Facet.get("clearOne").length).toBe(0);
    expect(Facet.get("clearTwo").length).toBe(0);
  }));

  it("should allow facets to be defined as strings to perform exact matches", inject(function(Facet) {
    Facet.add("puid", "fmt/256");
    expect(Facet.filter([{"puid": "fmt/256"}, {"puid": "fmt/128"}, {"puid": "fmt/2560"}])).toBe([{"puid": "fmt/256"}]);
  }));

  it("should allow facets to be defined as regular expressions to perform fuzzy matches", inject(function(Facet) {
    Facet.add("filename", /\.jpg$/);
    expect(Facet.filter([{"filename": "1.png"}, {"filename": "2.jpg"}])).toBe([{"filename": "2.jpg"}]);
  }));

  it("should allow facets to be defined as functions to perform custom matches", inject(function(Facet) {
    Facet.add("date", function(value) {
      var start = value.split(":")[0];
      return Date.parse(start) > Date.parse("1970");
    });
    expect(Facet.filter([{"date": "1950:1999"}, {"date": "1975:1980"}])).toBe([{"date": "1975:1980"}]);
  }));
});
