/*jshint unused: vars */
define(['angular', 'angular-mocks', 'app'], function(angular, mocks, app) {
  'use strict';

  describe('Controller: Fabric2Ctrl', function () {

    // load the controller's module
    beforeEach(module('bannerAppApp.controllers.Fabric2Ctrl'));

    var Fabric2Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      Fabric2Ctrl = $controller('Fabric2Ctrl', {
        $scope: scope
      });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
      expect(scope.awesomeThings.length).toBe(3);
    });
  });
});
