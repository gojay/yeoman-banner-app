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

  	var app = angular.module('bannerAppApp.controllers.SplashMobileCtrl', [
  		'classy',
  		'common.fabric',
  		'common.fabric.utilities',
  		'common.fabric.constants'
  	]);

  	/**
  	 * Angular Classy
  	 * Cleaner class-based controllers for AngularJS
  	 * http://davej.github.io/angular-classy/
  	 */

  	app.classy.controller({
  		name: 'SplashMobileCtrl',
  		inject: [
	  		'$rootScope',
	    	'$scope', 
	    	'$http', 
	    	'$log',
	    	'$timeout',
	    	'$modal',
	    	'API',

	    	'Postermobile',
	    	'RecentMobilePhotos',
	    	'slidePush',

	    	'Fabric', 
	    	'FabricConstants', 
	    	'Keypress',

	    	'mobile'
	    ],
	    _qrcodeElement: null,
		_currentQRURL: null,
	    init: function() {
	    	var log = this.$log;

	    	log.debug('this', this);
	    	log.debug('$scope', this.$);
	    	log.debug('mobile', this.mobile);

	    	this._qrcodeElement = angular.element('#qrcode');

	    	this.FabricConstants.presetSizes = this.Postermobile.presetSizes;
			this.FabricConstants.CustomAttributes = this.Postermobile.CustomAttributes;

			this.$.fabric = {};
			this.$.FabricConstants = this.FabricConstants;

	    	this.$.$on('canvas:created', this._onCanvasCreated);
	    },
	    watch: {
			// 'fabric.presetSize': function(size){
			// 	this.$log.debug('fabric.presetSize', size);
			// },
			// 'fabric.canvasScale': function(scale){
			// 	this.$log.debug('fabric.canvasScale', scale);
			// 	this.$.fabric.setZoom();
			// }
	    },
	    // binding menus
        // =====================
	    toggleLeftMenu: function(forceClose) {
			var id = 'menu-left';
			if(forceClose === true) {
				this.slidePush.pushForceCloseById(id);
				return;
			}

			if( this.slidePush.isOpenById(id) ) {
				this.slidePush.pushForceCloseById(id);
			} else {
				this.slidePush.pushById(id);
			}
        },
        toggleControls: function(){
			var id = 'menu-top';
			var scroll = 0;
			if( this.slidePush.isOpenById(id) ) {
				this.slidePush.pushForceCloseById(id);
			} else {
				if( !this.$.fabric.selectedObject ) return;
				this.slidePush.pushById(id);
			}
		},
		resetControls: function(){
			var fabric = this.$.fabric;
			var object = fabric.selectedObject;
			var size   = fabric.presetSize;

			var controls = this.Postermobile.CustomAttributes[size.type][size.ppi];
			var o;
			switch( object.name ){
				case 'app-name':
					o = controls.text.app;
					break;
				case 'testimoni-text-left':
					o = controls.text.people.left;
					break;
				case 'testimoni-text-right':
					o = controls.text.people.right;
					break;
				case 'app-screenshot':
					o = controls.ss;
					break;
				case 'qr-iphone':
					o = controls.qr.iphone;
					break;
				case 'qr-android':
					o = controls.qr.android;
					break;
				case 'testimoni-pic-left':
					o = controls.people.left;
					break;
				case 'testimoni-pic-right':
					o = controls.people.right;
					break;
			}
			object.left = o.left * fabric.canvasScale;
			object.top  = o.top * fabric.canvasScale;
			fabric.render();
		},
		deselectObject: function(){
			var id = 'menu-top';
			this.$.fabric.deactivateAll();
			if( this.slidePush.isOpenById(id) ) {
				this.slidePush.pushForceCloseById(id);
			}
		},
		// binding QR Code
        // =====================
		onFocusQR: function(e){
            this._currentQRURL = e.target.value;
        },
        onKeyUpQR: function(e){
            var name  = e.target.name;
            var valid = e.target.validity.valid;
            this.$.mobile.qr[name].valid = e.target.validity.valid;
        },
        onBlurQR: function(e){
            var name = e.target.name;
            var url  = e.target.value;
            // if url is valid && url not same before
            if( e.target.validity.valid && this._currentQRURL != url ){
                this._mobileGenerateQR(name, url);
            }
        },
        // Ui Bootstrap Modal
        // =====================
        showModalPhoto: function(position) {
        	var mobile = this.$.mobile;

        	var modalInstance = this.$modal.open({
                templateUrl: 'views/splash/mobile-modal-photo.html',
                controller : 'ModalPhotoSplashMobileCtrl',
                resolve: {
                    data: function($rootScope, $timeout, RecentMobilePhotos){
                    	this.$log('resolve:photos', mobile.photos);
                        if( mobile.photos.length ){
                            return {
                                mobile: mobile
                            };
                        } else {
                            // get mobile photos from 'upload' directory with 'RecentMobilePhotos' service
                            $rootScope.isLoading = true;
                            return RecentMobilePhotos().then(function(photos){
                                $rootScope.isLoading = false;
                                mobile.photos = photos.data;
                                return {
                                    mobile: mobile
                                };
                            })
                        }
                    }
                }
            });
        },
        saveConfig: function() {
        	var scope = {
        		mobile: this.$.mobile,
        		fabric: this.$.fabric,
        		isNew: this.$.isNew,
        	};

        	var modalInstance = this.$modal.open({
                templateUrl: 'views/splash/mobile-modal-save.html',
                controller : 'ModalSaveSplashMobileCtrl',
                resolve: {
                    data: function(){
                		return {
                			loading: {
	                        	load: false,
	                        	message: 'Please wait'
	                        },
                			mobile: scope.mobile,
                			fabric: scope.fabric,
                			isNew : scope.isNew
                        };
                	}
                }
            });
        },
        // binding generate Poster
        // =====================
        generatePoster: function(id) {
        	var fabric = this.$.fabric;

        	this.$.loading = true;
            this.$timeout(function(){
                // Stops active object outline from showing in image
                fabric.deactivateAll();

                var initialCanvasScale = fabric.canvasScale;
                fabric.resetZoom();

                var name = 'poster-default';
                if( fabric.presetSize.type ){
                    name = this.$.mobile.text.app.replace(/\s/g, '-') + ' ' + fabric.presetSize.name;
                    name = name.replace(/\s/g, '_');
                }

                // create blob URL, then set into anchor download link
                var blob = this.$.mobile.poster = fabric.getCanvasBlob();
                var anchor = document.getElementById(id);
                anchor.download = name + ".png";
                anchor.href = blob;

        		this.$.loading = false;
            	this.$.mobile.disable.generate = false;
                this.$.mobile.disable.download = false;

                fabric.canvasScale = initialCanvasScale;
                fabric.setZoom();
            }, 3000);
        },
        // Prefix the function name with an underscore 
        // and Classy wont add it to the $scope.
	    _onCanvasCreated: function() {
	    	var self = this;

			this.$log.info('initialize canvas:created');
			
			this.$.fabric = new this.Fabric({
				JSONExportProperties: 	this.FabricConstants.JSONExportProperties,
				textDefaults		: 	this.FabricConstants.textDefaults,
				shapeDefaults		: 	this.FabricConstants.shapeDefaults,
				CustomAttributes	: 	this.FabricConstants.CustomAttributes,
				onChangeCanvasSize	: 	this._onChangeCanvasSize
			});

			this.Keypress.onSave(function(){  this.$.save() });
			this.Keypress.onControls({
				up: function(){
					if( this.$.fabric.selectedObject ) {
						this.$.fabric.controls.top -= 1;
						this.$.$apply();
						this.$log.debug('up', this.$.fabric.controls.top);
					}
				},
				down: function(){
					if( this.$.fabric.selectedObject ) {
						this.$.fabric.controls.top += 1;
						this.$.$apply();
						this.$log.debug('down', this.$.fabric.controls.top);
					}
				},
				left: function(){
					if( this.$.fabric.selectedObject ) {
						this.$.fabric.controls.left -= 1;
						this.$.$apply();
						this.$log.debug('left', this.$.fabric.controls.left);
					}
				},
				right: function(){
					if( this.$.fabric.selectedObject ) {
						this.$.fabric.controls.left += 1;
						this.$.$apply();
						this.$log.debug('right', this.$.fabric.controls.left);
					}
				}
			});

    		// new or edit mobile configuration
			this.$.mobile   = this.mobile.detail ? this._getMetaValue(this.mobile.detail, 'mobile') : this.Postermobile.model;
            this.$.fromJSON = this.mobile.detail ? this._getMetaValue(this.mobile.detail, 'config') : null;

            // is edit, load configuration from JSON
            if( this.$.fromJSON ){
            	this.$.isNew = false;
            	this.$.fabric.presetSize = this.Postermobile.presetSizes[1];
            	this._fromJSON();
            	// generate qr code
            	this._mobileGenerateQR('iphone');
                this._mobileGenerateQR('android');
            }

			//
            // Watchers
            // Executes the expression on the current scope at a later point in time.
            // ================================================================
			this.$.$evalAsync(
                function( $scope ) {

                    self.$log.log( "$evalAsync", $scope );

					$scope.$watch('fabric.presetSize', function(size){
						self.$log.debug('fabric.presetSize', size);
					});
					$scope.$watch('fabric.canvasScale', function(length){
						$scope.fabric.setZoom();
					});
					$scope.$watch('fabric.controls.angle', function(value){
						$scope.fabric.angleControl();
					});
					$scope.$watch('fabric.controls.left', function(value){
						$scope.fabric.leftControl();
					});
					$scope.$watch('fabric.controls.top', function(value){
						$scope.fabric.topControl();
					});
					$scope.$watch('fabric.controls.scale', function(value){
						$scope.fabric.scaleControl();
					});

		            $scope.$watch('mobile.images.screenshot', function(image){
		                if( image == null ) return;
		                self.$log.debug('mobile.images.screenshot', image);
		                self._setObjectImage( 'app-screenshot', image );
		            });
		            $scope.$watch('mobile.text.app', function(newVal){
		                if (typeof newVal === 'string' && $scope.fabric.selectedObject && $scope.fabric.selectedObject.name == 'app-name') {
		                    $scope.fabric.setText(newVal);
		                    $scope.fabric.render();
		                    $scope.fabric.centerH();
		                }
		            });
		            $scope.$watch('mobile.text.left', function(newVal){
		                if (typeof newVal === 'string' && $scope.fabric.selectedObject && $scope.fabric.selectedObject.name == 'testimoni-text-left') {
		                    $scope.fabric.setText(newVal);
		                    $scope.fabric.render();
		                }
		            });
		            $scope.$watch('mobile.text.right', function(newVal){
		                if (typeof newVal === 'string' && $scope.fabric.selectedObject && $scope.fabric.selectedObject.name == 'testimoni-text-right') {
		                    $scope.fabric.setText(newVal);
		                    $scope.fabric.render();
		                }
		            });
		            $scope.$watchCollection('mobile.dimensions.app', function(dimension){
		                self.$log.debug('mobile.dimensions.app', dimension);
		                if( !dimension ) return;
		                // $scope.screenshotUploadOptions.data.name  += '_' + $scope.fabric.presetSize.type;
		                $scope.screenshotUploadOptions.data.width = dimension.width;
		                $scope.screenshotUploadOptions.data.height = dimension.height;
		            });
                }
            );
		},
		_onChangeCanvasSize: function(_fabric) {
			var canvas  = _fabric.canvas;
			canvas.backgroundImage = null;
			_fabric.clearCanvas();

			if( _fabric.presetSize && _fabric.presetSize.hasOwnProperty('type') ){

				// if is paper a4 / a5, set canvas scale
				var initialCanvasScale = _fabric.canvasScale = 0.3;

				// set background image
				var backgroundImageName = 'stiker_'+ _fabric.presetSize.type +'_'+ _fabric.presetSize.width +'x'+ _fabric.presetSize.height +'.jpg';
				canvas.setBackgroundImage( 'images/'+ backgroundImageName, canvas.renderAll.bind(canvas), {
					scaleX: initialCanvasScale,
					scaleY: initialCanvasScale
				});

				// get QR Properties
				var type = _fabric.presetSize.type;
				var ppi  = _fabric.presetSize.ppi;
				var CustomAttributes = _fabric.CustomAttributes[type];

				var ss = CustomAttributes[ppi]['ss'];
				var qr = CustomAttributes[ppi]['qr'];
                var testimoniDimension = CustomAttributes[ppi]['people']['left'];
				var textAttribute = CustomAttributes[ppi]['text'];

				var callbackImage = function( object, name, type, index ){
					var attributes = CustomAttributes[ppi][type][index];
					object.name   = name;
					object.width  = attributes.width;
					object.height = attributes.height;
					object.left   = attributes.left;
					object.top    = attributes.top;
					object.hasControls = false;
				}

                // set model mobile dimension
                this.$.mobile.dimensions = {
                    app: { width : ss.width, height: ss.height },
                    testimonial: { width : testimoniDimension.width, height: testimoniDimension.height },
                    qr: { width: qr.iphone.width, height: qr.iphone.height }
                };

				// screenshot
                var screenshot = this.$.mobile.images.screenshot ? 
                                    'images/upload/mobile_screenshot.png' :
                                    'images/'+ ss.width +'x'+ ss.height +'.jpg' ;

                this.$.fabric.addImage(screenshot, function(object){
                	object.async = true;
                    object.name = 'app-screenshot';
                    object.set({
                        width  : ss.width,
                        height : ss.height,
                        left   : ss.left,
                        top    : ss.top,
                    });
                });

				// add text name app
				// =================================
				this.$.fabric.addText(this.$.mobile.text.app, function(object){
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
				// =================================
				var qrIphone = qr['iphone'];
				this.$.fabric.addImage('images/'+ qrIphone.width +'x'+ qrIphone.height +'.jpg', function(object){
                    callbackImage( object, 'qr-iphone', 'qr', 'iphone' );
                });
                var qrAndroid = qr['android'];
                this.$.fabric.addImage('images/'+ qrAndroid.width +'x'+ qrAndroid.height +'.jpg', function(object){
                    callbackImage( object, 'qr-android', 'qr', 'android' );
                });

				// add testimoni image-cirlcle & text Left
				// =================================
                var imgTestimonialLeft = this.$.mobile.images.testimonials.left ? 
                                    'images/upload/mobile_testimonial_left.jpg' :
                                    'images/'+ testimoniDimension.width +'x'+ testimoniDimension.height +'.jpg' ;
                this.$.fabric.addImageCircle(imgTestimonialLeft, function(object){
                    callbackImage( object, 'testimoni-pic-left', 'people', 'left' );
                });
                this.$.fabric.addIText(this.$.mobile.text.left, function(object){
                    var attribute = textAttribute['people']['left'];
                    object.set({
                        name: 'testimoni-text-left',
                        fill: '#313131',
                        stroke: '#313131',
                        fontSize: attribute.size,
                        left: attribute.left,
                        top: attribute.top,
                        opacity: 0.5
                    });
                });
                // add testimoni image-cirlcle & text Right
				// =================================
                var imgTestimonialRight = this.$.mobile.images.testimonials.right ? 
                                    'images/upload/mobile_testimonial_right.jpg' :
                                    'images/'+ testimoniDimension.width +'x'+ testimoniDimension.height +'.jpg' ;
                this.$.fabric.addImageCircle(imgTestimonialRight, function(object){
                    callbackImage( object, 'testimoni-pic-right', 'people', 'right' );
                });
                this.$.fabric.addIText(this.$.mobile.text.right, function(object){
                    var attribute = textAttribute['people']['right'];
                    object.set({
                        name: 'testimoni-text-right',
                        fill: '#313131',
                        stroke: '#313131',
                        fontSize: attribute.size,
                        left: attribute.left,
                        top: attribute.top,
                        opacity: 0.5
                    });
                });

                // generate QR
				// =================================
                this._mobileGenerateQR('iphone');
                this._mobileGenerateQR('android');
			}
		},
		_getMetaValue: function(obj, key) {
			var data = obj.data.meta.data;
			var value = $.grep(data, function(e){ 
				return e['meta_key'] == key; 
			});
			return value[0]['meta_value'];
		},
		_mobileGenerateQR: function( name, url ){
			var self = this;

            var qr = this.$.mobile.qr[name];

            if( url == null ) url = qr.url;

            if( url == null ) return;

            qr.loading = true;
            self._qrcodeElement.qrcode({
                "render": "canvas",
                "width" : this.$.mobile.dimensions.qr.width,
                "height": this.$.mobile.dimensions.qr.height,
                "color" : "#3a3",
                "text"  : url
            });
            
            var canvasQR   = self._qrcodeElement.find('canvas')[0],
            	imgDataURI = canvasQR.toDataURL('image/jpeg');

            // set qr image to object
            self._setObjectImage('qr-'+name, imgDataURI, function(){
                qr.url = url;
                qr.loading = false;
            	self._qrcodeElement.empty();
            });
        },
		_setObjectImage: function( objectName, src, callback ){
            var fabric = $scope.fabric;

            var object = fabric.getObjectByName(objectName);
            if ( !object ) return;

            object.getElement().src = src;
            object.opacity = 1;
            fabric.render();

            if( callback ) callback();
        },
		_getJSON: function() {
			var jsonString = this.$.fabric.getJSON();
        	return JSON.parse(jsonString);
		},
		_fromJSON: function() {
			this.$.fabric.canvasOriginalWidth = 2480;
        	this.$.fabric.canvasOriginalHeight = 3508;
        	this.$.fabric.canvasScale = 0.3;
        	this.$.fabric.loadJSON(this.$.fromJSON);
		}
  	});

	// Controller Modal Photo 
	// =========================
	app.classy.controller({
		name: 'ModalPhotoSplashMobileCtrl',
		inject: [
			'$scope', 
			'$modalInstance', 
			'$timeout', 
			'$log', 
			'data'
		],
		init: function() {
			this.$.mobile = this.data.mobile;
            this.$.photoIndex = null;
            this.$.uploadOptions = {
            	data: {
                	name  : 'mobile_testimonial',
            		width : this.$.mobile.dimensions.testimonial.width,
            		height: this.$.mobile.dimensions.testimonial.height,
            		unique: true
            	}
            };

            this.$log.debug('scope:ModalPhotoSplashMobileCtrl', this.$);
		},
		watch: {
			'mobile.photos': function(photos){
            	this.$log.debug('mobile.photos', photos);
            }
		},
		selected: function(position) {
			this.$.photoIndex = $index;
            this._setPhoto($index, position);
		},
		ok: function() {
			this.$modalInstance.close();
		},
		cancel: function() {
			this.$modalInstance.dismiss('cancel'); 
		},
        _setPhoto: function() {
        	// create canvas
            var canvas = document.createElement('canvas');
            // get canvas context
            var ctx = canvas.getContext("2d");
            // create image
            var img = new Image();
            img.onload = function() {
                // set canvas dimension
                canvas.width  = img.width;
                canvas.height = img.height;
                // draw image
                ctx.drawImage(img, 0, 0);
                // convert to image png
                var imgDataURI = canvas.toDataURL('image/png');
                this.$.mobile.images.testimonials[index] = imgDataURI;
                self._setObjectImage( 'testimoni-pic-'+index, imgDataURI );
            };
			img.crossOrigin = "Anonymous";
            img.src = this.$.mobile.photos[photoIndex];
        }
	});

	// Controller Modal Save 
	// ========================= 
	app.classy.controller({
		name: 'ModalSaveSplashMobileCtrl',
		inject: [
			'$scope', 
			'$rootScope', 
			'$route', 
			'$timeout', 
			'$log', 
			'$upload', 
			'$modalInstance',
			'Helpers',
			'API',
			'data',
		],
		init: function() {
			this.$.loading = data.loading;
            this.$.mobile  = data.mobile;
            this.$.fabric  = data.fabric;

            this.$.data = {
            	title 		: this.$.mobile.text.app,
            	screenshot 	: this.$.fabric.canvas.toDataURL(),
            };
		},
        save: function() {
        	var self = this;

        	this.$.loading.load = true;
        	this.$.loading.message = 'Generating image...';

            var isModified = $scope.fabric.isDirty();

        	// create blob image file
			var file  = this.$.fabric.getCanvasBlobFile('image/jpeg');
			file.name = this.Helpers.slugify(this.$.data.title);

        	// upload screenshot
			this.$upload.upload({
                url    : API.URL + '/upload',
                method : 'POST',
                file   : file,
                fileFormDataName: 'image'
            }).then(function(response) {
                self.$log.debug('upload:response', response);

        		this.$.loading.message = 'Saving configuration...';

        		// create data
        		this.$.data.screenshot = response.data.url;
            	this.$.data['meta'] = [{
            		'meta_key'  : 'mobile',
            		'meta_value': this.$.mobile
            	},{
            		'meta_key'  : 'config',
            		'meta_value': this.$.fabric.getJSON( true )
            	}];

	            var method = data.isNew ? 'POST' : 'PUT' ;
	    		var url = API.URL + (data.isNew ? '/splash/mobiles' : '/splash/mobiles/' + this.$route.current.params.mobileId);

        		// save configuration
        		this.$http({
        			method	: method,
        			url 	: url,
        			data 	: this.$.data
        		})
                success.then(function(response){
            		this.$log.debug('save:response', response);

            		this.$rootScope.safeApply(function(){
            			this.$rootScope.menus.left.model.data.push(this.$.data);
            		});
            		this.$.loading.load = false;
        			this.$.loading.message = 'Please wait';

                    this.$modalInstance.close();
                });

            }, function(response) {
                this.$log.error('upload:success', response);
            }, function(evt) {
                // Math.min is to fix IE which reports 200% sometimes
                var Progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                this.$log.info('upload:progress', Progress);
            });
        },
        cancel: function() {
        	this.$modalInstance.dismiss('cancel');
        }
	});
});
