'use strict';

describe("Transfer", function() {
  beforeEach(module("appraisalTab"));

  it("should return a JSON array of objects when fetching transfer backlog records", inject(function(Transfer) {
    var objects = Transfer.objects();
    expect(objects.length).toBeGreaterThan(0);
  }));
});
