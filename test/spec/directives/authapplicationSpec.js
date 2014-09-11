/*jshint unused: vars */
define(['angular', 'angular-mocks', 'app'], function(angular, mocks, app) {
  'use strict';

  describe('Directive: AuthApplication', function () {

    // load the directive's module
    beforeEach(module('bannerAppApp.directives.Authapplication'));

    var element,
      scope;

    beforeEach(inject(function ($rootScope) {
      scope = $rootScope.$new();
    }));

    it('should make hidden element visible', inject(function ($compile) {
      element = angular.element('<-auth-application></-auth-application>');
      element = $compile(element)(scope);
      expect(element.text()).toBe('this is the AuthApplication directive');
    }));
  });
});
