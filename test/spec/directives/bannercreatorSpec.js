/*jshint unused: vars */
define(['angular', 'angular-mocks', 'app'], function(angular, mocks, app) {
  'use strict';

  describe('Directive: bannerCreator', function () {

    // load the directive's module
    beforeEach(module('bannerAppApp.directives.Bannercreator'));

    var element,
      scope;

    beforeEach(inject(function ($rootScope) {
      scope = $rootScope.$new();
    }));

    it('should make hidden element visible', inject(function ($compile) {
      element = angular.element('<banner-creator></banner-creator>');
      element = $compile(element)(scope);
      expect(element.text()).toBe('this is the bannerCreator directive');
    }));
  });
});
