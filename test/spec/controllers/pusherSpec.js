/*jshint unused: vars */
define(['angular', 'angular-mocks', 'app'], function(angular, mocks, app) {
  'use strict';

  describe('Controller: PusherCtrl', function () {

    // load the controller's module
    beforeEach(module('bannerAppApp.controllers.PusherCtrl'));

    var PusherCtrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      PusherCtrl = $controller('PusherCtrl', {
        $scope: scope
      });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
      expect(scope.awesomeThings.length).toBe(3);
    });
  });
});
