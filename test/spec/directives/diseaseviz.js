'use strict';

describe('Directive: diseaseviz', function () {

  // load the directive's module
  beforeEach(module('yeomanD3App'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<diseaseviz></diseaseviz>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the diseaseviz directive');
  }));
});
