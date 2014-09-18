define(['angular', 'pusher'], function (angular) {
  'use strict';

  angular.module('bannerAppApp.controllers.PusherCtrl', [])
    .controller('PusherCtrl', ['$scope', '$log', '$timeout', '$location', '$http', 'BASEURL', 'PusherConfig', 'pushMessage', 
    	function ($scope, $log, $timeout, $location, $http, BASEURL, PusherConfig, pushMessage) {
        	$scope.connectionStatus = null;
    		$scope.sending = false;

    		// get username from query 
    		// ?username=noeb
    		var username = $location.search()['username'];
    		if( !username ) username = 'guest_' + (Math.floor(Math.random()*9000) + 1000);
    		// your data
        	$scope.data = {
        		username: username,
        		text : null
        	};
        	// your friend
        	$scope.userEvent = null;
        	$scope.messages = [];

        	// Pusher
    	  	// =======================================

    	  	// pusher logs
          	Pusher.log = function( msg ) { $log.log('Pusher.log', msg); };
          	// pusher authentication
  			Pusher.channel_auth_endpoint = BASEURL + '/api/pusher/auth/socket';
    		  
    		var pusher = new Pusher(PusherConfig.apiKey);
    		// Receiving connection
    		pusher.connection.bind('state_change', function( change ) {
    			// $log.debug('state_change', change);
    		    $scope.connectionStatus = change.current;
    		    $scope.$apply();
    	  	});
    		// Receiving message 
    	  	var channel = pusher.subscribe('private-messages');
    	  	channel.bind('new_message', function(data){
    	  		if( data.username == $scope.data.username ) return;
    	  		$scope.messages.push(data);
    		    $scope.$apply();
    	  	});
    	  	// Receiving client events
    	  	channel.bind('client-typing', function(data){
    	  		var eventMessage = null;
    	  		if( data.typing ){
    	  			eventMessage = data.username + ' is typing...';
    	  		}
    	  		// else if( data.enteredText ){
    	  		// 	$scope.user = data.username + ' has entered text...';
    	  		// }

	  			$scope.userEvent = eventMessage;
    	  		$scope.$apply();
    	  	});
    
    	  	$scope.send = sendMessage;

    	  	function sendMessage(){
    	  		var data = $scope.data;
    	  		// $scope.sending = true;
    	  		$scope.messages.push({
    	  			username: data.username,
    	  			text: data.text
    	  		});
    	  		pushMessage(data).then(function(response){
    	  			// $log.debug('send:response', response);
    	  			// $scope.sending = false;
    	  			$scope.data.text = null;
    	  		});
    	  	}

    	  	function sendTypingEvents( typing, enteredText ){
    	  		$log.info('sendTypingEvents');
	    	  	channel.trigger('client-typing', {
                    username   : $scope.data.username,
                    typing     : typing,
                    enteredText: enteredText
              	});
    	  	}

    	  	// ui-event
    	  	// =======================================

    	  	var timeout = null;
    	  	$scope.keyUp = function($event){
    	  		var value = $event.target.value;

    	  		$log.info($.trim(value).length);

    	  		if( !timeout ){
    	  			var enteredText = value ? true : false ;
    	  			sendTypingEvents( true, enteredText );
    	  		} else {
    	  			$timeout.cancel(timeout);
    	  			timeout = null;
    	  		}

    	  		timeout = $timeout(function(){
    	  			var enteredText = value ? true : false ;
    	  			sendTypingEvents( false, enteredText );
    	  			timeout = null;
    	  		}, 1000);
    	  	};

    	  	// press "enter" to send
    	  	$scope.keyDown = function($event){
    	  		if( $event.keyCode == 13 ){
    	  			sendMessage();
    	  		}
    	  	}

    	  	// input blur send typing event is null
    	  	$scope.blur = function($event){
    	  		$timeout(function(){
    	  			sendTypingEvents( false, false );
    	  			timeout = null;
    	  		}, 1000);
    	  	};

        }]);
});
