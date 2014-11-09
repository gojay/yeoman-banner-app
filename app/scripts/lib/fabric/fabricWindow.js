angular.module('common.fabric.window', [])

.factory('FabricWindow', ['$window', function($window) {

	fabric.LabeledRect = fabric.util.createClass(fabric.Rect, {

	  type: 'text',

	  initialize: function(options) {
	    options || (options = { });

	    this.callSuper('initialize', options);
	    this.set('text', options.text || '');
	  },

	  toObject: function() {
	    return fabric.util.object.extend(this.callSuper('toObject'), {
	      text: this.get('text')
	    });
	  },

	  _render: function(ctx) {
	    this.callSuper('_render', ctx);

	    console.log('this', this);

	    ctx.font = '20px Helvetica';
	    ctx.fillStyle = '#333';
	    ctx.fillText(this.text, -this.width/2 + 20, -this.height/2 + 20);
	  }
	});

    //
    // PolaroidPhoto
    // ================================================================
	fabric.PolaroidPhoto = fabric.util.createClass(fabric.Object, fabric.Observable, {
		fill: '#FFF',
		type: 'polaroid',
	    H_PADDING: 10,
	    V_PADDING: 10,
	    placeholder: true,
	    initialize: function(src, options) {
	        this.callSuper('initialize', options);
	        if(this.placeholder) {
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
	    _render: function(ctx) {
	    	// ctx.drawImage(this.image, -this.width / 2, -this.height / 2);
		    // ctx.globalCompositeOperation = 'destination-in';
		    // ctx.beginPath();
		    // var radius = this.width < this.height ? (this.width / 2) : (this.height / 2);
		    // ctx.arc(0, 0, radius, 0, 2*Math.PI, true);
		    // ctx.fill();
	        if (this.loaded) {
	            if (!this.placeholder) {
	                ctx.fillStyle = "transparent";
	            } else {
	                ctx.fillStyle = this.fill;
	            }
	            ctx.fillRect(
	            	-(this.width / 2) - this.H_PADDING, 
	            	-(this.height / 2) - this.H_PADDING,
	                this.width + this.H_PADDING * 2,
	                this.height + this.H_PADDING * 2
	            );
	            ctx.drawImage(this.image, -this.width / 2, -this.height / 2);
	        }
	    },
	    toggleFrame: function() {
	        this.placeholder = !this.placeholder;
	    }
	});

    //
    // NamedImage
    // ================================================================
	fabric.NamedImage = fabric.util.createClass(fabric.Image, {
	  	type: 'image',
	  	initialize: function(element, options) {
		    this.callSuper('initialize', element, options);
		    options && this.set('name', options.name);
	  	},
	  	toObject: function() {
	    	return fabric.util.object.extend(this.callSuper('toObject'), { name: this.name });
	  	}
	});
	fabric.NamedImage.fromURL = function(url, callback, imgOptions) {
	    fabric.util.loadImage(url, function(img) {
	      callback(new fabric.NamedImage(img, imgOptions));
	    }, null, imgOptions && imgOptions.crossOrigin);
	};
	fabric.NamedImage.fromObject = function(object, callback) {
	  fabric.util.loadImage(object.src, function(img) {
	    callback && callback(new fabric.NamedImage(img, object));
	  });
	};
	fabric.NamedImage.async = true;

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

    //
    // NamedText
    // ================================================================
	fabric.NamedText = fabric.util.createClass(fabric.Text, {
	  	type: 'text',
	  	initialize: function(element, options) {
		    this.callSuper('initialize', element, options);
		    options && this.set('name', options.name);
	  	},
	  	toObject: function() {
	    	return fabric.util.object.extend(this.callSuper('toObject'), { name: this.name });
	  	}
	});
    //
    // NamedIText
    // ================================================================
	fabric.NamedIText = fabric.util.createClass(fabric.IText, {
	  	type: 'i-text',
	  	initialize: function(element, options) {
		    this.callSuper('initialize', element, options);
		    options && this.set('name', options.name);
	  	},
	  	toObject: function() {
	    	return fabric.util.object.extend(this.callSuper('toObject'), { name: this.name });
	  	}
	});

	return $window.fabric;

}]);
