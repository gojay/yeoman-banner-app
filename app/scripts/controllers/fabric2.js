define([
	'angular', 
	'fabricAngular',
	'fabricCanvas', 
	'fabricConstants', 
	'fabricDirective', 
	'fabricDirtyStatus',
	'fabricUtilities',
	'fabricWindow'
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
				$scope.fabric.addImage('images/logo.png');
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

			$scope.$watch('fabric.radius', function(radius){
				$scope.fabric.updateRadiusCircle(radius);
			});

			$scope.$watch('fabric.length', function(length){
				$scope.fabric.updateSquare(length);
			});

			$scope.$watch('fabric.canvasScale', function(length){
				$scope.fabric.setZoom();
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
