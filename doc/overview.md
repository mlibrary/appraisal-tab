Getting started
---------------

This application uses npm and Bower to manage its dependencies; npm is used for commandline tools and libraries, and Bower is used to manage
When first installing or updating the application, run `npm install` in the terminal to install all dependencies.

Application architecture
------------------------

### Structure

This application is structured according to the guidelines in the [community Angular style-guide](https://github.com/johnpapa/angular-styleguide#application-structure).

### Separation of concerns

Each individual feature of the application should be developed as a separate scope with its own controller.
Scopes should never be nested in partials.
Each controller should contain as little logic as possible; controllers are primarily used to assign scope variables and call methods on other objects.
The majority of the application's logic is intended to be held in directives, filters, and services.

### Sharing data

Since each controller scope is separate, data can't be directly shared between controllers.
Instead, data sharing occurs using Angular *service* objects.
Each service object is a singleton object which can have both instance methods and properties; bindable attributes of a service should be assigned to properties, while methods should only be used for getters whose values do not need to be watched for changes.

This example, based on the transfer tree/report pane workflow, explains how it works.

One controller, the TreeController, contains a transfer tree UI that allows the user to select elements.
Selected elements are then filtered and displayed within the scope of another controller, ReportController.
Since the two controllers are completely separate scopes, we need an intermediary to share data between the two of them; to do that, we create a `SelectedFiles` service which has a method to add and remove entries, and a bindable property called "selected" which simply lists all selected files.

First, in the TreeController, we inject the SelectedFiles service, and add or remove objects from it every time we've detected a change to the user's selection.

```js
angular.module('treeController', []).controller('TreeController', function(Tree, SelectedFiles) {
  Tree.onClick(function(element) {
    if (element.isSelected) {
      SelectedFiles.add(element.id);
    } else {
      SelectedFiles.remove(element.id);
    }
  });
});
```

Then, in ReportController, we assign the service object to a scope variable.
We assign the service object itself and not its property so that the digest loop can detect changes to the property.

```js
angular.module('reportController', []).controller('ReportController', function($scope, SelectedFiles) {
  $scope.records = SelectedFiles;
});
```

Finally, in the template, we can now iterate over the contents of the `records` scope variable and have those be updated with every change made to `SelectedFiles.selected`:

```html
<div ng-controller='ReportController'>
  <div ng-repeat='record in records.selected'>{{ record }}</div>
</div>
```

Testing
-------

Unit tests are written using the [Jasmine](https://jasmine.github.io/2.3/introduction.html) test framework.
This section will give a high-level overview of this application's tests, but is not meant to replace the Jasmine documentation.

Unit tests can be found in the "tests/unit" directory in the root of the application.
Each distinct feature being tested should be given its own "spec" file; for example, the spec for the "facet" feature is named "facetSpec.js".

### Running tests

Tests can be run inside the root directory of the application by running `npm test`.
By default, tests are run in Chrome; Chrome must be installed to run the tests.

### Structure

Each test file is treated as a *specification* (or spec) of an aspect of the application's functionality; each test is mean to be readable as a specification for how the application should behave.
Each spec is comprised of a `describe` block, which describes an individual feature; that `define` block then contains `it` blocks, which are used to define individual aspects of that feature.
For example, a simple test file could look like this:

```js
describe('MyFeature', function() {
  it('should be able to do this specific thing', function() {
    # test logic goes here
  });
});
```

At the top of each `describe` block, there should be one or more `beforeEach` statements to set up the environment for each test.
At a minimum, it's necessary to load the appropriate module being tested, for example:

```js
beforeEach(module('myFeatureModule'));
```

### Mocking REST calls

Some tests call code which performs asynchronous REST calls; these require extra handling in order to ensure the data is fetched and the test conditions execute before the test function completes.
These REST calls can be mocked using Angular's `_$httpBackend_` feature, which allows specific REST requests to be mocked and responses to be returned at a predictable point of time.

REST calls are mocked in a `beforeEach` function within the `describe` block.
Here's a simple example:

```js
beforeEach(angular.mock.inject(function(_$httpBackend_) {
  _$httpBackend_.when('GET', '/some/url').respond(['some', 'response']);
}));
```

`angular.mock.inject` is used to provide access to the `_$httpBackend_` service.
The `when` method defines a route to intercept, and the `respond` method is used to specify the object to be returned when that route is accessed using the specified HTTP verb.

After mocking the route in a `beforeEach` function, each test that calls one of the mocked routes needs to flush the pending requests to ensure that the tests receive a response before the test method ends.
For example:

```js
it('should be able to fetch a specific file', inject(function(_$httpBackend_, File) {
  File.get('25bb5793-aee9-4303-af99-7bb4ec256bc0').then(function(file) {
    expect(file.id).toEqual('25bb5793-aee9-4303-af99-7bb4ec256bc0');
  });
  _$httpBackend_.flush();
}));

Because the result from calling `File.get` is a *promise*, it's only executed when a response is received from the server - so it probably won't actually be executed before the test completes.
Calling `_$httpBackend_.flush()` ensures that the mocked response is immediately returned, and the promise returned by `File.get` immediately resolves.
