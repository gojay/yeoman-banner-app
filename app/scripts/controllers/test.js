define(['angular'], function (angular) {
  'use strict';

  angular.module('bannerAppApp.controllers.TestCtrl', [])
    .controller('TestCtrl', ['$scope', '$cookieStore', '$location', '$log', '$http', function ($scope, $cookieStore, $location, $log, $http) {
          $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

            $scope.user = $cookieStore.get('user');

  			$scope.store = function(){
                $cookieStore.put('user', $scope.user);
                $location.path( "/test2" );
            };
            $scope.get = function(){
                return $cookieStore.get('user');
            };
            
            // http://api.local/REST/public/api/v1/contacts
            $http({
                method : 'GET',
                url    : 'http://api.local/REST/public/api/v1/contacts?page=1&per_page=5',
                data   : {
                    page : 1,
                    per_page : 5
                },
                headers: {
                    Authorization: 'Basic ' + btoa('MyVeryLongAPIKey:password')
                }
                // withCredentials: true
            }).success(function(data, status, headers, config) {

                $log.debug('data', data);
                $log.debug('status', status);
                $log.debug('headers', parseLinkHeader(headers('Link')));
                $log.debug('config', config);

            }).error(function(data, status, headers, config) {
                $log.error(data);
                $log.error(status);
                $log.error(headers);
                $log.error(config);
            });

            var linkexp=/<[^>]*>\s*(\s*;\s*[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*")))*(,|$)/g;
            var paramexp=/[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*"))/g;

            function unquote(value)
            {
                if (value.charAt(0) == '"' && value.charAt(value.length - 1) == '"') return value.substring(1, value.length - 1);
                return value;
            }

            function parseLinkHeader(value)
            {
               var matches = value.match(linkexp);
               var rels = new Object();
               var titles = new Object();
               for (var i = 0; i < matches.length; i++)
               {
                  var split = matches[i].split('>');
                  var href = split[0].substring(1);
                  var ps = split[1];
                  var link = new Object();
                  link.href = href;
                  var s = ps.match(paramexp);
                  for (var j = 0; j < s.length; j++)
                  {
                     var p = s[j];
                     var paramsplit = p.split('=');
                     var name = paramsplit[0];
                     link[name] = unquote(paramsplit[1]);
                  }

                  if (link.rel != undefined)
                  {
                     rels[link.rel] = link;
                  }
                  if (link.title != undefined)
                  {
                     titles[link.title] = link;
                  }
               }
               var linkheader = new Object();
               linkheader.rels = rels;
               linkheader.titles = titles;
               return linkheader;
            }
    }]);
});
