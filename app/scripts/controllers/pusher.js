define(['angular', 'pusher', 'moment'], function (angular) {
  'use strict';

  angular.module('bannerAppApp.controllers.PusherCtrl', [])
    .controller('PusherCtrl', ['$scope', '$log', '$timeout', '$location', '$http', '$cookieStore', 'BASEURL', 'PUSHER', 'pushMessage', 
    	function ($scope, $log, $timeout, $location, $http, $cookieStore, BASEURL, PUSHER, pushMessage) {
        	$scope.connectionStatus = null;
    		$scope.sending = false;

            var user  = $cookieStore.get('user');
            var token = user ? user.token : null;

    		// get username from query 
    		// ?username=noob
            var username = user.user.username;
    		// var username = $location.search()['username'];
    		// if( !username ) username = 'guest_' + (Math.floor(Math.random()*9000) + 1000);
    		// your data
        	$scope.data = {
        		username: username,
        		text : null
        	};
        	// your friend
        	$scope.userEvent = null;
        	$scope.messages = [];

 			// moment.js
        	$scope.getMoment = function( $index ){
        		var published = $scope.messages[$index].published;
        		if( !published ) return;
        		return moment.utc(published).fromNow();
        	};
/*
        	$timeout(function(){
        		$log.info('get pusher user');
        		$http({
			        method: 'GET',
			        url: BASEURL + '/api/pusher/user',
                    headers: {'X-Auth-Token' : token},
			        withCredentials: true
			     }).success(function(data){
			        $log.debug('pusher user', data);
			    }).error(function(error){
			        $log.error('pusher user', error);
			    });
        	}, 5000);
*/
        	// Pusher
    	  	// =======================================

    	  	// pusher logs
          	Pusher.log = function( msg ) { $log.log('Pusher.log', msg); };
          	// pusher authentication endpoint
  			Pusher.channel_auth_endpoint = BASEURL + '/api/pusher/auth/socket';
    		  
    		var pusher = new Pusher(PUSHER.config.appKey, {
                auth: {
                    headers: {
                      'X-Auth-Token': token
                    },
                    withCredentials: true
                }
            });
    		// Receiving connection
    		pusher.connection.bind('state_change', function( change ) {
    			// $log.debug('state_change', change);
    		    $scope.connectionStatus = change.current;
    		    $scope.$apply();
    	  	});
    		// Receiving message 
    	  	var channel = pusher.subscribe(PUSHER.channel.private);
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
    	  			text: data.text,
    	  			published: moment.utc().format()
    	  		});

    	  		pushMessage(data).then(function(response){
    	  			// $log.debug('send:response', response);
    	  			// $scope.sending = false;
    	  			$scope.data.text = null;
    	  		});

                // $http({
                //     method: 'POST',
                //     url: BASEURL + '/api/pusher/message',
                //     headers: { 'X-Auth-Token':token },
                //     withCredentials: true
                //  }).success(function(data){
                //     $log.debug('pusher message', data);
                //     $scope.data.text = null;
                // }).error(function(error){
                //     $log.error('pusher message', error);
                // });
    	  	}

    	  	function sendTypingEvents( typing, enteredText ){
    	  		// $log.info('sendTypingEvents');
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
