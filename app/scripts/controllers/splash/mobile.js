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
    	'$scope', 
    	'$http', 
    	'$timeout',

    	'Postermobile',
    	'RecentMobilePhotos',
    	'$modal',

    	'Fabric', 
    	'FabricConstants', 
    	'Keypress',
    	function ($scope, $http, $timeout, Postermobile, RecentMobilePhotos, $modal, Fabric, FabricConstants, Keypress) {

			$scope.accordion = {
				closeOthers : true,
				isFirstOpen: true
			};
			$scope.dropdown = {
				sizeIsOpen: false,
				fontIsOpen: false
			};


			$scope.fabric = {};
			$scope.FabricConstants = FabricConstants;

			$scope.mobile = Postermobile.model;
			$scope.FabricConstants.presetSizes = Postermobile.presetSizes;
			$scope.FabricConstants.CustomAttributes = Postermobile.CustomAttributes;

			//
            // Watchers
            // ================================================================
			$scope.$watch('fabric.presetSize', function(size){
				console.log('fabric.presetSize', size);
			});
			$scope.$watch('fabric.canvasScale', function(length){
				$scope.fabric.setZoom();
			});
			$scope.$watch('fabric.controls.angle', function(value){
				$scope.fabric.angleControl();
			});
			$scope.$watch('fabric.controls.left', function(value){
				// if( value < 0) $scope.fabric.controls.left = 0;
				// else if ( value > $scope.fabric.maxBounding.left) $scope.fabric.controls.left = $scope.fabric.maxBounding.left;
				$scope.fabric.leftControl();
			});
			$scope.$watch('fabric.controls.top', function(value){
				// if( value < 0) $scope.fabric.controls.top = 0;
				// else if ( value > $scope.fabric.maxBounding.top) $scope.fabric.controls.top = $scope.fabric.maxBounding.top;
				$scope.fabric.topControl();
			});
			$scope.$watch('fabric.controls.scale', function(value){
				$scope.fabric.scaleControl();
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
                $scope.screenshotuUloadOptions.data.name  += '_' + $scope.fabric.presetSize.type;
                $scope.screenshotuUloadOptions.data.width = dimension.width;
                $scope.screenshotuUloadOptions.data.height = dimension.height;
            });

            $scope.screenshotuUloadOptions = {
            	headers: {},
            	data   : {
                	name  : 'mobile_screenshot',
            		width : null,
            		height: null
            	}
            };


			//
			// Editing Canvas Size
			// ================================================================
			$scope.selectCanvas = function() {
				$scope.canvasCopy = {
					width: $scope.fabric.canvasOriginalWidth,
					height: $scope.fabric.canvasOriginalHeight
				};
			};

			$scope.setCanvasSize = function() {
				$scope.fabric.setCanvasSize($scope.canvasCopy.width, $scope.canvasCopy.height);
				$scope.fabric.setDirty(true);
				delete $scope.canvasCopy;
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
			};

			$scope.$on('canvas:created', $scope.init);

			Keypress.onSave(function() {
				$scope.updatePage();
			});
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
						if( type == 'people' ){
							object.width  = attributes.width;
							object.height = attributes.height;
						}
						object.left   = attributes.left;
						object.top    = attributes.top;
						object.hasControls = false;
						if( type == 'people'){
							object.clipTo = function(ctx) {
							    ctx.arc(0, 0, object.width / 2 , 0, 2*Math.PI, true);
							};
						}
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
					var qrIphone = qr['iphone'];
					 $scope.fabric.addImage('images/'+ qrIphone.width +'x'+ qrIphone.height +'.jpg', function(object){
                        callbackImage( object, 'qr-iphone', 'qr', 'iphone' );
                    });
                    var qrAndroid = qr['android'];
                    $scope.fabric.addImage('images/'+ qrAndroid.width +'x'+ qrAndroid.height +'.jpg', function(object){
                        callbackImage( object, 'qr-android', 'qr', 'android' );
                    });

					// add testimoni pic n text Left
                    var imgTestimonialLeft = $scope.mobile.images.testimonials.left ? 
                                        'images/upload/mobile_testimonial_left.jpg' :
                                        'images/'+ testimoniDimension.width +'x'+ testimoniDimension.height +'.jpg' ;
                    $scope.fabric.addImage(imgTestimonialLeft, function(object){
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
                    // add testimoni pic n text Right
                    var imgTestimonialRight = $scope.mobile.images.testimonials.right ? 
                                        'images/upload/mobile_testimonial_right.jpg' :
                                        'images/'+ testimoniDimension.width +'x'+ testimoniDimension.height +'.jpg' ;
                    $scope.fabric.addImage(imgTestimonialRight, function(object){
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

                    // set QR
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
            $scope.mobile.onFocusQR = function(e){
                currentQRURL = e.target.value;
            };
            $scope.mobile.onKeyUpQR = function(e){
                var name  = e.target.name;
                var valid = e.target.validity.valid;
                $scope.mobile.qr[name].valid = e.target.validity.valid;
            };
            $scope.mobile.onBlurQR = function(e){
                var name = e.target.name;
                var url  = e.target.value;

                // if url is valid && url not same before
                if( e.target.validity.valid && currentQRURL != url ){

                    mobileGenerateQR(name, url);

                }
            };

            // Ui Bootstrap Modal
            // Set Photo
            // ================================================================

            $scope.$watch('mobile.photos', function(photos){
            	console.log('mobile.photos', photos);
            });

            $scope.mobile.getPhoto = function(peopleIndex) {
                var modalInstance = $modal.open({
                    templateUrl: 'modalInsertPhoto.html',
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
                img.src = window.apiURL + "/images/upload/" + $scope.mobile.photos[photoIndex];
            };

    }]);
});
