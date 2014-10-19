define(['angular', 'angular-resource'], function (angular) {
  'use strict';

  angular.module('bannerAppApp.services.AuthResource', ['ngResource'])
	.service('authResource', ['$http', '$resource', '$cookieStore', '$log', '$rootScope', 'APIURL', 'APP', 
		function authResource($http, $resource, $cookieStore, $log, $rootScope, APIURL, APP) {
		// AngularJS will instantiate a singleton by calling "new" on this function
		return {
			authentifiedRequest: function(method, url, data, okCallback, errCallback){
				var oauth = $cookieStore.get('oauth');
				var headers = {};

				// set default header content-type for this method
				if($.inArray(angular.uppercase(method), ['POST', 'PUT']) >= 0){
					headers['Content-Type'] = 'application/x-www-form-urlencoded';
				}

				// if has Oauth set Header Authorization
				if( oauth ) {
					headers['Authorization'] = oauth['token_type'] + ' ' + oauth['access_token'];
				} 

				// Login & Refresh Token
				// force Header Authorization Basic App
				// force Header Content-Type is application/json
				// set data grant_type
				if(/login/.test(url)) {
					headers['Content-Type']  = 'application/json';
					headers['Authorization'] = 'Basic ' + btoa(APP.ID+':'+APP.SECRET);
					// get access token
					if( data ) {
						data['grant_type'] = 'password';
					} 
					// create new data to refresh token
					else if(!data && oauth) {
						var data = {
							'grant_type'   : 'refresh_token',
							'refresh_token': oauth['refresh_token'],
							'scope'		   : oauth['scope']
						};
					}
				}

	            $http({
	                method : method,
	                url    : APIURL + url,
	                data   : data,
	                headers: headers
	            }).success(okCallback).error(errCallback);
	        }
		}
	}])
	.service('authUser', ['$q', '$rootScope', '$log', '$http', 'authResource', 'APIURL', 'APP', function authUser($q, $rootScope, $log, $http, authResource, APIURL, APP){
		// AngularJS will instantiate a singleton by calling "new" on this function
		return {
			ping: function() {
				var deferred = $q.defer();
				$http.get(APIURL + '/auth/ping')
					.success(function(response){
						deferred.resolve(response);
					})
					.error(function(err, status){
						$log.debug('[authUser:ping] error:', err, status);
	                    // set message authentication error 
	                    $rootScope.authError = {
	                        statusCode   : status,
	                        statusMessage: status == 400 ? 'Bad Request' : null,
	                        data  : err
	                    };
						deferred.reject('Unable to send ping : ' + err);
					});
				return deferred.promise;
			},
			me: function() {
				var deferred = $q.defer();
				$http.get(APIURL + '/auth/me')
					.success(function(response){
						deferred.resolve(response);
					})
					.error(function(err, status){
						$log.debug('[authUser:me] error:', err, status);
	                    // set message authentication error 
	                    $rootScope.authError = {
	                        statusCode   : status,
	                        statusMessage: status == 400 ? 'Bad Request' : null,
	                        data: err
	                    };
						deferred.reject('Unable to get me : ' + err);
					});
				return deferred.promise;
			},
			login: function(data) {
				var deferred = $q.defer();

				// add data grant type
				angular.extend(data, {
					'grant_type':'password'
				});

				// set headers Authorization Basic
				var headers = {
					'Content-Type' : 'application/json',
					'Authorization': 'Basic ' + btoa(APP.ID+':'+APP.SECRET)
				};
				$http.post(APIURL + '/auth/login', data, {headers: headers})
					.success(function(response){
						deferred.resolve(response);
					})
					.error(function(err, status){
						$log.debug('[authUser:login] error:', err, status);
	                    // set message authentication error 
	                    $rootScope.authError = {
	                        statusCode   : status,
	                        statusMessage: status == 400 ? 'Bad Request' : null,
	                        data: err
	                    };
						deferred.reject('Unable to login : ' + err);
					});
				return deferred.promise;
			},
			refresh: function(token) {
				var deferred = $q.defer();

				$log.debug('[token]', token);
				var data = {
					'grant_type'   : 'refresh_token',
					'refresh_token': token['refresh_token'],
					'scope'		   : token['scope']
				}
				// set headers Authorization Basic
				var headers = {
					'Content-Type' : 'application/json',
					'Authorization': 'Basic ' + btoa(APP.ID+':'+APP.SECRET)
				};
				$http.post(APIURL + '/auth/login', data, {headers: headers})
					.success(function(response){
						deferred.resolve(response);
					})
					.error(function(err, status){
						$log.debug('[authUser:refresh] error:', err, status);
	                    // set message authentication error 
	                    $rootScope.authError = {
	                        statusCode   : status,
	                        statusMessage: status == 400 ? 'Bad Request' : null,
	                        data: err
	                    };
						deferred.reject('Unable to refresh_token : ' + err);
					});
				return deferred.promise;
			}
		}
	}])
	.service('pushMessage', ['authResource', '$q', function pushMessage(authResource, $q) {
		// AngularJS will instantiate a singleton by calling "new" on this function
		return function( data ){
			var deferred = $q.defer();
			authResource.authentifiedRequest('POST', '/pusher/message', data, function(response){
				deferred.resolve(response);
			}, function(err){
				deferred.reject('Unable to send message : ' + err);
			});
			return deferred.promise;
		}
	}])
	.service('creatorID', ['authResource', '$q', function creatorID(authResource, $q) {
		// AngularJS will instantiate a singleton by calling "new" on this function
		return function(){
			var deferred = $q.defer();
			authResource.authentifiedRequest('GET', '/ID', {}, function(data){
				deferred.resolve(data);
			}, function(err){
				deferred.reject('Unable to get creator ID : ' + err);
			});
			return deferred.promise;
		}
	}]);
});
