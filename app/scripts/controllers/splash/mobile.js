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
    	'BASEURL',

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
    		BASEURL, Postermobile, RecentMobilePhotos, SaveMobile, $modal, slidePush, 
    		Fabric, FabricConstants, Keypress, mobile) {

    		$log.debug('mobile', mobile);
    		$scope.mobiles = {};
    		$scope.mobiles.data = mobile.all;
    		$scope.mobiles.delete = function($index){
    			if(confirm('Are you sure ?')) {
    				delete $scope.mobiles.data[$index];
    			}
    		};

    		var self = this;

			$scope.accordion = {
				closeOthers: true,
				isFirstOpen: true
			};
			$scope.dropdown = {
				sizeIsOpen: false,
				fontIsOpen: false
			};

			$scope.fabric = {};
			$scope.FabricConstants = FabricConstants;

			$scope.mobile   = mobile.detail ? mobile.detail.mobile : Postermobile.model;
            $scope.fromJSON = mobile.detail ? mobile.detail.config : null;

			$scope.FabricConstants.presetSizes = Postermobile.presetSizes;
			$scope.FabricConstants.CustomAttributes = Postermobile.CustomAttributes;

			//
            // Slide menus
            // ================================================================
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

			//
            // Controls
            // ================================================================
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

			//
            // Watchers
            // ================================================================
			$scope.$watch('fabric.presetSize', function(size){
				console.log('fabric.presetSize', size);
			});
			$scope.$watch('fabric.canvasScale', function(length){
				$timeout(function(){
					$scope.fabric.setZoom();
				}, 1000);
			});
			$scope.$watch('fabric.controls.angle', function(value){
				$timeout(function(){
					$scope.fabric.angleControl();
				}, 1000);
			});
			$scope.$watch('fabric.controls.left', function(value){
				// if( value < 0) $scope.fabric.controls.left = 0;
				// else if ( value > $scope.fabric.maxBounding.left) $scope.fabric.controls.left = $scope.fabric.maxBounding.left;
				$timeout(function(){
					$scope.fabric.leftControl();
				}, 1000);
			});
			$scope.$watch('fabric.controls.top', function(value){
				// if( value < 0) $scope.fabric.controls.top = 0;
				// else if ( value > $scope.fabric.maxBounding.top) $scope.fabric.controls.top = $scope.fabric.maxBounding.top;
				$timeout(function(){
					$scope.fabric.topControl();
				}, 1000);
			});
			$scope.$watch('fabric.controls.scale', function(value){
				$timeout(function(){
					$scope.fabric.scaleControl();
				}, 1000);
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
            $scope.$watch('mobile.images.screenshot', function(image){
                if( image == null ) return;
                console.log('mobile.images.screenshot', image);
                setObjectImage( 'app-screenshot', image.dataURI);
            });
            $scope.$watchCollection('mobile.dimensions.app', function(dimension){
                console.log('mobile.dimensions.app', dimension);
                if( !dimension ) return;
                // $scope.screenshotUploadOptions.data.name  += '_' + $scope.fabric.presetSize.type;
                $scope.screenshotUploadOptions.data.width = dimension.width;
                $scope.screenshotUploadOptions.data.height = dimension.height;
            });

            $scope.screenshotUploadOptions = {
            	headers: {},
            	data   : {
                	name  : 'mobile_screenshot',
            		width : null,
            		height: null
            	}
            };

			//
			// Init
			// ================================================================
			$scope.init = function() {
				$scope.fabric = new Fabric({
					JSONExportProperties: FabricConstants.JSONExportProperties,
					textDefaults: FabricConstants.textDefaults,
					shapeDefaults: FabricConstants.shapeDefaults,
					json: {},
					CustomAttributes: FabricConstants.CustomAttributes,
					onChangeCanvasSize: onChangeCanvasSize
				});

	            if( $scope.fromJSON ){
	            	$scope.fabric.presetSize = Postermobile.presetSizes[1];
	            	$scope.loadJSON();

	            	mobileGenerateQR('iphone');
                    mobileGenerateQR('android');
	            }
			};

			$scope.$on('canvas:created', $scope.init);

			Keypress.onSave(function(){  $scope.save() });
			Keypress.onControls({
				up: function(){
					if( $scope.fabric.selectedObject ) {
						$scope.fabric.controls.top -= 1;
						$scope.$apply();
						console.log('up', $scope.fabric.controls.top);
					}
				},
				down: function(){
					if( $scope.fabric.selectedObject ) {
						$scope.fabric.controls.top += 1;
						$scope.$apply();
						console.log('down', $scope.fabric.controls.top);
					}
				},
				left: function(){
					if( $scope.fabric.selectedObject ) {
						$scope.fabric.controls.left -= 1;
						$scope.$apply();
						console.log('left', $scope.fabric.controls.left);
					}
				},
				right: function(){
					if( $scope.fabric.selectedObject ) {
						$scope.fabric.controls.left += 1;
						$scope.$apply();
						console.log('right', $scope.fabric.controls.left);
					}
				}
			});

			function onChangeCanvasSize( self ){

				var canvas  = self.canvas;
				canvas.backgroundImage = null;
				self.clearCanvas();

				if( self.presetSize && self.presetSize.hasOwnProperty('type') ){

					// if is paper a4 / a5, set canvas scale
					var initialCanvasScale = self.canvasScale = 0.3;

					// set background image
					var backgroundImageName = 'stiker_'+ self.presetSize.type +'_'+ self.presetSize.width +'x'+ self.presetSize.height +'.jpg';
					canvas.setBackgroundImage( 'images/'+ backgroundImageName, canvas.renderAll.bind(canvas), {
						scaleX: initialCanvasScale,
						scaleY: initialCanvasScale
					});

					// get QR Properties
					var type = self.presetSize.type;
					var ppi  = self.presetSize.ppi;
					var CustomAttributes = self.CustomAttributes[type];

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
                    mobileGenerateQR('iphone');
                    mobileGenerateQR('android');
					
				}
			}
			function setObjectImage( objectName, src, callback ){
                var fabric = $scope.fabric;

                var object = fabric.getObjectByName(objectName);

                if ( !object ) return;

                object.getElement().src = src;
                object.opacity = 1;
                fabric.render();

                if( callback ) callback();
            }
            function mobileGenerateQR( name, url ){
                var qr = $scope.mobile.qr[name];

                if( url == null ) url = qr.url;

                if( url == null ) return;

                qr.loading = true;
                $timeout(function(){
                    qrcode.qrcode({
                        "render": "canvas",
                        "width" : $scope.mobile.dimensions.qr.width,
                        "height": $scope.mobile.dimensions.qr.height,
                        "color" : "#3a3",
                        "text"  : url
                    });
                    var canvasQR   = qrcode.find('canvas')[0];
                    var imgDataURI = canvasQR.toDataURL('image/jpeg');
                    qrcode.empty();

                    // set qr image to object
                    setObjectImage('qr-'+name, imgDataURI, function(){
                        qr.url = url;
                        qr.loading = false;
                    });
                }, 1000);
            }

            //
            // QR Code image (UI_EVENT)
            // ================================================================
            var qrcode = angular.element('#qrcode');

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

                    mobileGenerateQR(name, url);

                }
            };

            // Ui Bootstrap Modal
            // ================================================================

            // $scope.$watch('mobile.photos', function(photos){
            // 	console.log('mobile.photos', photos);
            // });

            $scope.getPhoto = function(peopleIndex) {
                var modalInstance = $modal.open({
                    // templateUrl: 'modalInsertPhoto.html',
                    templateUrl: 'views/splash/mobile-modal-photo.html',
                    controller: function($scope, $modalInstance, $timeout, data) {
                        $scope.mobile = data.mobile;
                        $scope.photoIndex = null;
                        $scope.uploadOptions = {
                        	headers: {},
                        	data   : {
	                        	name  : 'mobile_testimonial',
	                    		width : $scope.mobile.dimensions.testimonial.width,
	                    		height: $scope.mobile.dimensions.testimonial.height,
	                    		unique: {
	                    			key: 'mobile_testimonial'
	                    		}
                        	}
                        };
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
                        	console.log('mobile.photos', photos);
                        });
                    },
                    size: null,
                    resolve: {
                        data: function(RecentMobilePhotos, $rootScope, $timeout){
                            console.log($scope.mobile);
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
                                    $scope.mobile.photos = photos;
                                    return {
                                        mobile: $scope.mobile
                                    };
                                })
                            }
                        }
                    }
                });
                modalInstance.result.then(function(index) {
                    // console.log(index);
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
                    setObjectImage( 'testimoni-pic-'+index, imgDataURI );
                };
				img.crossOrigin = "Anonymous";
                img.src = BASEURL + "/images/upload/" + $scope.mobile.photos[photoIndex];
            };

            $scope.save = function(){
            	var modalInstance = $modal.open({
                    // templateUrl: 'modalSave.html',
                    templateUrl: 'views/splash/mobile-modal-save.html',
                    controller: function($scope, $rootScope, $modalInstance, $timeout, $log, $upload, BASEURL, data) {

                    	$log.debug('data', data);

                        $scope.loading = data.loading;
                        $scope.mobile  = data.mobile;
                        $scope.fabric  = data.fabric;

                        $scope.data = {
                        	title : $scope.mobile.text.app,
                        	image : $scope.fabric.canvas.toDataURL(),
                        };

                        function slugify(Text) {
						    return Text
							        .toLowerCase()
							        .replace(/[^\w ]+/g,'')
							        .replace(/ +/g,'-');
						};

                        $scope.save = function() {
                        	$scope.loading.load = true;
                        	$scope.loading.message = 'Generating image...';

                        	// create blob image file
							var file = $scope.fabric.getCanvasBlobFile('image/jpeg');
							file.name = slugify($scope.data.title);
                        	// upload screenshot
							$upload.upload({
                                url    : BASEURL + '/api/upload-test',
                                method : 'POST',
                                data   : {
                                	width : 'original',
                                	height: 'original'
                                },
                                file: file,
                                fileFormDataName: 'file'
                            }).then(function(response) {
                                $log.debug('response', response);
                        		$scope.loading.message = 'Saving configuration...';

                        		$scope.data.image = BASEURL + '/' + response.data.url;
	                        	$scope.data['meta'] = {
	                        		'mobile' : $scope.mobile,
	                        		'config' : $scope.fabric.getJSON( true )
	                    		};
                        		// save configuration
                                SaveMobile($scope.data).then(function(response){
	                        		console.log('save:response', response);

	                        		$rootScope.safeApply(function(){
	                        			$rootScope.menus.left.model.push({
		                        			image: $scope.data.image,
		                        			title: $scope.data.title
		                        		});
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
                    			fabric: $scope.fabric
	                        };
                    	}
                    }
                });
                modalInstance.result.then(function(){ });
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
