/*jshint unused: vars */
define(['angular', 'angular-mocks', 'app'], function(angular, mocks, app) {
  'use strict';

  describe('Service: Jwthelper', function () {

    // load the service's module
    beforeEach(module('bannerAppApp.services.Jwthelper'));

    // instantiate service
    var Jwthelper;
    beforeEach(inject(function (_Jwthelper_) {
      Jwthelper = _Jwthelper_;
    }));

    it('should do something', function () {
      expect(!!Jwthelper).toBe(true);
    });

  });
});
