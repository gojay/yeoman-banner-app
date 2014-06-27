/*jshint unused: vars */
define(['angular', 'angular-mocks', 'app'], function(angular, mocks, app) {
  'use strict';

  describe('Filter: comaToNewLine', function () {

    // load the filter's module
    beforeEach(module('bannerAppApp.filters.Comatonewline'));

    // initialize a new instance of the filter before each test
    var comaToNewLine;
    beforeEach(inject(function ($filter) {
      comaToNewLine = $filter('comaToNewLine');
    }));

    it('should return the input prefixed with "comaToNewLine filter:"', function () {
      var text = 'angularjs';
      expect(comaToNewLine(text)).toBe('comaToNewLine filter: ' + text);
    });

  });
});
