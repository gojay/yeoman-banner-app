angular.module('common.fabric.directive', [
	'common.fabric.canvas'
])

.directive('fabric', ['$timeout', 'FabricCanvas', '$window', function($timeout, FabricCanvas, $window) {

	return {
		scope: {
			fabric: '='
		},
		controller: function($scope, $attrs, $element) {
			console.log('fabric:directive', $attrs, $element[0]);

			var id = $attrs.fabric;
			var template = $attrs.template;
			
			FabricCanvas.setElement(id, $element);
			FabricCanvas.createCanvas(id, template);

			// Continue rendering the canvas until the user clicks
			// to avoid the "calcOffset" bug upon load.
			$('body').on('click', 'canvas', function() {
				if ($scope.fabric && $scope.fabric.setUserHasClickedCanvas) {
					$scope.fabric.setUserHasClickedCanvas(true);
				}
			});

			//
			// Watching Controller Variables
			// ============================================================
			$scope.$watch('fabric.canvasBackgroundColor', function(newVal) {
				if ($scope.fabric && $scope.fabric.setCanvasBackgroundColor) {
					$scope.fabric.setCanvasBackgroundColor(newVal);
				}
			});

			$scope.$watch('fabric.selectedObject.text', function(newVal, oldVal) {
				if ($scope.fabric && typeof newVal === 'string') {
					var obj = $scope.fabric.selectedObject;
					
					if($scope.fabric.selectedObject.type != 'itext' || $scope.fabric.selectedObject.type != 'textbox') {
						$scope.fabric.render();
						return;
					} 
					
					var _newVal = newVal;
					var s = _newVal.split('\n');
					angular.forEach(s, function(value, key){
						var llength = value.length;
						var startIndex = _newVal.indexOf(value);
						var endIndex   = startIndex + llength;
						var currStyles = obj.getCurrentCharStyle(key, 0);
						obj.setSelectionStart(startIndex);
						obj.setSelectionEnd(endIndex);
						obj.setSelectionStyles(currStyles);
					});
					$scope.fabric.render();
				}
			});

			$scope.$watch('fabric.selectedObject.fontSize', function(newVal) {
				if ($scope.fabric && typeof newVal === 'string' || typeof newVal === 'number') {
					$scope.fabric.setFontSize(newVal);
					$scope.fabric.render();
				}
			});

			$scope.$watch('fabric.selectedObject.lineHeight', function(newVal) {
				if ($scope.fabric && typeof newVal === 'string' || typeof newVal === 'number') {
					$scope.fabric.setLineHeight(newVal);
					$scope.fabric.render();
				}
			});

			$scope.$watch('fabric.selectedObject.textAlign', function(newVal) {
				if ($scope.fabric && typeof newVal === 'string') {
					$scope.fabric.setTextAlign(newVal);
					$scope.fabric.render();
				}
			});

			$scope.$watch('fabric.selectedObject.fontFamily', function(newVal) {
				if (typeof newVal === 'string' && newVal) {
					$scope.fabric.setFontFamily(newVal);
					$scope.fabric.render();
				}
			});

			$scope.$watch('fabric.selectedObject.opacity', function(newVal) {
				if ($scope.fabric && typeof newVal === 'string' || typeof newVal === 'number') {
					$scope.fabric.setOpacity(newVal);
					$scope.fabric.render();
				}
			});

			$scope.$watch('fabric.selectedObject.fill', function(newVal) {
				if ($scope.fabric && typeof newVal === 'string') {
					// $scope.fabric.setFill(newVal);
					$scope.fabric.render();
				}
			});

			$scope.$watch('fabric.selectedObject.tint', function(newVal) {
				if ($scope.fabric && typeof newVal === 'string') {
					$scope.fabric.setTint(newVal);
					$scope.fabric.render();
				}
			});

			$scope.$watch('fabric.selectedObject.stroke', function(newVal) {
				if ($scope.fabric && typeof newVal === 'string' || typeof newVal === 'number') {
					$scope.fabric.setStroke(newVal);
					$scope.fabric.render();
				}
			});

			$scope.$watch('fabric.selectedObject.strokeWidth', function(newVal) {
				if ($scope.fabric && typeof newVal === 'string' || typeof newVal === 'number') {
					$scope.fabric.setStrokeWidth(newVal);
					$scope.fabric.render();
				}
			});
		}
	};

}]);
