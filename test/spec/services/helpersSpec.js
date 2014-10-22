/*jshint unused: vars */
define(['angular', 'angular-mocks', 'app'], function(angular, mocks, app) {
  'use strict';

  describe('Service: Helpers', function () {

    // load the service's module
    beforeEach(module('bannerAppApp.services.Helpers'));

    // instantiate service
    var Helpers;
    beforeEach(inject(function (_Helpers_) {
      Helpers = _Helpers_;
    }));

    it('should do something', function () {
      expect(!!Helpers).toBe(true);
    });

  });
});
