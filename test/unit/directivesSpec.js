'use strict';

/* jasmine specs for directives go here */

describe('directives', function() {
  beforeEach(module('myApp.directives'));

  describe('app-version', function() {
    it('should print current version', function() {
      module(function($provide) {
        $provide.value('version', 'TEST_VER');
      });
      inject(function($compile, $rootScope) {
        var element = $compile('<span app-version></span>')($rootScope);
        expect(element.text()).toEqual('TEST_VER');
      });
    });
  });

  describe('my-focus-on', function() {
    var scope, htmlElement;
    var html = '<input type="text" name="myname" my-focus-on="showForm" alt="notFocused" value=""/>'

    beforeEach(inject(function($compile, $rootScope) {
      scope = $rootScope.$new();
      scope.showForm = false;

      var domElement = angular.element(html);
      var linkFn = $compile(domElement);
      htmlElement = linkFn(scope);
    }));

    it('field should get focus when showForm switches to true', inject(function($timeout) {
      expect(htmlElement[0].alt).toEqual('notFocused');

      scope.showForm = true;
      scope.$digest();
      $timeout.flush();

      expect(htmlElement[0].alt).toEqual('focused');
    }));
  });
});
