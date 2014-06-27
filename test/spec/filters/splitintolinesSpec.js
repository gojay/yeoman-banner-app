/*jshint unused: vars */
define(['angular', 'angular-mocks', 'app'], function(angular, mocks, app) {
  'use strict';

  describe('Filter: splitIntoLines', function () {

    // load the filter's module
    beforeEach(module('bannerAppApp.filters.Splitintolines'));

    // initialize a new instance of the filter before each test
    var splitIntoLines;
    beforeEach(inject(function ($filter) {
      splitIntoLines = $filter('splitIntoLines');
    }));

    it('should return the input prefixed with "splitIntoLines filter:"', function () {
      var text = 'angularjs';
      expect(splitIntoLines(text)).toBe('splitIntoLines filter: ' + text);
    });

  });
});
