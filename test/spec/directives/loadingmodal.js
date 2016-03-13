'use strict';

describe('Directive: loadingmodal', function () {

  // load the directive's module
  beforeEach(module('yeomanD3App'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<loadingmodal></loadingmodal>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the loadingmodal directive');
  }));
});
