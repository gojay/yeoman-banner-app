angular.module('common.fabric.window', [])

.factory('FabricWindow', ['$window', function($window) {

    // PolaroidPhoto
    // ================================================================
	fabric.PolaroidPhoto = fabric.util.createClass(fabric.Image, fabric.Observable, {
		type: 'polaroidPhoto',
	    hasShadow: false,
	    initialize: function(element, options) {
	        options || (options = {});
	        this.callSuper('initialize', element, options);
	        this.set('fill', options.fill || '#fff');
	        this.set('placeholder', options.placeholder || true);
	        this.set('padding', options.padding || 10);
	        if(this.placeholder) {
	        	this.left += this.padding;
	        	this.top += this.padding;
	        }
	    },
	  	toObject: function() {
	    	return fabric.util.object.extend(this.callSuper('toObject'), { 
	    		fill: this.fill,
	    		placeholder: this.placeholder,
	    		crossOrigin: 'anonymous'
	    	});
	  	},
		_render: function(ctx) {
			ctx.webkitImageSmoothingEnabled = true;

            if (this.placeholder) {
                ctx.fillStyle = this.fill;
            	ctx.strokeStyle = "rgba(0,0,0,0.3)";
            } else {
                ctx.fillStyle = "transparent";
            	ctx.strokeStyle = "transparent";
            }
            
	        ctx.fillRect(
            	-(this.width / 2) - this.padding, 
            	-(this.height / 2) - this.padding,
                this.width + this.padding * 2,
                this.height + this.padding * 2
            );
            ctx.strokeRect(
            	-(this.width / 2) - this.padding, 
            	-(this.height / 2) - this.padding,
                this.width + this.padding * 2,
                this.height + this.padding * 2
            );
      
            this.callSuper('_render', ctx); // Draw image
	    }
	});
	fabric.PolaroidPhoto.fromURL = function(url, callback, imgOptions) {
	    fabric.util.loadImage(url, function(img) {
	      callback(new fabric.PolaroidPhoto(img, imgOptions));
	    }, null, { crossOrigin: 'Anonymous' });
	};
	fabric.PolaroidPhoto.fromObject = function(object, callback) {
	  	fabric.util.loadImage(object.src, function(img) {
	    	callback && callback(new fabric.PolaroidPhoto(img, object));
	  	}, null, { crossOrigin: 'Anonymous' });
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
