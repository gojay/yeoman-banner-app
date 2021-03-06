/*global angular:true, browser:true */

/**
 * @license HTTP Auth Interceptor Module for AngularJS
 * (c) 2012 Witold Szczerba
 * License: MIT
 */
(function () {
  'use strict';

  angular.module('http-auth-interceptor', ['http-auth-interceptor-buffer'])

  .factory('authService', ['$rootScope','httpBuffer', function($rootScope, httpBuffer) {
    return {
      /**
       * Call this function to indicate that authentication was successfull and trigger a
       * retry of all deferred requests.
       * @param data an optional argument to pass on to $broadcast which may be useful for
       * example if you need to pass through details of the user that was logged in
       */
      loginConfirmed: function(data, configUpdater) {
        var updater = configUpdater || function(config) {return config;};
        $rootScope.$broadcast('event:auth-loginConfirmed', data);
        httpBuffer.retryAll(updater);
      },

      /**
       * Call this function to indicate that authentication should not proceed.
       * All deferred requests will be abandoned or rejected (if reason is provided).
       * @param data an optional argument to pass on to $broadcast.
       * @param reason if provided, the requests are rejected; abandoned otherwise.
       */
      loginCancelled: function(data, reason) {
        httpBuffer.rejectAll(reason);
        $rootScope.$broadcast('event:auth-loginCancelled', data);
      }
    };
  }])

  .provider('authIterceptor', function(){

    this.authHeader = 'Authorization';
    this.tokenGetter = function() { return null; }

    var config = this;

    this.$get = ['$q', '$injector', '$rootScope', 'httpBuffer', function($q, $injector, $rootScope, httpBuffer) {
      return {
        request: function(request) {
          if(request.ignoreAuthModule || /\.html|\.pem/i.test(request.url)) {
            return request;
          }

          request.headers = request.headers || {};

          if(request.headers[config.authHeader]) {
            return request;
          }

          var tokenPromise = $q.when($injector.invoke(config.tokenGetter, this, {
            config:request
          }));

          return tokenPromise.then(function(token) {
            if(token) {
              request.headers[config.authHeader] = token['token_type'] + ' ' + token['access_token'];
            }
            return request;
          });
        },
        responseError: function(rejection) {
          // set error message
          $rootScope.authError = {
              statusCode   : rejection.status,
              statusMessage: rejection.statusText,
              data  : rejection.data
          };
          if (rejection.status === 401 && !rejection.config.ignoreAuthModule) {
            var deferred = $q.defer();
            httpBuffer.append(rejection.config, deferred);
            $rootScope.$broadcast('event:auth-loginRequired', rejection);
            return deferred.promise;
          }
          // otherwise, default behaviour
          return $q.reject(rejection);
        } 
      }
    }];
  })

  .config(['$httpProvider', 'authIterceptorProvider', function($httpProvider, authIterceptorProvider) {
    authIterceptorProvider.tokenGetter = function($http, authUser) {
      // deserialize obj json
      var token = angular.fromJson(localStorage.getItem('token'));
      if(authUser.isTokenExpired(token)) {
        // refresh token
        return authUser.refresh(token).then(function(token){
          // set expires token in standart token
          // token['expires'] = Date.now() + (token['expires_in'] * 1000);
          localStorage.setItem('token', angular.toJson(token));
          return token;
        });
      } else {

        // if grant type is jwt, auto get token
        if(!token && authUser.isJwt()) {
          return authUser.oauthJWT(token);
        }

        return token;
      }
    }
    $httpProvider.interceptors.push('authIterceptor');
  }]);

  /**
   * Private module, a utility, required internally by 'http-auth-interceptor'.
   */
  angular.module('http-auth-interceptor-buffer', [])

  .factory('httpBuffer', ['$injector', function($injector) {
    /** Holds all the requests, so they can be re-requested in future. */
    var buffer = [];

    /** Service initialized later because of circular dependency problem. */
    var $http;

    function retryHttpRequest(config, deferred) {
      function successCallback(response) {
        deferred.resolve(response);
      }
      function errorCallback(response) {
        deferred.reject(response);
      }
      $http = $http || $injector.get('$http');
      $http(config).then(successCallback, errorCallback);
    }

    return {
      /**
       * Appends HTTP request configuration object with deferred response attached to buffer.
       */
      append: function(config, deferred) {
        buffer.push({
          config: config,
          deferred: deferred
        });
      },

      /**
       * Abandon or reject (if reason provided) all the buffered requests.
       */
      rejectAll: function(reason) {
        if (reason) {
          for (var i = 0; i < buffer.length; ++i) {
            buffer[i].deferred.reject(reason);
          }
        }
        buffer = [];
      },

      /**
       * Retries all the buffered requests clears the buffer.
       */
      retryAll: function(updater) {
        for (var i = 0; i < buffer.length; ++i) {
          retryHttpRequest(updater(buffer[i].config), buffer[i].deferred);
        }
        buffer = [];
      }
    };
  }]);

})();
