/*jshint unused: vars */
define(['angular', 'angular-mocks', 'app'], function(angular, mocks, app) {
  'use strict';

  describe('Service: Banner', function () {

    // load the service's module
    beforeEach(module('bannerAppApp.services.Banner'));

    // instantiate service
    var Banner;
    beforeEach(inject(function (_Banner_) {
      Banner = _Banner_;
    }));

    it('should do something', function () {
      expect(!!Banner).toBe(true);
    });

  });
});
