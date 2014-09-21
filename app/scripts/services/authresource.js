define(['angular', 'angular-resource'], function (angular) {
  'use strict';

  angular.module('bannerAppApp.services.AuthResource', ['ngResource'])
	.service('authResource', ['$http', '$timeout', '$resource', '$cookies', '$cookieStore', 'BASEURL', 
		function authResource($http, $timeout, $resource, $cookies, $cookieStore, BASEURL) {
		// AngularJS will instantiate a singleton by calling "new" on this function
		var self = this;
		return {
			authentifiedRequest: function(method, url, data, okCallback, errCallback){
				var user = $cookieStore.get('user');

				var headers = {};
				if( user ) headers = {'X-Auth-Token' : user.token };
				if($.inArray(angular.uppercase(method), ['POST', 'PUT']) >= 0){
					headers['Content-Type'] = 'application/x-www-form-urlencoded';
				}

	            $http({
	                method : method,
	                url    : BASEURL + url,
	                data   : data,
	                headers: headers,
	                withCredentials: true
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
	}])
	.service('creatorID', ['authResource', '$q', function creatorID(authResource, $q) {
		// AngularJS will instantiate a singleton by calling "new" on this function
		return function(){
			var deferred = $q.defer();
			authResource.authentifiedRequest('GET', '/api/ID', {}, function(data){
				deferred.resolve(data);
			}, function(err){
				deferred.reject('Unable to get creator ID : ' + err);
			});
			return deferred.promise;
		}
	}])
	.service('pushMessage', ['authResource', '$q', function pushMessage(authResource, $q) {
		// AngularJS will instantiate a singleton by calling "new" on this function
		return function( data ){
			var deferred = $q.defer();
			authResource.authentifiedRequest('POST', '/api/pusher/message', data, function(response){
				deferred.resolve(response);
			}, function(err){
				deferred.reject('Unable to send message : ' + err);
			});
			return deferred.promise;
		}
	}]);
});
