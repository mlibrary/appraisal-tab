'use strict';

describe("Transfer", function() {
  beforeEach(module("transferService"));

  it("should return a JSON array of objects when fetching transfer backlog records", inject(function(Transfer) {
    var objects = Transfer.getList();
    expect(objects.length).toBeGreaterThan(0);
  }));
});
