define(['angular', 'angular-resource'], function (angular) {
  'use strict';

  angular.module('bannerAppApp.services.AuthResource', ['ngResource'])
	.service('authResource', ['$http', '$resource', '$log', '$rootScope', 'API', 
		function authResource($http, $resource, $log, $rootScope, API) {
		// AngularJS will instantiate a singleton by calling "new" on this function
		return {
			authentifiedRequest: function(method, url, data, okCallback, errCallback){
	            $http({
	                method : method,
	                url    : API.URL + url,
	                data   : data
	            }).success(okCallback).error(errCallback);
	        }
		}
	}])
	.service('authUser', ['$q', '$rootScope', '$log', '$http', 'Jwthelper', 'authService', 'API', 
		function authUser($q, $rootScope, $log, $http, Jwthelper, authService, API){
		// AngularJS will instantiate a singleton by calling "new" on this function
		return {
			isJwt: function() {
				return API.GRANT === 'jwt';
			},
			hasUser: function() {
				$rootScope.user && localStorage.getItem('user');
			},
			ping: function() {
				var deferred = $q.defer();

				$http.get(API.URL + '/auth/ping')
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
				$http.get(API.URL + '/auth/me')
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
			login: function(params) {
				var deferred = $q.defer();
				// get token
				$http.post(API.URL + '/auth/login', params.data, params.config)
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

				$log.info('[refresh_token] token is expired..');

				if(!token) {
					token = angular.fromJson(localStorage.getItem('token'));
				}

				console.log('refresh_token', angular.isUndefined(token['refresh_token']));

				if(this.isJwt() || angular.isUndefined(token['refresh_token'])) {
					return this.oauthJWT(true);
				}

				// set data refresh token
				var data = {
					'grant_type'   : 'refresh_token',
					'refresh_token': token['refresh_token'],
					'scope'		   : token['scope']
				}
				// set headers Authorization Basic
				var headers = {
					'Content-Type' : 'application/json',
					'Authorization': 'Basic ' + btoa(API.CLIENT.ID+':'+API.CLIENT.SECRET)
				};
				$http.post(API.URL + '/auth/login', data, {headers: headers})
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
			},
			oauthUser: function(data) {
				var self = this;

				angular.extend(data, {'grant_type':'password'});

				var params = {
					data: data,
					config: {
						headers: {
							'Content-Type' : 'application/json',
							'Authorization': 'Basic ' + btoa(API.CLIENT.ID+':'+API.CLIENT.SECRET)
						}
					}
				};

				return self.login(params);
			},
			oauthJWT: function(refresh) {
				var self = this;

				$log.info('[oauthJWT] ' + (refresh ? 'refresh' : 'get') + ' token...');

				// generate signed JWT
				var jwt = Jwthelper.generateSignedJWT(API);
				var params = {
					data: {
						'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer',
						'assertion' : jwt
					},
					config: {
						headers: {
							'Content-Type' : 'application/json',
							'Authorization': 'Basic ' + btoa('admin:admin') // not using header Authorization for jwt

						}
					}
				};

				return self.login(params).then(function(token){
					localStorage.setItem('token', angular.toJson(token));

                    if(refresh === true) {
                    	return token;
                    }

					$log.info('[oauthJWT] get user info...');

					return self.me().then(function(user){
                        // set user n token cookie
                        $rootScope.user = user;
                        // serialize obj json
                        localStorage.setItem('user', angular.toJson(user));
						return token;
                    });
				});
			},
			isTokenExpired: function(token) {
				if(!token) return false;

				var isExpired = Jwthelper.isTokenExpired(token['access_token']);
				if( isExpired ) $log.error('[isTokenExpired] token is expired..');
				return isExpired;
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
