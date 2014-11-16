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
	    	this.image.setAttribute('src', image);
	    },
	    setPlaceholder: function(value) {
	        this.hasPlaceholder = value;
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

	return $window.fabric;

}]);
