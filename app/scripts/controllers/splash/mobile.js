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
    	'$timeout',

    	'Postermobile',
    	'RecentMobilePhotos',
    	'SaveMobile',
    	'$modal',
    	'slidePush',

    	'Fabric', 
    	'FabricConstants', 
    	'Keypress',
    	function ($rootScope, $scope, $http, $timeout, Postermobile, RecentMobilePhotos, SaveMobile, $modal, slidePush, Fabric, FabricConstants, Keypress) {

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

			$scope.mobile = Postermobile.model;
			$scope.FabricConstants.presetSizes = Postermobile.presetSizes;
			$scope.FabricConstants.CustomAttributes = Postermobile.CustomAttributes;

			//
            // Slide menus
            // ================================================================
			$rootScope.menus = {
				top: {
	                model   : $scope,
	                template: '<div ng-include src="\'views/splash-mobile-top-config.html\'"></div>'
				},
				left: {
					model : [{
						name : 'App 1',
						image: 'http://lorempixel.com/300/300/abstract/1'
					},{
						name : 'App 2',
						image: 'http://lorempixel.com/300/300/abstract/2'
					},{
						name : 'App 3',
						image: 'http://lorempixel.com/300/300/abstract/3'
					},{
						name : 'App 4',
						image: 'http://lorempixel.com/300/300/abstract/4'
					},{
						name : 'App 5',
						image: 'http://lorempixel.com/300/300/abstract/5'
					},{
						name : 'App 6',
						image: 'http://lorempixel.com/300/300/abstract/6'
					},{
						name : 'App 7',
						image: 'http://lorempixel.com/300/300/abstract/7'
					}],
	                template: '<div class="container" style="padding-top:70px">'+
	                	'<div class="row">'+
						  	'<div class="col-lg-3 col-md-3" ng-repeat="obj in menus.left.model">'+
							    '<div class="thumbnail">'+
							      '<img ng-src="{{ obj.image }}" alt="...">'+
							      '<div class="caption">'+
							        '<h3>{{ obj.name }}</h3>'+
							        '<p><button class="btn btn-sm btn-primary">Button</button> '+ 
							        	'<button class="btn btn-sm btn-default">Button</button></p>'+
							      '</div>'+
							    '</div>'+
						  	'</div>'+
						'</div>'+
					'</div>'
				}
            };
			$scope.toggleControls = function(){
				var id = 'menu-top';
				var scroll = 0;
				if( slidePush.isOpenById(id) ) {
					slidePush.pushForceCloseById(id);
				} else {
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
                // $scope.screenshotuUloadOptions.data.name  += '_' + $scope.fabric.presetSize.type;
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
            // ================================================================

            // $scope.$watch('mobile.photos', function(photos){
            // 	console.log('mobile.photos', photos);
            // });

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

            $scope.mobile.save = function(){
            	var modalInstance = $modal.open({
                    templateUrl: 'modalSave.html',
                    controller: function($scope, $rootScope, $modalInstance, $timeout, data) {
                        $scope.loading = false;
                        $scope.data = data;

                        $scope.save = function() {
                        	$scope.loading = true;
                        	SaveMobile($scope.data).then(function(response){
                        		console.log('save:response', response);
                        		$scope.loading = false;

                        		$rootScope.menus.left.model.push({
                        			image: $scope.data.image,
                        			name: $scope.data.name
                        		});
                        		// $rootScope.$apply();
	                            // $modalInstance.close();
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
	                        	name : $scope.mobile.text.app,
	                        	image: $scope.fabric.canvas.toDataURL(),
	                        	value: $scope.mobile.getJSON()
	                        };
                    	}
                    }
                });
                modalInstance.result.then(function(){ });
            };

            //
            // toJSON
            // ================================================================
            $scope.mobile.getJSON = function(){
            	var jsonString = $scope.fabric.getJSON();
            	return JSON.parse(jsonString);
            };

            $scope.fromJSON = {  
				   "objects":[  
				      {  
				         "type":"text",
				         "originX":"left",
				         "originY":"top",
				         "left":964,
				         "top":360,
				         "width":554.46,
				         "height":123.5,
				         "fill":"#434343",
				         "stroke":"#434343",
				         "strokeWidth":1,
				         "strokeDashArray":null,
				         "strokeLineCap":"butt",
				         "strokeLineJoin":"miter",
				         "strokeMiterLimit":10,
				         "scaleX":1,
				         "scaleY":1,
				         "angle":0,
				         "flipX":false,
				         "flipY":false,
				         "opacity":1,
				         "shadow":null,
				         "visible":true,
				         "clipTo":null,
				         "backgroundColor":"",
				         "text":"Name of App",
				         "fontSize":95,
				         "fontWeight":"normal",
				         "fontFamily":"Arial",
				         "fontStyle":"",
				         "lineHeight":1.3,
				         "textDecoration":"",
				         "textAlign":"center",
				         "path":null,
				         "textBackgroundColor":"",
				         "useNative":true,
				         "name":"app-name"
				      },
				      {  
				         "type":"i-text",
				         "originX":"left",
				         "originY":"top",
				         "left":621,
				         "top":2537,
				         "width":506.52,
				         "height":273,
				         "fill":"#313131",
				         "stroke":"#313131",
				         "strokeWidth":1,
				         "strokeDashArray":null,
				         "strokeLineCap":"butt",
				         "strokeLineJoin":"miter",
				         "strokeMiterLimit":10,
				         "scaleX":1,
				         "scaleY":1,
				         "angle":0,
				         "flipX":false,
				         "flipY":false,
				         "opacity":0.5,
				         "shadow":null,
				         "visible":true,
				         "clipTo":null,
				         "backgroundColor":"",
				         "text":"Lorem ipsum dolor sit amet\nlorem ipsum dolor\namet consectetur\n\nYour Name",
				         "fontSize":42,
				         "fontWeight":"normal",
				         "fontFamily":"Arial",
				         "fontStyle":"",
				         "lineHeight":1.3,
				         "textDecoration":"",
				         "textAlign":"left",
				         "path":null,
				         "textBackgroundColor":"",
				         "useNative":true,
				         "styles":{  

				         },
				         "name":"testimoni-text-left"
				      },
				      {  
				         "type":"i-text",
				         "originX":"left",
				         "originY":"top",
				         "left":1761,
				         "top":2537,
				         "width":506.52,
				         "height":273,
				         "fill":"#313131",
				         "stroke":"#313131",
				         "strokeWidth":1,
				         "strokeDashArray":null,
				         "strokeLineCap":"butt",
				         "strokeLineJoin":"miter",
				         "strokeMiterLimit":10,
				         "scaleX":1,
				         "scaleY":1,
				         "angle":0,
				         "flipX":false,
				         "flipY":false,
				         "opacity":0.5,
				         "shadow":null,
				         "visible":true,
				         "clipTo":null,
				         "backgroundColor":"",
				         "text":"Lorem ipsum dolor sit amet\nlorem ipsum dolor\namet consectetur\n\nYour Name",
				         "fontSize":42,
				         "fontWeight":"normal",
				         "fontFamily":"arial",
				         "fontStyle":"",
				         "lineHeight":1.3,
				         "textDecoration":"",
				         "textAlign":"left",
				         "path":null,
				         "textBackgroundColor":"",
				         "useNative":true,
				         "styles":{  

				         },
				         "name":"testimoni-text-right"
				      },
				      {  
				         "type":"image",
				         "originX":"left",
				         "originY":"top",
				         "left":1316,
				         "top":1852,
				         "width":280,
				         "height":280,
				         "fill":"rgb(0,0,0)",
				         "stroke":null,
				         "strokeWidth":1,
				         "strokeDashArray":null,
				         "strokeLineCap":"butt",
				         "strokeLineJoin":"miter",
				         "strokeMiterLimit":10,
				         "scaleX":1,
				         "scaleY":1,
				         "angle":0,
				         "flipX":false,
				         "flipY":false,
				         "opacity":1,
				         "shadow":null,
				         "visible":true,
				         "clipTo":null,
				         "backgroundColor":"",
				         "src":"http://127.0.0.1:9000/images/280x280.jpg",
				         "filters":[  
				            {  
				               "type":"Tint",
				               "color":"#ffffff",
				               "opacity":0
				            }
				         ],
				         "crossOrigin":"anonymous",
				         "name":"qr-iphone"
				      },
				      {  
				         "type":"image",
				         "originX":"left",
				         "originY":"top",
				         "left":1914,
				         "top":1852,
				         "width":280,
				         "height":280,
				         "fill":"rgb(0,0,0)",
				         "stroke":null,
				         "strokeWidth":1,
				         "strokeDashArray":null,
				         "strokeLineCap":"butt",
				         "strokeLineJoin":"miter",
				         "strokeMiterLimit":10,
				         "scaleX":1,
				         "scaleY":1,
				         "angle":0,
				         "flipX":false,
				         "flipY":false,
				         "opacity":1,
				         "shadow":null,
				         "visible":true,
				         "clipTo":null,
				         "backgroundColor":"",
				         "src":"http://127.0.0.1:9000/images/280x280.jpg",
				         "filters":[  
				            {  
				               "type":"Tint",
				               "color":"#ffffff",
				               "opacity":0
				            }
				         ],
				         "crossOrigin":"anonymous",
				         "name":"qr-android"
				      },
				      {  
				         "type":"image",
				         "originX":"left",
				         "originY":"top",
				         "left":324,
				         "top":842,
				         "width":640,
				         "height":1138,
				         "fill":"rgb(0,0,0)",
				         "stroke":null,
				         "strokeWidth":1,
				         "strokeDashArray":null,
				         "strokeLineCap":"butt",
				         "strokeLineJoin":"miter",
				         "strokeMiterLimit":10,
				         "scaleX":1,
				         "scaleY":1,
				         "angle":0,
				         "flipX":false,
				         "flipY":false,
				         "opacity":1,
				         "shadow":null,
				         "visible":true,
				         "clipTo":null,
				         "backgroundColor":"",
				         "src":"http://127.0.0.1:9000/images/640x1138.jpg",
				         "filters":[  
				            {  
				               "type":"Tint",
				               "color":"#ffffff",
				               "opacity":0
				            }
				         ],
				         "crossOrigin":"anonymous",
				         "name":"app-screenshot"
				      },
				      {  
				         "type":"image",
				         "originX":"left",
				         "originY":"top",
				         "left":1290,
				         "top":2479,
				         "width":428,
				         "height":428,
				         "fill":"rgb(0,0,0)",
				         "stroke":null,
				         "strokeWidth":1,
				         "strokeDashArray":null,
				         "strokeLineCap":"butt",
				         "strokeLineJoin":"miter",
				         "strokeMiterLimit":10,
				         "scaleX":1,
				         "scaleY":1,
				         "angle":0,
				         "flipX":false,
				         "flipY":false,
				         "opacity":1,
				         "shadow":null,
				         "visible":true,
				         "clipTo":"function (ctx) {\n\t\t    ctx.arc(0, 0, this.width / 2 , 0, 2*Math.PI, true);\n\t\t}",
				         "backgroundColor":"",
				         "src":"http://127.0.0.1:9000/images/428x428.jpg",
				         "filters":[  

				         ],
				         "crossOrigin":"anonymous",
				         "name":"testimoni-pic-right"
				      },
				      {  
				         "type":"image",
				         "originX":"left",
				         "originY":"top",
				         "left":151,
				         "top":2479,
				         "width":428,
				         "height":428,
				         "fill":"rgb(0,0,0)",
				         "stroke":null,
				         "strokeWidth":1,
				         "strokeDashArray":null,
				         "strokeLineCap":"butt",
				         "strokeLineJoin":"miter",
				         "strokeMiterLimit":10,
				         "scaleX":1,
				         "scaleY":1,
				         "angle":0,
				         "flipX":false,
				         "flipY":false,
				         "opacity":1,
				         "shadow":null,
				         "visible":true,
				         "clipTo":"function (ctx) {\n\t\t    ctx.arc(0, 0, this.width / 2 , 0, 2*Math.PI, true);\n\t\t}",
				         "backgroundColor":"",
				         "src":"http://127.0.0.1:9000/images/428x428.jpg",
				         "filters":[  

				         ],
				         "crossOrigin":"anonymous",
				         "name":"testimoni-pic-left"
				      }
				   ],
				   "background":"#ffffff",
				   "backgroundImage":{  
				      "type":"image",
				      "originX":"left",
				      "originY":"top",
				      "left":0,
				      "top":0,
				      "width":2480,
				      "height":3508,
				      "fill":"rgb(0,0,0)",
				      "stroke":null,
				      "strokeWidth":1,
				      "strokeDashArray":null,
				      "strokeLineCap":"butt",
				      "strokeLineJoin":"miter",
				      "strokeMiterLimit":10,
				      "scaleX":1,
				      "scaleY":1,
				      "angle":0,
				      "flipX":false,
				      "flipY":false,
				      "opacity":1,
				      "shadow":null,
				      "visible":true,
				      "clipTo":null,
				      "backgroundColor":"",
				      "src":"http://127.0.0.1:9000/images/stiker_a4_2480x3508.jpg",
				      "filters":[  

				      ],
				      "crossOrigin":""
				   },
				   "height":3508,
				   "width":2480,
				   "originalHeight":3508,
				   "originalWidth":2480
			};
            $scope.mobile.loadJSON = function(){
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

	                // get anchor link
	                var anchor = document.getElementById(id);
	                anchor.download = name + ".png";
	                anchor.href = fabric.getCanvasBlob();

            		$scope.loading = false;
                	$scope.mobile.disable.generate = false;
	                $scope.mobile.disable.download = false;

	                fabric.canvasScale = initialCanvasScale;
	                fabric.setZoom();
                }, 3000);
            }

    }]);
});
