define(['angular'], function (angular) {
  'use strict';

  angular.module('bannerAppApp.filters.Comatonewline', [])
  	.filter('comaToNewLine', function () {
      	return function(input) {
			return input.replace(/,/g, '<br>');
		};
  	});
});
