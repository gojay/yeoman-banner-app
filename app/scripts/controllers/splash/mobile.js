define([
	'angular', 
	'fabricAngular',
	'fabricCanvas', 
	'fabricConstants', 
	'fabricDirective', 
	'fabricDirtyStatus',
	'fabricUtilities',
	'fabricWindow',
	'jquery-qrcode'
], function (angular) {
  'use strict';

  	/**
  	 * Angular Classy
  	 * Cleaner class-based controllers for AngularJS
  	 * http://davej.github.io/angular-classy/
	 *
  	 * classy-extends : plugin allows base controllers for Angular Classy.
  	 * https://github.com/wuxiaoying/classy-extends
  	 */

  	var app = angular.module('bannerAppApp.controllers.SplashMobileCtrl', [
  		'classy', 
  		'classy-extends',
  		'classy-initScope',
  		'common.fabric',
  		'common.fabric.utilities',
  		'common.fabric.constants'
  	]);

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
	    	// 'Keypress',

	    	'mobile'
	    ],
	    initScope: {
	        fabric: {},
	        screenshotUploadOptions: {
            	data: {
            		id 	   : null,
                	name   : 'screenshot',
                	width  : null,
                	height : null
            	}
            }
	    },
	    _id: null,
	    _qrcodeElement: null,
		_currentQRURL: null,
	    _initMenus: function() {

            this.$.mobiles = {};
    		this.$.mobiles.data = this.mobile.all.data;
    		this.$.mobiles.delete = function($index){
    			if(confirm('Are you sure ?')) {
    				delete this.$.mobiles.data[$index];
    			}
    		};

            this.$rootScope.menus = {
				top: {
	                model   : this.$,
	                template: '<div ng-include src="\'views/splash/mobile-menu-top.html\'"></div>'
				},
				left: {
					model : this.$.mobiles,
	                template: '<div ng-include src="\'views/splash/mobile-menu-left.html\'"></div>'
				}
            };

	    	this.$log.log('init:menu', this);
	    },
	    init: function() {
	    	var log = this.$log;

	    	this._qrcodeElement = angular.element('#qrcode');

            this._initMenus();

            this._id = this.mobile.detail ? this.mobile.detail.data.id : this.$.mobiles.data.length + 1;
            this.$.screenshotUploadOptions.data['id'] = this._id;

    		// set scope mobile & formJSON
			this.$.mobile   = this.mobile.detail ? this._getMetaValue(this.mobile.detail, 'mobile') : this.Postermobile.model;
            this.$.fromJSON = this.mobile.detail ? this._getMetaValue(this.mobile.detail, 'config') : null;

	    	this.FabricConstants.presetSizes 	  = this.Postermobile.presetSizes;
			this.FabricConstants.CustomAttributes = this.Postermobile.CustomAttributes;

			this.$.FabricConstants = this.FabricConstants;

	    	log.debug('this', this);

	    	this.$.$on('canvas:created', this._onCanvasCreated);
	    },
	    // Scope Watch
        // =====================
	    watch: {
		    'mobile.images.screenshot'		: '_onChangeMobileScreenshot',
		    'mobile.text.app'				: '_onChangeMobileTextApp',
		    'mobile.text.left'				: '_onChangeMobileText',
		    'mobile.text.right'				: '_onChangeMobileTextRight',
		    '{object}mobile.dimensions.app'	: '_onChangeMobileDimension'
	    },
	    _onChangeMobileScreenshot: function(newVal, oldval) {
	    	this.$log.info('watch:mobile.images.screenshot..');
	    	if(typeof newVal === 'string'){
                this.$log.debug('mobile.images.screenshot', newVal);
        		this._setObjectImage('app-screenshot', newVal);
		    }
	    },
	    _onChangeMobileTextApp: function(newval, oldval) {
	    	this.$log.info('watch:mobile.text.app..');
	    	if (typeof newVal === 'string' && this.$.fabric.selectedObject && this.$.fabric.selectedObject.name == 'app-name') {
                this.$.fabric.setText(newVal);
                this.$.fabric.render();
                this.$.fabric.centerH();
            }
	    },
	    _onChangeMobileTextLeft: function(newVal, oldval) {
	    	this.$log.info('watch:mobile.text.left..');
	    	if (typeof newVal === 'string' && this.$.fabric.selectedObject && this.$.fabric.selectedObject.name == 'testimoni-text-left') {
                this.$.fabric.setText(newVal);
                this.$.fabric.render();
            }
	    },
	    _onChangeMobileTextRight: function(newval, oldval) {
	    	this.$log.info('watch:mobile.text.right..');
	    	if (typeof newVal === 'string' && this.$.fabric.selectedObject && this.$.fabric.selectedObject.name == 'testimoni-text-right') {
                this.$.fabric.setText(newVal);
                this.$.fabric.render();
            }
	    },
	    _onChangeMobileDimension: function(dimension){
            this.$log.debug('mobile.dimensions.app', dimension);
            if( !dimension ) return;
            // $scope.screenshotUploadOptions.data.name  += '_' + $scope.fabric.presetSize.type;
            this.$.screenshotUploadOptions.data.width  = dimension.width;
            this.$.screenshotUploadOptions.data.height = dimension.height;
        },
	    // event click : toggle menu
        // =====================
	    toggleMenu: function(position, forceClose) {
			var id = 'menu-' + position;
			var slideMenu = this.slidePush;

			if(forceClose === true) {
				slideMenu.pushForceCloseById(id);
				return;
			}

			if( slideMenu.isOpenById(id) ) {
				slideMenu.pushForceCloseById(id);
			} else {
				slideMenu.pushById(id);
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
			this.toggleMenu('top', true);
		},
		// event click : ui-event
        // =====================
        onFocusName: function(e) {
        	this.$.fabric.setActiveObjectByName('app-name');
        	this.$timeout(function() {
        		angular.element(e.currentTarget).select();
        	});
        },
		onFocusQR: function(e){
            this._currentQRURL = e.target.value;
        	this.$timeout(function() {
        		angular.element(e.currentTarget).select();
        	});
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
                this._generateQR(name, url);
            }
        },
        // event click : show Modal
        // =====================
        showModalPhoto: function(position) {
        	var log = this.$log;
        	var mobile = this.$.mobile;
        	var fabric = this.$.fabric;

        	log.log('[showModalPhoto]', this);

        	var modalInstance = this.$modal.open({
                templateUrl: 'views/splash/mobile-modal-photo.html',
                controller : 'ModalPhotoSplashMobileCtrl',
                resolve: {
                    mobile: function($rootScope, $timeout, RecentMobilePhotos){
                    	log.log('resolve:photos', mobile.photos);
                        if( mobile.photos.length ){
                            return {
                            	fabric: fabric,
                                data: mobile,	
                                position: position
                            };
                        } else {
                            // get mobile photos from 'upload' directory with 'RecentMobilePhotos' service
                            $rootScope.isLoading = true;
                            return RecentMobilePhotos().then(function(photos){
                                $rootScope.isLoading = false;
                                mobile.photos = photos.data;
                                return {
                                	fabric: fabric,
                                    data: mobile,	
                                	position: position
                                };
                            })
                        }
                    }
                }
            });
        },
        showModalSave: function() {
        	var self = this;
        	var data = {
        		id: this._id,
    			loading: {
                	load: false,
                	message: 'Please wait'
                },
        		mobile: this.$.mobile,
        		fabric: this.$.fabric,
        	};

        	var modalInstance = this.$modal.open({
                templateUrl: 'views/splash/mobile-modal-save.html',
                controller : 'ModalSaveSplashMobileCtrl',
                resolve: {
                    data: function(){
                		return data;
                	}
                }
            });
            modalInstance.result.then(function(){
            	self.toggleMenu('left');
            });
        },
        // event click : generate Poster
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

			// this.Keypress.onSave(function(){  this.$.save() });
			// this.Keypress.onControls({
			// 	up: function(){
			// 		if( self.$.fabric.selectedObject ) {
			// 			self.$.fabric.controls.top -= 1;
			// 			self.$.$apply();
			// 			self.$log.debug('up', self.$.fabric.controls.top);
			// 		}
			// 	},
			// 	down: function(){
			// 		if( self.$.fabric.selectedObject ) {
			// 			self.$.fabric.controls.top += 1;
			// 			self.$.$apply();
			// 			self.$log.debug('down', self.$.fabric.controls.top);
			// 		}
			// 	},
			// 	left: function(){
			// 		if( self.$.fabric.selectedObject ) {
			// 			self.$.fabric.controls.left -= 1;
			// 			self.$.$apply();
			// 			self.$log.debug('left', self.$.fabric.controls.left);
			// 		}
			// 	},
			// 	right: function(){
			// 		if( self.$.fabric.selectedObject ) {
			// 			self.$.fabric.controls.left += 1;
			// 			self.$.$apply();
			// 			self.$log.debug('right', self.$.fabric.controls.left);
			// 		}
			// 	}
			// });

            // is edit, load configuration from JSON
            if( this.$.fromJSON ){
            	this.$.fabric.presetSize = this.Postermobile.presetSizes[1];
            	this._fromJSON(function() {
	            	// generate qr code
	            	self._generateQR('iphone');
	                self._generateQR('android');
            	});
            }

			//
            // Watchers
            // Executes the expression on the current scope at a later point in time.
            // ================================================================
			this.$.$evalAsync(
                function( $scope ) {

                    self.$log.log("$evalAsync", $scope);

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
                }
            );
		},
		_onChangeCanvasSize: function(_fabric) {
			var canvas  = _fabric.canvas;
			canvas.backgroundImage = null;
			_fabric.clearCanvas();

			if( _fabric.presetSize && _fabric.presetSize.hasOwnProperty('type') ){

				var $fabric = this.$.fabric;

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

				var screenshotOptions 	= CustomAttributes[ppi]['ss'];
				var qrOptions 			= CustomAttributes[ppi]['qr'];
                var testimonialOptions 	= CustomAttributes[ppi]['people'];
				var textOptions 		= CustomAttributes[ppi]['text'];

				// screenshot
                var screenshotImage = this.$.mobile.images.screenshot ? 
                                    	this.$.mobile.images.screenshot :
                                    	'images/'+ screenshotOptions.width +'x'+ screenshotOptions.height +'.jpg' ;
                $fabric.addImage(screenshotImage, screenshotOptions);

				// add text name app
				// =================================
				$fabric.addText(this.$.mobile.text.app, textOptions['app']);
				// add qr images
				// =================================
				var qrIphone = qrOptions['iphone'];
				$fabric.addImage('images/'+ qrIphone.width +'x'+ qrIphone.height +'.jpg', qrIphone);
                var qrAndroid = qrOptions['android'];
                $fabric.addImage('images/'+ qrAndroid.width +'x'+ qrAndroid.height +'.jpg', qrAndroid);

				// add testimoni image-cirlcle & text Left
				// =================================
                var tLeftImg = this.$.mobile.images.testimonials.left ? this.$.mobile.images.testimonials.left :
                        		'images/'+ testimonialOptions.left.width +'x'+ testimonialOptions.left.height +'.jpg' ;
                $fabric.addImageCircle(tLeftImg, testimonialOptions.left);
                $fabric.addIText(this.$.mobile.text.left, textOptions['people']['left']);
                // add testimoni image-cirlcle & text Right
				// =================================
                var tRightImg = this.$.mobile.images.testimonials.right ? this.$.mobile.images.testimonials.right :
                                'images/'+ testimonialOptions.right.width +'x'+ testimonialOptions.right.height +'.jpg' ;
                $fabric.addImageCircle(tRightImg, testimonialOptions.right);
                $fabric.addIText(this.$.mobile.text.right, textOptions['people']['right']);

                // set model mobile dimension
				// =================================
                this.$.mobile.dimensions = {
                    app: { width : screenshotOptions.width, height: screenshotOptions.height },
                    qr : { width : qrOptions.iphone.width, height: qrOptions.iphone.height },
                    testimonial: { width : testimonialOptions.left.width, height: testimonialOptions.left.height }
                };

                // generate QR
				// =================================
                this._generateQR('iphone');
                this._generateQR('android');
			}
		},
		_getMetaValue: function(obj, key) {
			var data = obj.data.meta.data;
			var value = $.grep(data, function(e){ 
				return e['meta_key'] == key; 
			});
			return value[0]['meta_value'];
		},
		_generateQR: function( name, url ){
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
            
            this.$timeout(function(){
	            // set qr image to object
	            self._setObjectImage('qr-'+name, imgDataURI, function(){
	                qr.url = url;
	                qr.loading = false;
	            	self._qrcodeElement.empty();
	            });
            }, 1000);
        },
		_setObjectImage: function( objectName, src, callback ){
            var fabric = this.$.fabric;

            this.$log.debug('fabric', this.$.fabric.canvas.getObjects());

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
		_fromJSON: function(callback) {
			this.$.fabric.canvasOriginalWidth  = this.$.fromJSON.originalWidth;
        	this.$.fabric.canvasOriginalHeight = this.$.fromJSON.originalHeight;
        	this.$.fabric.canvasScale = 0.3;
        	this.$.fabric.loadJSON(this.$.fromJSON, callback);
		}
  	});

	// Controller Modal Photo 
	// =========================
	app.classy.controller({
		extends: 'SplashMobileCtrl',
		name   : 'ModalPhotoSplashMobileCtrl',
		inject : ['$modalInstance'],
		_position: null,
		init: function() {
			// this._super(arguments);

            this.$log.debug('ModalPhotoSplashMobileCtrl', this);

			this._position = this.mobile.position;
        	this.$.fabric  = this.mobile.fabric;
			this.$.mobile  = this.mobile.data;
            this.$.photoIndex = null;

            this.$.uploadOptions = {
            	data: {
            		id 	  : 'avatar',
                	name  : 'testimonial',
            		width : this.$.mobile.dimensions.testimonial.width,
            		height: this.$.mobile.dimensions.testimonial.height,
            		unique: true
            	}
            };
		},
		watch: {
			'mobile.photos': function(photos){
            	this.$log.debug('mobile.photos', photos);
            }
		},
		selected: function(selected) {
			this.$.photoIndex = selected;
            this._setPhoto(selected, this._position);
		},
		ok: function() {
			this.$modalInstance.close();
		},
		cancel: function() {
			this.$modalInstance.dismiss('cancel'); 
		},
        _setPhoto: function(photoIndex, position) {
        	var self = this;

        	var img = this.$.mobile.photos[photoIndex];
        	self.$.mobile.images.testimonials[position] = img;
            self._setObjectImage( 'testimoni-pic-'+position, img );
        },
        _setObjectImage: function() {
			this._super(arguments);
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
			'SaveMobile',
			'data',
		],
		init: function() {
        	var self = this;

            this.$log.debug('ModalSaveSplashMobileCtrl', this);

			this.$.loading 	= this.data.loading;
			this.$.id 		= this.data.id;
            this.$.mobile  	= this.data.mobile;
            this.$.fabric  	= this.data.fabric;

            this.$.data = {
            	title 		: this.$.mobile.text.app,
            	description : '',
            	screenshot 	: this.$.fabric.canvas.toDataURL(),
            	meta 		: [{
	        		'meta_key'  : 'mobile',
	        		'meta_value': self.$.mobile
	        	},{
	        		'meta_key'  : 'config',
	        		'meta_value': self.$.fabric.getJSON( true )
	        	}]
            };

            this.$log.debug('data', self.$.data);
		},
        save: function() {
        	var self = this;

        	var API = this.API;

        	this.$.loading.load = true;
        	this.$.loading.message = 'Generating screenshot...';

            var isModified = this.$.fabric.isDirty();

        	// create blob image file
			var file  = this.$.fabric.getCanvasBlobFile('image/jpeg');
			// file.name = this.Helpers.slugify(this.$.data.title);
			file.name = 'poster';

        	// upload screenshot
			this.$upload.upload({
                url    : API.URL + '/upload',
                method : 'POST',
                data   : { id:self.$.id },
                file   : file,
                fileFormDataName: 'image'
            }).then(function(response) {
                self.$log.debug('upload:response', response);

        		self.$.loading.message = 'Saving configuration...';

        		// set data screenshot url
        		self.$.data.screenshot = response.data.url;

        		// save configuration
                self.SaveMobile(self.$.data).then(function(response){
            		self.$log.debug('save:response', response);

            		angular.extend(self.$.data, {id:response.id});

            		// update model left menu
        			self.$rootScope.menus.left.model.data.push(self.$.data);

            		self.$.loading.load = false;
        			self.$.loading.message = 'Please wait';

                    self.$modalInstance.close();
                });

            }, function(response) {
                self.$log.error('upload:success', response);
            }, function(evt) {
                // Math.min is to fix IE which reports 200% sometimes
                var Progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                self.$log.info('upload:progress', Progress);
            });
        },
        cancel: function() {
        	this.$modalInstance.dismiss('cancel');
        }
	});
});
