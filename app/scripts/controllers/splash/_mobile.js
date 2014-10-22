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

  angular.module('bannerAppApp.controllers.SplashMobileCtrl', [
  		'common.fabric',
  		'common.fabric.utilities',
  		'common.fabric.constants'
  	])
    .controller('SplashMobileCtrl', [
    	'$rootScope',
    	'$scope', 
    	'$http', 
    	'$log',
    	'$timeout',
    	'API',

    	'Postermobile',
    	'RecentMobilePhotos',
    	'SaveMobile',
    	'$modal',
    	'slidePush',

    	'Fabric', 
    	'FabricConstants', 
    	'Keypress',

    	'mobile',
    	function (
    		$rootScope, $scope, $http, $log, $timeout, 
    		API, Postermobile, RecentMobilePhotos, SaveMobile, $modal, slidePush, 
    		Fabric, FabricConstants, Keypress, mobile) {

    		$log.debug('mobile', mobile);

    		var self = this;

            this.qrcodeElement = angular.element('#qrcode');

    		this.getMetaValue = function(obj, key) {
    			var data = obj.data.meta.data;
    			var value = $.grep(data, function(e){ 
    				return e['meta_key'] == key; 
    			});
    			return value[0]['meta_value'];
    		};

            this.mobileGenerateQR = function( name, url ){
                var qr = $scope.mobile.qr[name];

                if( url == null ) url = qr.url;

                if( url == null ) return;

                qr.loading = true;
                self.qrcodeElement.qrcode({
                    "render": "canvas",
                    "width" : $scope.mobile.dimensions.qr.width,
                    "height": $scope.mobile.dimensions.qr.height,
                    "color" : "#3a3",
                    "text"  : url
                });
                
                var canvasQR   = self.qrcodeElement.find('canvas')[0],
                	imgDataURI = canvasQR.toDataURL('image/jpeg');

                // set qr image to object
                self.setObjectImage('qr-'+name, imgDataURI, function(){
                    qr.url = url;
                    qr.loading = false;
                	self.qrcodeElement.empty();
                });
            };

			this.setObjectImage = function( objectName, src, callback ){
                var fabric = $scope.fabric;

                var object = fabric.getObjectByName(objectName);
                if ( !object ) return;

                object.getElement().src = src;
                object.opacity = 1;
                fabric.render();

                if( callback ) callback();
            };

			$scope.isNew = true;

            $scope.screenshotUploadOptions = {
            	data: {
                	name  : 'mobile_screenshot',
            		width : null,
            		height: null
            	}
            };

			// ================================================================
            // Slide menus
            // ================================================================

    		$scope.mobiles = {};
    		$scope.mobiles.data = mobile.all.data;
    		$scope.mobiles.delete = function($index){
    			if(confirm('Are you sure ?')) {
    				delete $scope.mobiles.data[$index];
    			}
    		};

			$rootScope.menus = {
				top: {
	                model   : $scope,
	                template: '<div ng-include src="\'views/splash/mobile-menu-top.html\'"></div>'
				},
				left: {
					model : $scope.mobiles,
	                template: '<div ng-include src="\'views/splash/mobile-menu-left.html\'"></div>'
				}
            };

            $scope.toggleLeftMenu = function(forceClose) {
				var id = 'menu-left';
				if(forceClose === true) {
					slidePush.pushForceCloseById(id);
					return;
				}

				if( slidePush.isOpenById(id) ) {
					slidePush.pushForceCloseById(id);
				} else {
					slidePush.pushById(id);
				}
            }
			$scope.toggleControls = function(){
				var id = 'menu-top';
				var scroll = 0;
				if( slidePush.isOpenById(id) ) {
					slidePush.pushForceCloseById(id);
				} else {
					if( !$scope.fabric.selectedObject ) return;

					slidePush.pushById(id);
					// scroll = angular.element('.image-builder').offset().top;
					scroll = 330;
				}
				// angular.element("body").animate({ scrollTop: scroll }, "slow");
			};
			$scope.resetControls = function(){
				var fabric = $scope.fabric;
				var object = fabric.selectedObject;
				var size   = fabric.presetSize;

				var controls = Postermobile.CustomAttributes[size.type][size.ppi];
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
			};
			$scope.deselectObject = function(){
				var id = 'menu-top';
				$scope.fabric.deactivateAll();
				if( slidePush.isOpenById(id) ) {
					slidePush.pushForceCloseById(id);
				}
			}
            // ================================================================

			FabricConstants.presetSizes = Postermobile.presetSizes;
			FabricConstants.CustomAttributes = Postermobile.CustomAttributes;

			$scope.fabric = {};
			$scope.FabricConstants = FabricConstants;

			//
			// Init
			// ================================================================

			this.init = function() {
				$log.info('initialize canvas:created');
				
				$scope.fabric = new Fabric({
					JSONExportProperties: FabricConstants.JSONExportProperties,
					textDefaults: FabricConstants.textDefaults,
					shapeDefaults: FabricConstants.shapeDefaults,
					CustomAttributes: FabricConstants.CustomAttributes,
					onChangeCanvasSize: self.onChangeCanvasSize
				});

				Keypress.onSave(function(){  $scope.save() });
				Keypress.onControls({
					up: function(){
						if( $scope.fabric.selectedObject ) {
							$scope.fabric.controls.top -= 1;
							$scope.$apply();
							$log.debug('up', $scope.fabric.controls.top);
						}
					},
					down: function(){
						if( $scope.fabric.selectedObject ) {
							$scope.fabric.controls.top += 1;
							$scope.$apply();
							$log.debug('down', $scope.fabric.controls.top);
						}
					},
					left: function(){
						if( $scope.fabric.selectedObject ) {
							$scope.fabric.controls.left -= 1;
							$scope.$apply();
							$log.debug('left', $scope.fabric.controls.left);
						}
					},
					right: function(){
						if( $scope.fabric.selectedObject ) {
							$scope.fabric.controls.left += 1;
							$scope.$apply();
							$log.debug('right', $scope.fabric.controls.left);
						}
					}
				});

	    		// new or edit mobile configuration
				$scope.mobile   = mobile.detail ? self.getMetaValue(mobile.detail, 'mobile') : Postermobile.model;
	            $scope.fromJSON = mobile.detail ? self.getMetaValue(mobile.detail, 'config') : null;

	            // edit
	            if( $scope.fromJSON ){
	            	$scope.isNew = false;
	            	$scope.fabric.presetSize = Postermobile.presetSizes[1];
	            	$scope.loadJSON();
                	// generate qr code
	            	self.mobileGenerateQR('iphone');
                    self.mobileGenerateQR('android');
	            }

				//
	            // Watchers
	            // ================================================================
				$scope.$evalAsync(
	                function( $scope ) {

	                    $log.log( "$evalAsync", $scope );

	                    $scope.$watch('fabric.presetSize', function(size){
							$log.debug('fabric.presetSize', size);
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
			                $log.debug('mobile.images.screenshot', image);
			                self.setObjectImage( 'app-screenshot', image );
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
			                $log.debug('mobile.dimensions.app', dimension);
			                if( !dimension ) return;
			                // $scope.screenshotUploadOptions.data.name  += '_' + $scope.fabric.presetSize.type;
			                $scope.screenshotUploadOptions.data.width = dimension.width;
			                $scope.screenshotUploadOptions.data.height = dimension.height;
			            });
	                }
	            );
			};
			// create new fabric objects on change canvas size
			this.onChangeCanvasSize = function( _fabric ){
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
                    $scope.mobile.dimensions = {
                        app: { width : ss.width, height: ss.height },
                        testimonial: { width : testimoniDimension.width, height: testimoniDimension.height },
                        qr: { width: qr.iphone.width, height: qr.iphone.height }
                    };

					// screenshot
                    var screenshot = $scope.mobile.images.screenshot ? 
                                        'images/upload/mobile_screenshot.png' :
                                        'images/'+ ss.width +'x'+ ss.height +'.jpg' ;

                    $scope.fabric.addImage(screenshot, function(object){
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
					$scope.fabric.addText($scope.mobile.text.app, function(object){
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
					 $scope.fabric.addImage('images/'+ qrIphone.width +'x'+ qrIphone.height +'.jpg', function(object){
                        callbackImage( object, 'qr-iphone', 'qr', 'iphone' );
                    });
                    var qrAndroid = qr['android'];
                    $scope.fabric.addImage('images/'+ qrAndroid.width +'x'+ qrAndroid.height +'.jpg', function(object){
                        callbackImage( object, 'qr-android', 'qr', 'android' );
                    });

					// add testimoni image-cirlcle & text Left
					// =================================
                    var imgTestimonialLeft = $scope.mobile.images.testimonials.left ? 
                                        'images/upload/mobile_testimonial_left.jpg' :
                                        'images/'+ testimoniDimension.width +'x'+ testimoniDimension.height +'.jpg' ;
                    $scope.fabric.addImageCircle(imgTestimonialLeft, function(object){
                        callbackImage( object, 'testimoni-pic-left', 'people', 'left' );
                    });
                    $scope.fabric.addIText($scope.mobile.text.left, function(object){
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
                    var imgTestimonialRight = $scope.mobile.images.testimonials.right ? 
                                        'images/upload/mobile_testimonial_right.jpg' :
                                        'images/'+ testimoniDimension.width +'x'+ testimoniDimension.height +'.jpg' ;
                    $scope.fabric.addImageCircle(imgTestimonialRight, function(object){
                        callbackImage( object, 'testimoni-pic-right', 'people', 'right' );
                    });
                    $scope.fabric.addIText($scope.mobile.text.right, function(object){
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
                    self.mobileGenerateQR('iphone');
                    self.mobileGenerateQR('android');
				}
			}

			// canvas created
			$scope.$on('canvas:created', self.init);

            //
            // QR Code image (UI_EVENT)
            // ================================================================

            var currentQRURL = null;
            $scope.onFocusQR = function(e){
                currentQRURL = e.target.value;
            };
            $scope.onKeyUpQR = function(e){
                var name  = e.target.name;
                var valid = e.target.validity.valid;
                $scope.mobile.qr[name].valid = e.target.validity.valid;
            };
            $scope.onBlurQR = function(e){
                var name = e.target.name;
                var url  = e.target.value;
                // if url is valid && url not same before
                if( e.target.validity.valid && currentQRURL != url ){
                    self.mobileGenerateQR(name, url);
                }
            };

            // Ui Bootstrap Modal
            // ================================================================

            $scope.getPhoto = function(peopleIndex) {
                var modalInstance = $modal.open({
                    // templateUrl: 'modalInsertPhoto.html',
                    templateUrl: 'views/splash/mobile-modal-photo.html',
                    controller: function($scope, $modalInstance, $timeout, data) {
                        $scope.mobile = data.mobile;
                        $scope.photoIndex = null;
                        $scope.uploadOptions = {
                        	data   : {
	                        	name  : 'mobile_testimonial',
	                    		width : $scope.mobile.dimensions.testimonial.width,
	                    		height: $scope.mobile.dimensions.testimonial.height,
	                    		unique: true
                        	}
                        };

                        $log.debug($scope);
                        $scope.selected = function($index) {
                            $scope.photoIndex = $index;
                            self.setPhoto($index, peopleIndex);
                        };
                        $scope.ok = function() {
                            $modalInstance.close({
                                peopleIndex: peopleIndex
                            });
                        };
                        $scope.cancel = function() {
                            $modalInstance.dismiss('cancel'); 
                        };

                        $scope.$watch('mobile.photos', function(photos){
                        	$log.debug('mobile.photos', photos);
                        });
                    },
                    size: null,
                    resolve: {
                        data: function(RecentMobilePhotos, $rootScope, $timeout){
                            $log.debug($scope.mobile);
                            if( $scope.mobile.photos.length ){
                                return {
                                    mobile: $scope.mobile
                                };
                            } else {
                                // get mobile photos from 'upload' directory with 'RecentMobilePhotos'
                                $rootScope.isLoading = true;
                                return RecentMobilePhotos().then(function(photos){
                                    // set into splash photos
                                    $rootScope.isLoading = false;
                                    $scope.mobile.photos = photos.data;
                                    return {
                                        mobile: $scope.mobile
                                    };
                                })
                            }
                        }
                    }
                });
                modalInstance.result.then(function(index) {
                    // $log.debug(index);
                });
            };

            self.setPhoto = function(photoIndex, index) {
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
                    $scope.mobile.images.testimonials[index] = imgDataURI;
                    self.setObjectImage( 'testimoni-pic-'+index, imgDataURI );
                };
				img.crossOrigin = "Anonymous";
                img.src = $scope.mobile.photos[photoIndex];
            };

            $scope.saveConfig = function(){
            	var modalInstance = $modal.open({
                    templateUrl: 'views/splash/mobile-modal-save.html',
                    controller: function($scope, $rootScope, $modalInstance, $route, $timeout, $log, $upload, Helpers, API, data) {

                        $scope.loading = data.loading;
                        $scope.mobile  = data.mobile;
                        $scope.fabric  = data.fabric;

                        $scope.data = {
                        	title 		: $scope.mobile.text.app,
                        	screenshot 	: $scope.fabric.canvas.toDataURL(),
                        };

                        var isNew = data.isNew;
                        var isModified = $scope.fabric.isDirty();

                		var urlMobile = API.URL + '/splash/mobiles',
                			methodMobile = 'POST';
                		// is update
                		if(!isNew) {
                			methodMobile = 'PUT';
                			urlMobile += '/'+ $route.current.params.mobileId;
                		}

                        $scope.save = function() {
                        	$scope.loading.load = true;
                        	$scope.loading.message = 'Generating image...';

                        	// create blob image file
							var file = $scope.fabric.getCanvasBlobFile('image/jpeg');
							file.name = Helpers.slugify($scope.data.title);
                        	// upload screenshot
							$upload.upload({
                                url    : API.URL + '/upload',
                                method : 'POST',
                                file   : file,
                                fileFormDataName: 'image'
                            }).then(function(response) {
                                $log.debug('response', response);
                        		$scope.loading.message = 'Saving configuration...';

                        		$scope.data.screenshot = response.data.url;
	                        	$scope.data['meta'] = [{
	                        		'meta_key'  : 'mobile',
	                        		'meta_value': $scope.mobile
	                        	},{
	                        		'meta_key'  : 'config',
	                        		'meta_value': $scope.fabric.getJSON( true )
	                        	}];

                        		// save configuration
                        		$http({
                        			method	: methodMobile,
                        			url 	: urlMobile,
                        			data 	: $scope.data
                        		})
                                SaveMobile($scope.data).then(function(response){
	                        		$log.debug('save:response', response);

	                        		$rootScope.safeApply(function(){
	                        			$rootScope.menus.left.model.data.push($scope.data);
	                        		});
	                        		$scope.loading.load = false;
                        			$scope.loading.message = 'Please wait';

		                            $modalInstance.close();
		                        });

                            }, function(response) {
                                $log.error('response', response);
                            }, function(evt) {
                                // Math.min is to fix IE which reports 200% sometimes
                                var Progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                                $log.info('response', Progress);
                            });
                        };
                        $scope.cancel = function() {
                            $modalInstance.dismiss('cancel'); 
                        };
                    },
                    size: null,
                    resolve: {
                    	data: function(){
                    		return {
                    			loading: {
		                        	load: false,
		                        	message: 'Please wait'
		                        },
                    			mobile: $scope.mobile,
                    			fabric: $scope.fabric,
                    			isNew : $scope.isNew
	                        };
                    	}
                    }
                });
                modalInstance.result.then(function(){ 
                	$scope.toggleLeftMenu();
                });
            };

            //
            // toJSON
            // ================================================================
            $scope.getJSON = function(){
            	var jsonString = $scope.fabric.getJSON();
            	return JSON.parse(jsonString);
            };

            $scope.loadJSON = function(){
            	$scope.fabric.canvasOriginalWidth = 2480;
            	$scope.fabric.canvasOriginalHeight = 3508;
            	$scope.fabric.canvasScale = 0.3;
            	$scope.fabric.loadJSON($scope.fromJSON);
            };

            //
            // Generate Poster
            // ================================================================
            $scope.loading = false;
            $scope.generatePoster = function( id ){
                var fabric = $scope.fabric;

            	$scope.loading = true;
                $timeout(function(){
	                // Stops active object outline from showing in image
	                fabric.deactivateAll();

	                var initialCanvasScale = fabric.canvasScale;
	                fabric.resetZoom();

	                var name = 'poster-default';
	                if( fabric.presetSize.type ){
	                    name = $scope.mobile.text.app.replace(/\s/g, '-') + ' ' + fabric.presetSize.name;
	                    name = name.replace(/\s/g, '_');
	                }

	                // create blob URL, then set into anchor download link
	                var blob = $scope.mobile.poster = fabric.getCanvasBlob();
	                var anchor = document.getElementById(id);
	                anchor.download = name + ".png";
	                anchor.href = blob;

            		$scope.loading = false;
                	$scope.mobile.disable.generate = false;
	                $scope.mobile.disable.download = false;

	                fabric.canvasScale = initialCanvasScale;
	                fabric.setZoom();
                }, 3000);
            }

    }]);
});
