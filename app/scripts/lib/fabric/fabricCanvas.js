angular.module('common.fabric.canvas', [
	'common.fabric.window'
])

.service('FabricCanvas', ['FabricWindow', '$rootScope', function(FabricWindow, $rootScope) {

	var self = {
		elements: [],
		canvases: []
	};

	function createId() {
		return Math.floor(Math.random() * 10000);
	}

	self.setElement = function(id, element) {
		self.elements[id] = element;
		$rootScope.$broadcast('canvas:element:selected', { element:element });
	};

	self.createCanvas = function(id, template) {
		var canvasId = 'fabric-canvas-' + id;
		self.elements[id].attr('id', canvasId);
		self.canvases[id] = new FabricWindow.Canvas(canvasId);
		$rootScope.$broadcast('canvas:created', { canvasId:id, canvasTemplate:template });

		return self.canvases[self.canvasId];
	};

	self.getCanvas = function(id) {
		return self.canvases[id];
	};

	self.getCanvasId = function() {
		return id;
	};

	return self;

}]);
