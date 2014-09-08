define(['angular'], function (angular) {
  'use strict';

  angular.module('bannerAppApp.services.Postermobile', [])
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
	            photos: []
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
								size: 52,
								left: 674,
								top: 266
							},
							people: {
								left:{
									size: 28,
									left: 414,
									top: 1691
								},
								right:{
									size: 28,
									left: 1174,
									top: 1691
								}
							}
						},
						'ss': {
							width: 430, 
							height: 760,
							left: 214,
							top : 560
						},
						'qr': {
							'iphone': {
								width : 180,
								height: 180,
								top : 1240,
								left: 882
							},
							'android': {
								width: 180,
								height: 180,
								top : 1240,
								left: 1283
							}
						},
						'people': {
							left: {
								width : 285,
								height: 285,
								top : 1653,
								left: 99
							},
							right: {
								width : 285,
								height: 285,
								top : 1653,
								left: 860
							}
						}
					},

					300: {
						'text':{
							app : {
								size: 95,
								left: 964,
								top: 360
							},
							people: {
								left:{
									size: 42,
									left: 621,
									top: 2537
								},
								right:{
									size: 42, 
									left: 1761,
									top: 2537 
								}
							}
						},
						'ss': {
							width: 640,
							height: 1138,
							left: 324,
							top : 842
						},
						'qr': {
							'iphone': {
								width: 280,
								height: 280,
								top : 1852,
								left: 1316
							},
							'android': {
								width: 280,
								height: 280,
								top : 1852,
								left: 1914
							}
						},
						'people': {
							left: {
								width : 428,
								height: 428,
								top : 2479,
								left: 151
							},
							right: {
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
								size: 46, // 65 * 3
								left: 448, // 314 * 3
								top : 188   // 120 * 3
							},
							people: {
								left:{
									size: 18,  // 43 * 3
									left: 286, // 201 * 3
									top: 1203  // 751 * 3
								},
								right:{
									size: 18,   // 43 * 3
									left: 828, // 201 * 3
									top: 1203   // 751 * 3
								}
							}
						},
						'ss': {
							width: 302,
							height: 536,
							left: 152,
							top : 396
						},
						'qr': {
							'iphone': {
								width : 130,
								height: 130,
								top : 875, // 1836
								left: 615 // 1306
							},
							'android': {
								width: 130,
								height: 130,
								top : 875, // 1836
								left: 903 // 1906
							}
						},
						'people': {
							left: {
								width : 205, // 220 
								height: 205, // 220
								top : 1167, // 0
								left: 69 // 176 52
							},
							right: {
								width : 205, // 205
								height: 205, // 205
								top : 1167, // 0 751
								left: 605 // 1316 394
							}
						}
					}
				}
			}
		}
	})
	.service('RecentMobilePhotos', ['AuthResource', '$q',
		function(AuthResource, $q, $rootScope){
			return function(){

				var deferred = $q.defer();

				AuthResource.authentifiedRequest('GET', window.apiURL + '/api/splash/mobile', {}, function(data){
					deferred.resolve(data);
				}, function(err){
					deferred.reject('Unable to fetch splash mobile photos ' + err);
				})
				return deferred.promise;
			};
		}
	]);
});
