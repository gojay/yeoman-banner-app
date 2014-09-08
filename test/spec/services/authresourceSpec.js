/*jshint unused: vars */
define(['angular', 'angular-mocks', 'app'], function(angular, mocks, app) {
  'use strict';

  describe('Service: Authresource', function () {

    // load the service's module
    beforeEach(module('bannerAppApp.services.Authresource'));

    // instantiate service
    var Authresource;
    beforeEach(inject(function (_Authresource_) {
      Authresource = _Authresource_;
    }));

    it('should do something', function () {
      expect(!!Authresource).toBe(true);
    });

  });
});
