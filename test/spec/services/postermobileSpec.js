/*jshint unused: vars */
define(['angular', 'angular-mocks', 'app'], function(angular, mocks, app) {
  'use strict';

  describe('Service: Postermobile', function () {

    // load the service's module
    beforeEach(module('bannerAppApp.services.Postermobile'));

    // instantiate service
    var Postermobile;
    beforeEach(inject(function (_Postermobile_) {
      Postermobile = _Postermobile_;
    }));

    it('should do something', function () {
      expect(!!Postermobile).toBe(true);
    });

  });
});
