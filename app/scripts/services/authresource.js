define(['angular', 'angular-resource'], function (angular) {
  'use strict';

  angular.module('bannerAppApp.services.AuthResource', ['ngResource'])
	.service('authResource', ['$http', '$resource', '$cookieStore', function authResource($http, $resource, $cookieStore) {
		// AngularJS will instantiate a singleton by calling "new" on this function
		this.url = null;
		return {
			authentifiedRequest: function(method, url, data, okCallback, errCallback){
				var headers = {'X-Auth-Token' : $cookieStore.get('token')};
				// var headers = {'X-Auth-Token': 'basic ' + btoa('admin:admin')};

				if($.inArray(angular.uppercase(method), ['POST', 'PUT']) >= 0){
					headers['Content-Type'] = 'application/x-www-form-urlencoded';
				}

	            $http({
	                method : method,
	                url    : url,
	                data   : data,
	                headers: headers
	            }).success(okCallback).error(errCallback);
	        },
			request: function(url){
				return $resource(url, {}, {
					query : {
						method: 'GET',
						isArray: true
					},
					get : {
						method: 'GET'
					},
					update : {
						method: 'PUT'
					},
					remove: {
						method: 'DELETE'
					}
				});
			}
		}
	}]);
});
