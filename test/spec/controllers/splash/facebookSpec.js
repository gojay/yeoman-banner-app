/*jshint unused: vars */
define(['angular', 'angular-mocks', 'app'], function(angular, mocks, app) {
  'use strict';

  describe('Controller: SplashFacebookCtrl', function () {

    // load the controller's module
    beforeEach(module('bannerAppApp.controllers.SplashFacebookCtrl'));

    var SplashFacebookCtrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      SplashFacebookCtrl = $controller('SplashFacebookCtrl', {
        $scope: scope
      });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
      expect(scope.awesomeThings.length).toBe(3);
    });
  });
});
