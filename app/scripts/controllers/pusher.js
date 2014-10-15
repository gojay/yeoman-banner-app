define(['angular', 'pusher', 'moment'], function (angular) {
  'use strict';

  angular.module('bannerAppApp.controllers.PusherCtrl', [])
    .controller('PusherCtrl', ['$scope', '$log', '$timeout', '$location', '$http', '$cookieStore', '$filter', 'APIURL', 'PUSHER', 'pushMessage', 
    	function ($scope, $log, $timeout, $location, $http, $cookieStore, $filter, APIURL, PUSHER, pushMessage) {
        	$scope.connectionStatus = 'disconnected';
        	$scope.connected = false;
    		// $scope.sending = false;

    		// var pusher_channel = 'private';
    		var pusher_channel = 'presence';

            var user  = $cookieStore.get('user');
            var token = user ? user.token : null;

    		// get username from query 
    		// ?username=noob
    		var _username = $location.search()['username'];
    		if( !_username ) _username = 'guest_' + (Math.floor(Math.random()*9000) + 1000);
            var username = user ? user.username : _username ;
    		// your data
        	$scope.data = {
        		username: username,
        		email: user.email,
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

    	  	$scope.send = sendMessage;
/*
        	$timeout(function(){
        		$log.info('get pusher user');
        		$http({
			        method: 'GET',
			        url: APIURL + '/api/pusher/user',
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
  			Pusher.channel_auth_endpoint = APIURL + (( pusher_channel == 'private' ) ? 
  						  												'/api/pusher/auth/socket' :
  						  												'/api/pusher/auth/presence?username='+user.username+'&email='+user.email);
    		
    		// Connect Pusher
    		var pusher = new Pusher(PUSHER.config.appKey, {
                auth: {
                    headers: {
                      'X-Auth-Token': token
                    },
                    withCredentials: true
                }
            });
            pusher.connection.bind('error', function( err ) {
		    	$log.debug('[pusher:error]', err); 
			  	if( err.data.code === 4004 ) {
			    	$log.error('>>> detected limit error');
			  	}
			});
    		// Receiving state change
    		pusher.connection.bind('state_change', function( change ) {
    			$log.debug('state_change', change);
    		    $scope.connectionStatus = change.current;
    	  	});
    	  	pusher.connection.bind('connected', function() {
			  	$scope.connected = true;
			});

			$scope.userConnectOrDisconnect = function(){
				var action = $scope.connected ? 'disconnect' : 'connect';
				$log.info('user ' + action );

				if( $scope.connected )
					pusher.disconnect();
				else
					pusher.connect();

			  	$scope.connected = !$scope.connected;
			}

    		// Receiving message 
    	  	var channel = pusher.subscribe(PUSHER.channel[pusher_channel]);
    	  	channel.bind('new_message', function(data){
    	  		$log.log('new_message', data)
    	  		// me
    	  		if( data.username == $scope.data.username ) {
    	  			var index = data.index;
    	  			// set complete sending message
    	  			$scope.messages[index].sending = false;
    	  			return;
    	  		}

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

    	  	$scope.members = [];

	  		channel.bind('pusher:subscription_succeeded', getOnlineUsers);
	  		channel.bind('pusher:member_added', memberAdd);
	  		channel.bind('pusher:member_removed', memberRemoved);

    	  	function getOnlineUsers( users ){
    	  		$log.debug('[members:online]', users);
    	  		var me = users.me;
    	  		var members = [];
    	  		users.each( function(member){
    	  			if( me.info.email != member.info.email ) {
    	  				members.push(member);
    	  			}
    	  		});
    	  		$scope.members = members;
    	  		$scope.$apply();
    	  	}

    	  	function memberAdd( user ){
    	  		$log.debug('[member:add]', user);

    	  		$scope.members.push(user);
    	  		$scope.$apply();
    	  	}

    	  	function memberRemoved( user ){
    	  		$log.debug('[member:removed]', user);

    	  		var memberIndex = null;
				angular.forEach($scope.members, function(member, index) {
					console.log(index, member.info.email, user.info.email);
				  	if (member.info.email == user.info.email) {
				     	memberIndex = index;
				  	}
				});

				$scope.members.splice(memberIndex, 1);
				$scope.$apply();
    	  	}
    
    	  	function sendMessage(){
    	  		var messages = $scope.messages,
    	  			data = $scope.data;
    	  		// set message index
    	  		data['index'] = messages.length;

    	  		// push message
    	  		messages.push({
    	  			username: data.username,
    	  			email: data.email,
    	  			text : data.text,
    	  			published: moment.utc().format(),
    	  			sending: true
    	  		});

    	  		pushMessage(data).then(function(response){
    	  			// $log.debug('send:response', response);
    	  			// $scope.sending = false;
	    	  		// empty text
		  			$scope.data.text = null;
    	  		});

                // $http({
                //     method: 'POST',
                //     url: APIURL + '/api/pusher/message',
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

    	  	$scope.chats = [{
    	  		name: 'Dani',
    	  		email: 'dani.gojay@gmail.com',
    	  		text: 'that mongodb thing looks good, huh? tiny master db, and huge document store',
    	  		time: '2009-11-13T20:00'
    	  	},{
    	  		name: 'Gojay',
    	  		email: 'gojay_rocks@yahoo.com',
    	  		text: 'that mongodb thing looks good, huh? tiny master db, and huge document store',
    	  		time: '2009-11-13T20:00'
    	  	},{
    	  		name: 'Dani',
    	  		email: 'dani.gojay@gmail.com',
    	  		text: 'that mongodb thing looks good, huh? tiny master db, and huge document store',
    	  		time: '2009-11-13T20:00'
    	  	},{
    	  		name: 'Gojay',
    	  		email: 'gojay_rocks@yahoo.com',
    	  		text: 'that mongodb thing looks good, huh? tiny master db, and huge document store',
    	  		time: '2009-11-13T20:00'
    	  	},{
    	  		name: 'Dani',
    	  		email: 'dani.gojay@gmail.com',
    	  		text: 'that mongodb thing looks good, huh? tiny master db, and huge document store',
    	  		time: '2009-11-13T20:00'
    	  	}];

        }]);
});
