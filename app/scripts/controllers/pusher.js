define(['angular', 'pusher'], function (angular) {
  'use strict';

  angular.module('bannerAppApp.controllers.PusherCtrl', [])
    .controller('PusherCtrl', ['$scope', '$log', '$timeout', '$http', 'PusherConfig', 'pushMessage', 
    	function ($scope, $log, $timeout, $http, PusherConfig, pushMessage) {
        	$scope.connectionStatus = null;
    		$scope.sending = false;

        	$scope.data = {
        		message: null
        	};
        	$scope.lists = [];
          	Pusher.log = function( msg ) { $log.log('Pusher.log', msg); };
    		  
    		var pusher = new Pusher(PusherConfig.apiKey);
    		pusher.connection.bind('state_change', function( change ) {
    			$log.debug('state_change', change)
    		    $scope.connectionStatus = change.current;
    		    $scope.$apply();
    	  	});
    
    	  	var channel = pusher.subscribe('messages');
    	  	channel.bind('new_message', function(data){
    	  		$scope.lists.push(data);
    		    $scope.$apply();
    	  	});
    
    	  	$scope.send = function() {
    	  		$scope.sending = true;
    	  		pushMessage($scope.data).then(function(response){
    	  			$log.debug('send:response', response)
    	  			$scope.sending = false;
    	  			$scope.data.message = null;
    	  		});
    	  	};

    	  	$scope.keyUp = function(){
    	  		console.log('keyup', $scope.data.message)
    	  	};
        }]);
});
