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
    	'Fabric', 
    	'FabricConstants', 
    	'Keypress', 
    	function($scope, $http, Fabric, FabricConstants, Keypress){
			
			var qrcode = angular.element('#qrcode');

	    	$scope.fabric = {};
			$scope.FabricConstants = FabricConstants;

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
				$scope.fabric.addImage('images/avatar2.jpg', null, true);
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

			$scope.addQRCode = function(){
				// var r = qrcode.makeCode("http://naver.com");
				// console.log(r)
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

                // var objectQR1 = $scope.fabric.getObjectByName('qr1');
                // console.log('objectQR1', objectQR1, objectQR1.getElement());
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
					json: {}
				});
			};

			$scope.$on('canvas:created', $scope.init);

			Keypress.onSave(function() {
				$scope.updatePage();
			});
    	}
    ]);
});
