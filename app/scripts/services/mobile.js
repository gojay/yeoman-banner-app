define(['angular'], function (angular) {
  'use strict';

  angular.module('bannerAppApp.services.Mobile', [])
	.service('Postermobile', function Postermobile() {
	// AngularJS will instantiate a singleton by calling "new" on this function
		return {
			model: {
	            text: {
	                app  : 'Name of App',
	                left : 'Lorem ipsum dolor sit amet\nlorem ipsum dolor\namet consectetur\n\nYour Name',
	                right: 'Lorem ipsum dolor sit amet\nlorem ipsum dolor\namet consectetur\n\nYour Name'
	            },
	            images: {
	                screenshot: null,
	                testimonials: {
	                    left: null,
	                    right: null
	                }
	            },
	            qr: {
	                iphone: {
	                    url    : null,
	                    valid  : false,
	                    loading: false,
	                },
	                android: {
	                    url    : null,
	                    valid  : false,
	                    loading: false,
	                }
	            },
	            dimensions: {
	                app: null,
	                testimonial : null,
	                qr : null
	            },
	            disable: {
	                generate: true,
	                download: true,
	            },
	            photos: [],
	            poster: null
	        },
	        presetSizes: [{
				name: 'A4 200 PPI (1654x2339)',
				type  : 'a4',
				ppi   : 200,
				height: 2339,
				width: 1654
			},
			{
				name: 'A4 300 PPI (2480x3508)',
				type  : 'a4',
				ppi   : 300,
				height: 3508,
				width : 2480
			},
			{
				name: 'A5 300 PPI (1167x1653)',
				type  : 'a5',
				ppi   : 300,
				height: 1653,
				width : 1167
			}],
			CustomAttributes: {
				'a4': {
					200 : {
						'text':{
							app : {
								name: 'app-name',
								left: 674,
								top: 266,
								fontSize: 52,
								fill: '#434343',
								textAlign: 'center'
							},
							people: {
								left:{
			                        name  : 'testimoni-text-left',
			                        fill  : '#313131',
									fontSize: 28,
									left: 414,
									top: 1691,
                        			opacity: 0.5
								},
								right:{
                        			name: 'testimoni-text-right',
			                        fill  : '#313131',
									fontSize: 28,
									left: 1174,
									top: 1691,
                        			opacity: 0.5
								}
							}
						},
						'ss': {
                    		name  : 'app-screenshot',
							width : 430, 
							height: 760,
							left  : 214,
							top   : 560
						},
						'qr': {
							'iphone': {
								name  : 'qr-iphone',
								width : 180,
								height: 180,
								top   : 1240,
								left  : 882
							},
							'android': {
								name  : 'qr-android',
								width : 180,
								height: 180,
								top   : 1240,
								left  : 1283
							}
						},
						'people': {
							left: {
								name  : 'testimoni-pic-left',
								width : 285,
								height: 285,
								top   : 1653,
								left  : 99
							},
							right: {
								name  : 'testimoni-pic-right',
								width : 285,
								height: 285,
								top   : 1653,
								left  : 860
							}
						}
					},

					300: {
						'text':{
							app : {
								name 	 : 'app-name',
								left 	 : 964,
								top 	 : 360,
								fontSize : 95,
								fill 	 : '#434343',
								textAlign: 'center'
							},
							people: {
								left:{
			                        name  	: 'testimoni-text-left',
			                        fill  	: '#313131',
									fontSize: 42,
									left 	: 621,
									top 	: 2537
								},
								right:{
                        			name 	: 'testimoni-text-right',
			                        fill  	: '#313131',
									fontSize: 42, 
									left 	: 1761,
									top 	: 2537 
								}
							}
						},
						'ss': {
                    		name  : 'app-screenshot',
							width : 640,
							height: 1138,
							left  : 324,
							top   : 842
						},
						'qr': {
							'iphone': {
								name  : 'qr-iphone',
								width : 280,
								height: 280,
								top   : 1852,
								left  : 1316
							},
							'android': {
								name  : 'qr-android',
								width : 280,
								height: 280,
								top   : 1852,
								left  : 1914
							}
						},
						'people': {
							left: {
								name  : 'testimoni-pic-left',
								width : 428,
								height: 428,
								top : 2479,
								left: 151
							},
							right: {
								name  : 'testimoni-pic-right',
								width : 428,
								height: 428,
								top : 2479,
								left: 1290
							}
						}
					}
				},
				'a5': {
					300: {
						'text':{
							app : {
								name 	 : 'app-name',
								fontSize: 46, // 65 * 3
								left: 448, // 314 * 3
								top : 188,   // 120 * 3
								fill 	 : '#434343',
								textAlign: 'center'
							},
							people: {
								left:{
			                        name  	: 'testimoni-text-left',
			                        fill  	: '#313131',
									fontSize: 18,  // 43 * 3
									left: 286, // 201 * 3
									top: 1203  // 751 * 3
								},
								right:{
			                        name  	: 'testimoni-text-right',
			                        fill  	: '#313131',
									fontSize: 18,   // 43 * 3
									left: 828, // 201 * 3
									top: 1203   // 751 * 3
								}
							}
						},
						'ss': {
                    		name  : 'app-screenshot',
							width: 302,
							height: 536,
							left: 152,
							top : 396
						},
						'qr': {
							'iphone': {
								name  : 'qr-iphone',
								width : 130,
								height: 130,
								top : 875, // 1836
								left: 615 // 1306
							},
							'android': {
								name  : 'qr-android',
								width: 130,
								height: 130,
								top : 875, // 1836
								left: 903 // 1906
							}
						},
						'people': {
							left: {
								name  : 'testimoni-pic-left',
								width : 205, // 220 
								height: 205, // 220
								top   : 1167, // 0
								left  : 69 // 176 52
							},
							right: {
								name  : 'testimoni-pic-right',
								width : 205, // 205
								height: 205, // 205
								top   : 1167, // 0 751
								left  : 605 // 1316 394
							}
						}
					}
				}
			},
			JSONExample : {
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
			      "filters":[],
			      "crossOrigin":""
			   },
			   "height":3508,
			   "width":2480,
			   "originalHeight":3508,
			   "originalWidth":2480
			}
		}
	})
	.service('RecentMobilePhotos', ['authResource', '$q',
		function RecentMobilePhotos(authResource, $q){
			return function(){
				var deferred = $q.defer();
				authResource.authentifiedRequest('GET', '/splash/mobiles/photos', {}, function(data){
					deferred.resolve(data);
				}, function(err){
					deferred.reject('Unable to fetch splash mobile photos ' + err);
				})
				return deferred.promise;
			};
		}
	])
	.service('RecentMobiles', ['authResource', '$q',
		function RecentMobiles(authResource, $q){
			return function(){
				var deferred = $q.defer();
				authResource.authentifiedRequest('GET', '/splash/mobiles', {}, function(data){
					deferred.resolve(data);
				}, function(err){
					deferred.reject('Unable to fetch splash mobile ' + err);
				})
				return deferred.promise;
			};
		}
	])
	.service('DetailMobile', ['authResource', '$q', '$route',
		function DetailMobile(authResource, $q, $route){
			return function(){
				var deferred = $q.defer();
				authResource.authentifiedRequest('GET', '/splash/mobiles/' + $route.current.params.mobileId, {}, function(data){
					deferred.resolve(data);
				}, function(err){
					deferred.reject('Unable to fetch splash mobile ' + err);
				})
				return deferred.promise;
			};
		}
	])
	.service('SaveMobile', ['authResource', '$q', '$route',
		function SaveMobile(authResource, $q, $route){
			return function( data ){

				var url = '/splash/mobiles',
					method = 'POST';
				if(angular.isDefined($route.current.params.mobileId)) {
					url += '/' + $route.current.params.mobileId;
					method = 'PUT';
				}

				console.log('SaveMobile:params', method, url);
				console.log('SaveMobile:data', data);

				var deferred = $q.defer();
				authResource.authentifiedRequest(method, url, data, function(response){
					deferred.resolve(response);
				}, function(err){
					deferred.reject(err);
				})
				return deferred.promise;
			};
		}
	]);
});
