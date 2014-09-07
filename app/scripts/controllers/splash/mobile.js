define([
	'angular', 
	'fabricAngular',
	'fabricCanvas', 
	'fabricConstants', 
	'fabricDirective', 
	'fabricDirtyStatus',
	'fabricUtilities',
	'fabricWindow',
	'qrcode'
], function (angular) {
  'use strict';

  angular.module('bannerAppApp.controllers.SplashMobileCtrl', [
  		'common.fabric',
  		'common.fabric.utilities',
  		'common.fabric.constants'
  	])
    .controller('SplashMobileCtrl', [
    	'$scope', 
    	'$http', 
    	'$timeout',
    	'Fabric', 
    	'FabricConstants', 
    	'Keypress',
    	function ($scope, $http, $timeout, Fabric, FabricConstants, Keypress) {
      	
			$scope.accordion = {
				closeOthers : true,
				isFirstOpen: true
			};
			$scope.dropdown = {
				sizeIsOpen: false,
				fontIsOpen: false
			};

			$scope.fabric = {};
			$scope.FabricConstants = FabricConstants;

			$scope.$watch('fabric.radius', function(radius){
				$scope.fabric.updateRadiusCircle(radius);
			});

			$scope.$watch('fabric.canvasScale', function(length){
				$scope.fabric.setZoom();
			});

			$scope.$watch('fabric.controls.angle', function(value){
				$scope.fabric.angleControl();
			});
			$scope.$watch('fabric.controls.left', function(value){
				// if( value < 0) $scope.fabric.controls.left = 0;
				// else if ( value > $scope.fabric.maxBounding.left) $scope.fabric.controls.left = $scope.fabric.maxBounding.left;
				$scope.fabric.leftControl();
			});
			$scope.$watch('fabric.controls.top', function(value){
				// if( value < 0) $scope.fabric.controls.top = 0;
				// else if ( value > $scope.fabric.maxBounding.top) $scope.fabric.controls.top = $scope.fabric.maxBounding.top;
				$scope.fabric.topControl();
			});
			$scope.$watch('fabric.controls.scale', function(value){
				$scope.fabric.scaleControl();
			});

			//
			// Editing Canvas Size
			// ================================================================
			$scope.selectCanvas = function() {
				$scope.canvasCopy = {
					width: $scope.fabric.canvasOriginalWidth,
					height: $scope.fabric.canvasOriginalHeight
				};
			};

			$scope.setCanvasSize = function() {
				$scope.fabric.setCanvasSize($scope.canvasCopy.width, $scope.canvasCopy.height);
				$scope.fabric.setDirty(true);
				delete $scope.canvasCopy;
			};

			//
			// Init
			// ================================================================
			$scope.init = function() {
				$scope.fabric = new Fabric({
					JSONExportProperties: FabricConstants.JSONExportProperties,
					textDefaults: FabricConstants.textDefaults,
					shapeDefaults: FabricConstants.shapeDefaults,
					json: {},
					CustomAttributes: FabricConstants.CustomAttributes,
					onChangeCanvasSize: onChangeCanvasSize
				});
			};

			$scope.$on('canvas:created', $scope.init);

			Keypress.onSave(function() {
				$scope.updatePage();
			});
			Keypress.onControls({
				up: function(){
					if( $scope.fabric.selectedObject ) {
						$scope.fabric.controls.top -= 1;
						$scope.$apply();
						console.log('up', $scope.fabric.controls.top);
					}
				},
				down: function(){
					if( $scope.fabric.selectedObject ) {
						$scope.fabric.controls.top += 1;
						$scope.$apply();
						console.log('down', $scope.fabric.controls.top);
					}
				},
				left: function(){
					if( $scope.fabric.selectedObject ) {
						$scope.fabric.controls.left -= 1;
						$scope.$apply();
						console.log('left', $scope.fabric.controls.left);
					}
				},
				right: function(){
					if( $scope.fabric.selectedObject ) {
						$scope.fabric.controls.left += 1;
						$scope.$apply();
						console.log('right', $scope.fabric.controls.left);
					}
				}
			});

			function onChangeCanvasSize( self ){

				console.log('presetSize', self.presetSize);

				var canvas  = self.canvas;
				canvas.backgroundImage = null;
				self.clearCanvas();

				if( self.presetSize && self.presetSize.hasOwnProperty('type') ){
					// if is paper a4 / a5, set canvas scale
					var initialCanvasScale = self.canvasScale = 0.3;

					// set background image
					var backgroundImageName = 'stiker_'+ self.presetSize.type +'_'+ self.presetSize.width +'x'+ self.presetSize.height +'.jpg';
					canvas.setBackgroundImage( 'images/'+ backgroundImageName, canvas.renderAll.bind(canvas), {
						scaleX: initialCanvasScale,
						scaleY: initialCanvasScale
					});

					// get QR Properties
					var type = self.presetSize.type;
					var ppi  = self.presetSize.ppi;
					var CustomAttributes = self.CustomAttributes[type];

					var callback = function( object, name, type, index ){
						var attributes = CustomAttributes[ppi][type][index];
						object.name   = name;
						if( type == 'people' ){
							object.width  = attributes.width;
							object.height = attributes.height;
						}
						object.left   = attributes.left;
						object.top    = attributes.top;
						object.hasControls = false;
						if( type == 'people'){
							object.clipTo = function(ctx) {
							    ctx.arc(0, 0, object.width / 2 , 0, 2*Math.PI, true);
							    ctx.lineWidth = 50;
							    ctx.strokeStyle = 'red';
							    ctx.stroke();
							};
						}
					}

					var ss = CustomAttributes[ppi]['ss'];
					var qr = CustomAttributes[ppi]['qr'];
					var textAttribute = CustomAttributes[ppi]['text'];
					var text = 'Lorem ipsum dolor sit amet\nlorem ipsum dolor\namet consectetur\n\nYour Name'

					var rect = new fabric.Rect({
						name  : 'screenshot',
					  	width : ss.width,
					  	height: ss.height,
					  	left  : ss.left,
					  	top   : ss.top,
					  	fill  : "#"+((1<<24)*Math.random()|0).toString(16)
					});
					self.addObjectToCanvas(rect, true);

					// $scope.fabric.addImage('images/'+ ss.width +'x'+ ss.height +'.jpg', function(object){
					// 	object.set({
					// 		left  : ss.left,
					//   		top   : ss.top,
					// 	})
					// });

					// add text name app
					$scope.fabric.addText('Name of App', function(object){
						var attribute = textAttribute['app'];
						object.set({
							name: 'app-name',
							fill: '#434343',
							stroke: '#434343',
							fontSize: attribute.size,
							left: attribute.left,
							top: attribute.top,
							textAlign: 'center',
						});
					});
					// add qr images
					var qrIphone = qr['iphone'];
					$scope.fabric.addImage('images/'+ qrIphone.width +'x'+ qrIphone.height +'.jpg', function(object){
						callback( object, 'qr-iphone', 'qr', 'iphone' );
					});
					var qrAndroid = qr['android'];
					$scope.fabric.addImage('images/'+ qrAndroid.width +'x'+ qrAndroid.height +'.jpg', function(object){
						callback( object, 'qr-android', 'qr', 'android' );
					});

					// add testimoni pic n text Left
					$scope.fabric.addImage('images/avatar.jpg', function(object){
						callback( object, 'testimoni-pic-left', 'people', 'left' );
					});
					$scope.fabric.addIText(text, function(object){
						var attribute = textAttribute['people']['left'];
						object.set({
							name: 'testimoni-text-left',
							fill: '#313131',
							stroke: '#313131',
							fontSize: attribute.size,
							left: attribute.left,
							top: attribute.top,
							// textAlign: 'right',
							opacity: 0.5
						});
					});
					// add testimoni pic n text Right
					$scope.fabric.addImage('images/avatar2.jpg', function(object){
						callback( object, 'testimoni-pic-right', 'people', 'right' );
					});
					$scope.fabric.addIText(text, function(object){
						var attribute = textAttribute['people']['right'];
						object.set({
							name: 'testimoni-text-right',
							fill: '#313131',
							stroke: '#313131',
							fontSize: attribute.size,
							left: attribute.left,
							top: attribute.top,
							// textAlign: 'right',
							opacity: 0.5
						});
					});
					
				}
			}

    }]);
});
