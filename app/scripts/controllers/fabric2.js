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

  angular.module('bannerAppApp.controllers.Fabric2Ctrl', [
  		'common.fabric',
  		'common.fabric.utilities',
  		'common.fabric.constants'
  	])
    .controller('Fabric2Ctrl', [
    	'$scope', 
    	'$http', 
    	'$timeout',
    	'Fabric', 
    	'FabricConstants', 
    	'Keypress', 
    	function($scope, $http, $timeout, Fabric, FabricConstants, Keypress){

	    	$scope.fabric = {};
			$scope.FabricConstants = FabricConstants;

			$scope.dropdown = {
				sizeIsOpen: false,
				fontIsOpen: false
			};
			
			//
			// QR Code
			// ================================================================
			var qrcode = angular.element('#qrcode');
			$scope.qr = {
				url  : null,
				valid: null,
				loading: false
			};
			var currentQRURL = null;
			$scope.qr.onFocus = function(e){
                // device name
            	currentQRURL = e.target.value;
                console.log('onFocus', currentQRURL);
            };
            $scope.qr.onBlur = function(e){
            	var url = e.target.value;
            	$scope.qr.valid = e.target.validity.valid;
                // if url is valid && url not same before
                if( e.target.validity.valid && currentQRURL != url ){
                	$scope.qr.loading = true;
                	$timeout(function(){
		                qrcode.qrcode({
						    "render": "canvas",
						    "width": 100,
						    "height": 100,
						    "color": "#3a3",
						    "text": url
						});
						var canvasQR   = qrcode.find('canvas')[0];
		                var imgDataURI = canvasQR.toDataURL('image/jpeg');
		                qrcode.empty();

		                $scope.qr.loading = false;
		                $scope.qr.url = url;
		                setQRImage(imgDataURI);
                	}, 3000);
	            }
            };
			function setQRImage ( src ){
				var fabric = $scope.fabric;

				var qr1 = fabric.getObjectByName('qr1');
				var qr2 = fabric.getObjectByName('qr2');
				if ( !qr1 && !qr2 ) {
					return;
				}

				qr1.getElement().src = src;
				qr2.getElement().src = src;
				qr1.opacity = 1;
				qr2.opacity = 1;
				fabric.render();
			}

			//
			// Creating Canvas Objects
			// ================================================================
			$scope.addShape = function(path) {
				$scope.fabric.addShape('assets/25.svg');
			};

			$scope.addBackgroundImage = function(image) {
				console.log('canvasOriginalWidth', $scope.fabric.canvasOriginalWidth);
				console.log('canvasOriginalHeight', $scope.fabric.canvasOriginalHeight);
				$scope.fabric.addImage('images/a4_2480x3508.jpg');
			};

			$scope.addImage = function(image) {
				$scope.fabric.addImage('images/avatar.jpg');
			};

			$scope.addImageUpload = function(data) {
				var obj = angular.fromJson(data);
				$scope.addImage(obj.filename);
			};

			$scope.addGroup = function(data) {
				$scope.fabric.addGroup();
			};

			$scope.addCircle = function(data) {
				$scope.fabric.addCircle();
			};

			$scope.rectDimension = {
				width : 100,
				height: 100
			};
			$scope.addRect = function() {
				$scope.showDimension = true;
			};
			$scope.submitRect = function(){
				$scope.fabric.addRect( $scope.rectDimension.width, $scope.rectDimension.height );
				$scope.fabric.setDirty(true);
				delete $scope.showDimension;
			};

			$scope.addQRCode = function(){
				qrcode.qrcode({
				    "render": "canvas",
				    "width": 100,
				    "height": 100,
				    "color": "#3a3",
				    "text": "http://larsjung.de/qrcode"
				});
				var canvasQR = qrcode.find('canvas')[0];
                var imgDataURI = canvasQR.toDataURL('image/jpeg');
                qrcode.empty();
                console.log(imgDataURI);

                $scope.fabric.toggleImage2(imgDataURI);
			};

			$scope.$watch('fabric.radius', function(radius){
				$scope.fabric.updateRadiusCircle(radius);
			});

			$scope.$watch('fabric.length', function(length){
				$scope.fabric.updateSquare(length);
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
					callbackCanvasSize: callbackCanvasSize
				});
			};

			$scope.$on('canvas:created', $scope.init);

			Keypress.onSave(function() {
				$scope.updatePage();
			});

			function callbackCanvasSize( self ){

				console.log('presetSize', self.presetSize);

				var canvas  = self.canvas;
				canvas.backgroundImage = null;

				if( self.presetSize && self.presetSize.hasOwnProperty('type') ){
					// if is paper a4 / a5, set canvas scale
					var initialCanvasScale = self.canvasScale = 0.3;

					// set background image
					var backgroundImageName = 'stiker_a4_'+ self.presetSize.width +'x'+ self.presetSize.height +'.jpg';
					canvas.setBackgroundImage( 'images/'+ backgroundImageName, canvas.renderAll.bind(canvas), {
						scaleX: initialCanvasScale,
						scaleY: initialCanvasScale
					});

					// get QR Properties
					var type = self.presetSize.type;
					var ppi  = self.presetSize.ppi;
					var CustomAttributes = self.CustomAttributes[type];

					var callback = function( object, type, index ){
						var attributes = CustomAttributes[ppi][type][index];
						object.name   = type + '-' + index;
						object.width  = attributes.width;
						object.height = attributes.height;
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

					// A4 200/300 PPI : peoples, QR Images
					if( type == 'a4' ){
						var textAttribute = CustomAttributes[ppi]['text'];
						// set app name
						$scope.fabric.addText('Name of App', function(object){
							var attribute = textAttribute['app'];
							object.top  = attribute.top;
							object.left = attribute.left;
							object.fontSize = 95;
						});

						var iText = new fabric.IText('lorem ipsum\ndolor sit Amet\nconsectetur\nYour Name', {
							fontFamily: 'Helvetica',
							fill: '#333',
							styles: {
								3: {
									0: {
			                            fontWeight: 'bold'
			                        },
			                        1: {
			                            fontWeight: 'bold'
			                        },
								}
							}
						});
						$scope.fabric.addObjectToCanvas(iText);
						// set qr images
						$scope.fabric.addImage('images/avatar.jpg', function(object){
							callback( object, 'qr', 'iphone' );
						});
						$scope.fabric.addImage('images/avatar2.jpg', function(object){
							callback( object, 'qr', 'android' );
						});
						// set people images
						$scope.fabric.addImage('images/avatar.jpg', function(object){
							callback( object, 'people', 'left' );
						});
						$scope.fabric.addImage('images/avatar2.jpg', function(object){
							callback( object, 'people', 'right' );
						});
					}

					var ss = CustomAttributes[ppi]['ss'];
					var rect = new fabric.Rect({
						name  : 'rect',
					  	width : ss.width,
					  	height: ss.height,
					  	left  : ss.left,
					  	top   : ss.top,
					  	fill  : "#"+((1<<24)*Math.random()|0).toString(16)
					});
					self.addObjectToCanvas(rect);

				}
			}
    	}
    ]);
});
