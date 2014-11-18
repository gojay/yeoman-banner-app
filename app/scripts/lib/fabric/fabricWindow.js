angular.module('common.fabric.window', [])

.factory('FabricWindow', ['$window', function($window) {

    // PolaroidPhoto
    // ================================================================
	fabric.PolaroidPhoto = fabric.util.createClass(fabric.Object, fabric.Observable, {
		fill: '#FFF',
		type: 'polaroid',
	    H_PADDING: 10,
	    V_PADDING: 10,
	    hasPlaceholder: true,
	    hasShadow: false,
	    initialize: function(src, options) {
	        this.callSuper('initialize', options);
	        if(this.hasPlaceholder) {
	        	this.left += this.H_PADDING;
	        	this.top += this.V_PADDING;
	        }
	        this.image = new Image();
	        this.image.src = src;
	        this.image.onload = (function() {
	            this.width = this.image.width;
	            this.height = this.image.height;
	            this.loaded = true;
	            this.setCoords();
	            this.fire('image:loaded');
	        }).bind(this);
	    },
	    setImage: function(image) {
	    	if(!image) return;
	    	this.image.crossOrigin = 'anonymous';
	    	this.image.setAttribute('src', image);
	    },
	    setPlaceholder: function(value) {
	        this.hasPlaceholder = value;
	    },
	  	toObject: function() {
	    	return fabric.util.object.extend(this.callSuper('toObject'), { name: this.name });
	  	},
	    _render: function(ctx) {
	        if (this.loaded) {

	            if (this.hasPlaceholder) {
	                ctx.fillStyle = this.fill;
                	ctx.strokeStyle = "rgba(0,0,0,0.3)";
	            } else {
	                ctx.fillStyle = "transparent";
                	ctx.strokeStyle = "transparent";
	            }

	            ctx.fillRect(
	            	-(this.width / 2) - this.H_PADDING, 
	            	-(this.height / 2) - this.H_PADDING,
	                this.width + this.H_PADDING * 2,
	                this.height + this.H_PADDING * 2
	            );
	            ctx.strokeRect(
	            	-(this.width / 2) - this.H_PADDING, 
	            	-(this.height / 2) - this.H_PADDING,
	                this.width + this.H_PADDING * 2,
	                this.height + this.H_PADDING * 2
	            );
	            ctx.drawImage(this.image, -this.width / 2, -this.height / 2);
	        }
	    }
	});
	fabric.PolaroidPhoto.fromObject = function (object, callback) {
	    fabric.util.enlivenObjects(object.objects, function (enlivenedObjects) {
	        delete object.objects;
	        callback && calback(new fabric.PolaroidPhoto(enlivenedObjects, object));
	    });
	};
	fabric.PolaroidPhoto.async = true;

	//
    // ImageCircle
    // ================================================================
	fabric.ImageCircle = fabric.util.createClass(fabric.Image, {
	  	type: 'image',
	  	initialize: function(element, options) {
		    this.callSuper('initialize', element, options);
		    options && this.set('name', options.name);
	  	},
	  	toObject: function() {
	    	return fabric.util.object.extend(this.callSuper('toObject'), { name: this.name });
	  	},
		clipTo: function(ctx) {
		    ctx.arc(0, 0, this.width / 2 , 0, 2*Math.PI, true);
		}
	});
	fabric.ImageCircle.fromURL = function(url, callback, imgOptions) {
	    fabric.util.loadImage(url, function(img) {
	      callback(new fabric.ImageCircle(img, imgOptions));
	    }, null, imgOptions && imgOptions.crossOrigin);
	};
	fabric.ImageCircle.fromObject = function(object, callback) {
	  fabric.util.loadImage(object.src, function(img) {
	    callback && callback(new fabric.ImageCircle(img, object));
	  });
	};
	fabric.ImageCircle.async = true;

	return $window.fabric;

}]);
